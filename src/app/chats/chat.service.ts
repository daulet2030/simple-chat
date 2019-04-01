import { AuthService } from '../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Chat } from './chat.model';
import { UIService } from '../shared/ui.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {
    private availableChats: Chat[] = [];
    availableChatsChanged = new Subject<Chat[]>();

    private subscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService, private authService: AuthService) { }

    public createChat(name: string) {
        this.db.collection('availableChats').add({ name: name, count: 1, date: new Date() })
            .then(result => {
                this.uiService.showNotification('Chat successfully created!', null, 3000);
            }).catch(error => {
                this.uiService.showNotification('Error storing chat!', null, 3000);
            });
    }
    public getChat(id: string) {
        return this.db.doc<Chat>('availableChats/' + id).valueChanges();
    }
    public exitChat(id: string) {
       return this.db.doc<Chat>('availableChats/' + id).update({count: 0});
    }
    public getChatMessages(id: string) {
        return this.db.doc('availableChats/' + id).collection('messages', ref => ref.orderBy('date')).snapshotChanges().pipe(map(
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


    fetchAvailableChats() {
        this.uiService.avaliableChatsLoaded.next(false);
        this.subscriptions.push(this.db.collection('availableChats').snapshotChanges().pipe(map(
            docData => {
                return docData.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    };
                });
            }
        )).subscribe((results: Chat[]) => {
            this.availableChats = results;
            this.availableChatsChanged.next([...this.availableChats]);
            this.uiService.avaliableChatsLoaded.next(true);
        }, error => {
            this.uiService.avaliableChatsLoaded.next(true);
            this.uiService.showNotification('Fetching available chats failed!', null, 3000);
            this.availableChatsChanged.next(null);
        }));
    }

    sendMessage(message, id) {
        const user = this.authService.getCurrentUser();
        this.db.doc<Chat>('availableChats/' + id).collection<any>('messages').add({
            text: message,
            date: new Date(),
            user: user.name,
            photo: user.photo
        });
    }
}
