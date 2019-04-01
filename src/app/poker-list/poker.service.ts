import { User } from './../auth/user.model';
import { Poker } from './poker.model';
import { AuthService } from '../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import { AngularFirestore } from 'angularfire2/firestore';
import {map, take} from 'rxjs/operators';

@Injectable()
export class PokerService {
    private availablePokers: Poker[] = [];
    availablePokersChanged = new Subject<Poker[]>();

    private subscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService, private authService: AuthService) { }

    public createPoker(name: string) {
        this.db.collection('availablePokers')
        .add({ name: name, count: 1, date: new Date(), createdBy: this.authService.getCurrentUser().email})
            .then(result => {
                this.uiService.showNotification('Poker successfully created!', null, 3000);
            }).catch(error => {
                this.uiService.showNotification('Error saving poker!', null, 3000);
            });
    }
    public getPoker(id: string) {
        this.addCurrentUser(id);
        return this.db.doc<Poker>('availablePokers/' + id).valueChanges();
    }
    public exitPoker(id: string) {
      const user = this.authService.getCurrentUser();
      this.evictUser(id, user.email);
    }
    evictUser(voteId, userMail) {
      this.db.doc<Poker>('availablePokers/' + voteId)
        .collection<any>('users', ref => ref.where('email', '==', userMail))
        .snapshotChanges().pipe(take(1)).pipe(map(
        docData => {
          return docData.map(doc => {
            return {
              docId: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        }
      )).subscribe(value => {
        if (value && value.length > 0) {
          this.db.doc('availablePokers/' + voteId + '/users/' + value[0].docId).delete();
          this.reCalculateVote(voteId);
        } else {
          console.log('doesnt exits');
        }
      });
    }
    public getPokerUsers(id: string) {
        return this.db.doc('availablePokers/' + id).collection<User[]>('users').snapshotChanges().pipe(map(
            docData => {
                return docData.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    };
                });
            }
        ));
    }


    fetchAvailablePokers() {
        this.uiService.avaliablePokersLoaded.next(false);
        this.subscriptions.push(this.db.collection('availablePokers').snapshotChanges().pipe(map(
            docData => {
                return docData.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    };
                });
            }
        )).subscribe((results: Poker[]) => {
            this.availablePokers = results;
            this.availablePokersChanged.next([...this.availablePokers]);
            this.uiService.avaliablePokersLoaded.next(true);
        }, error => {
            this.uiService.avaliablePokersLoaded.next(true);
            this.uiService.showNotification('Fetching available pokers failed!', null, 3000);
            this.availablePokersChanged.next(null);
        }));
    }

    addCurrentUser(id) {
        const user = this.authService.getCurrentUser();
        this.db.doc<Poker>('availablePokers/' + id)
          .collection<any>('users', ref => ref.where('email', '==', user.email))
          .valueChanges().pipe(take(1)).subscribe(value => {
            if (value && value.length > 0) {
              console.log('exists');
            } else {
              this.db.doc<Poker>('availablePokers/' + id).collection<any>('users').add(user);
              this.resetVote(id);
            }
        });

    }

    vote(id, vote: number) {
      const user = this.authService.getCurrentUser();
      this.db.doc<Poker>('availablePokers/' + id)
        .collection<any>('users', ref => ref.where('email', '==', user.email))
        .snapshotChanges().pipe(take(1)).pipe(map(
        docData => {
          return docData.map(doc => {
            return {
              userId: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        }
      )).subscribe(value => {
        if (value && value.length > 0) {
          this.db.doc('availablePokers/' + id + '/users/' + value[0].userId).update({voted: true, vote: +vote});
          this.reCalculateVote(id);
        } else {
          console.log('User doesnt exits in this poker!');
        }
      });
    }

  private reCalculateVote(id) {
    this.db.doc<Poker>('availablePokers/' + id).collection<any>('users').valueChanges()
      .pipe(take(1)).subscribe((users: User[]) => {
      let pokerFinished = true;
      let counter = 0;
      let total = 0;
      for (const votedUser of users) {
        if (!votedUser.voted) {
          pokerFinished = false;
        } else {
          counter++;
          total += votedUser.vote;
        }
      }
      if (pokerFinished) {
        this.db.doc('availablePokers/' + id).update({pokerFinished: true, totalVote: total / counter});
      }
    });
  }

  resetVote(id) {
      const user = this.authService.getCurrentUser();
      this.db.doc('availablePokers/' + id).update({pokerFinished: false, totalVote: 0});
      this.db.doc<Poker>('availablePokers/' + id).collection<any>('users')
        .snapshotChanges().pipe(take(1)).pipe(map(
        docData => {
          return docData.map(doc => {
            return {
              userId: doc.payload.doc.id
            };
          });
        }
      )).subscribe(votedUsers => {
        if (votedUsers && votedUsers.length > 0) {
          for (const votedUser of votedUsers) {
            this.db.doc('availablePokers/' + id + '/users/' + votedUser.userId).update({voted: false});
          }
        }});
    }
}
