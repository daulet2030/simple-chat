import { AuthService } from '../../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import { Chat } from '../chat.model';
import { Subscription } from 'rxjs';
import { Message } from '../message.model';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: Chat;
  chatId: string;
  messages: Message[];
  currentUser: User;
  currentUserSubscription: Subscription;
  constructor(private route: ActivatedRoute, private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id');
    this.chatService.getChat(this.chatId).subscribe(chat => { this.chat = chat; console.log(chat); });
    this.chatService.getChatMessages(this.chatId).subscribe((messages: Message[]) => {
      this.messages = messages;
      setTimeout(() => {
        document.getElementById('message').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    this.currentUserSubscription = this.authService.getCurrentUserSubscription().subscribe(user => {
      if (user) {
        this.currentUser = { id: user.uid, email: user.email, name: user.displayName, photo: user.photoURL };
      } else {
        this.currentUser = null;
      }
    });
  }
  onSubmit(form: NgForm) {
    this.chatService.sendMessage(form.value.message, this.chatId);
    form.resetForm();
  }
  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.chatService.exitChat(this.chatId).then(result => {
      console.log(result);
      console.log(result);
      return true;
   });
  }
}
