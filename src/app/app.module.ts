import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment.prod';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { MaterialModule } from './material.module';
import { ChatsComponent } from './chats/chats.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { ChatComponent } from './chats/chat/chat.component';
import { ChatService } from './chats/chat.service';
import { PokersListComponent } from './poker-list/poker-list.component';
import { HomeComponent } from './home/home.component';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { PokerService } from './poker-list/poker.service';
import { PokerComponent } from './poker-list/poker/poker.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatsComponent,
    HeaderComponent,
    SidenavListComponent,
    ChatComponent,
    PokersListComponent,
    PokerComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule
  ],
  providers: [AuthService, UIService, ChatService, PokerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
