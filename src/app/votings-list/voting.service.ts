import { User } from './../auth/user.model';
import { Voting } from './voting.model';
import { AuthService } from '../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import { AngularFirestore } from 'angularfire2/firestore';
import {map, take} from 'rxjs/operators';
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class VotingService {
    private availableVotings: Voting[] = [];
    availableVotingsChanged = new Subject<Voting[]>();

    private subscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService, private authService: AuthService) { }

    public createVoting(name: string) {
        this.db.collection('availableVotings').add({ name: name, count: 1, date: new Date(), createdBy: this.authService.getCurrentUser().email})
            .then(result => {
                this.uiService.showNotification('Voting successfully created!', null, 3000);
            }).catch(error => {
                this.uiService.showNotification('Error saving voting!', null, 3000);
            });
    }
    public getVoting(id: string) {
        this.addCurrentUser(id);
        return this.db.doc<Voting>('availableVotings/' + id).valueChanges();
    }
    public exitVoting(id: string) {
      const user = this.authService.getCurrentUser();
      this.evictUser(id, user.email);
    }
    evictUser(voteId, userMail){
      this.db.doc<Voting>('availableVotings/' + voteId)
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
        if(value && value.length > 0){
          this.db.doc('availableVotings/' + voteId + '/users/'+value[0].docId).delete();
          this.reCalculateVote(voteId);
        } else {
          console.log('doesnt exits');
        }
      });
    }
    public getVotingUsers(id: string) {
        return this.db.doc('availableVotings/' + id).collection<User[]>('users').snapshotChanges().pipe(map(
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


    fetchAvailableVotings() {
        this.uiService.avaliableVotingsLoaded.next(false);
        this.subscriptions.push(this.db.collection('availableVotings').snapshotChanges().pipe(map(
            docData => {
                return docData.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    };
                });
            }
        )).subscribe((results: Voting[]) => {
            this.availableVotings = results;
            this.availableVotingsChanged.next([...this.availableVotings]);
            this.uiService.avaliableVotingsLoaded.next(true);
        }, error => {
            this.uiService.avaliableVotingsLoaded.next(true);
            this.uiService.showNotification('Fetching available votings failed!', null, 3000);
            this.availableVotingsChanged.next(null);
        }));
    }

    addCurrentUser(id) {
        const user = this.authService.getCurrentUser();
        this.db.doc<Voting>('availableVotings/' + id)
          .collection<any>('users', ref => ref.where('email', '==', user.email))
          .valueChanges().pipe(take(1)).subscribe(value => {
            if(value && value.length > 0){
              console.log('exists');
            } else {
              this.db.doc<Voting>('availableVotings/' + id).collection<any>('users').add(user);
              this.resetVote(id);
            }
        });

    }

    vote(id, vote: number) {
      const user = this.authService.getCurrentUser();
      this.db.doc<Voting>('availableVotings/' + id)
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
        if(value && value.length > 0){
          this.db.doc('availableVotings/' + id + '/users/'+value[0].userId).update({voted: true, vote: +vote});
          this.reCalculateVote(id);
        } else {
          console.log('User doesnt exits in this voting!');
        }
      });
    }

  private reCalculateVote(id) {
    this.db.doc<Voting>('availableVotings/' + id).collection<any>('users').valueChanges()
      .pipe(take(1)).subscribe((users: User[]) => {
      let votingFinished = true;
      let counter: number = 0;
      let total: number = 0;
      for (let votedUser of users) {
        if (!votedUser.voted) {
          votingFinished = false;
        } else {
          counter++;
          total += votedUser.vote;
        }
      }
      if (votingFinished) {
        this.db.doc('availableVotings/' + id).update({votingFinished: true, totalVote: total / counter});
      }
    })
  }

  resetVote(id) {
      const user = this.authService.getCurrentUser();
      this.db.doc('availableVotings/' + id).update({votingFinished: false, totalVote: 0});
      this.db.doc<Voting>('availableVotings/' + id).collection<any>('users')
        .snapshotChanges().pipe(take(1)).pipe(map(
        docData => {
          return docData.map(doc => {
            return {
              userId: doc.payload.doc.id
            };
          });
        }
      )).subscribe(votedUsers => {
        if(votedUsers && votedUsers.length > 0){
          for(let votedUser of votedUsers) {
            this.db.doc('availableVotings/' + id + '/users/'+votedUser.userId).update({voted: false});
          }
        }});
    }
}
