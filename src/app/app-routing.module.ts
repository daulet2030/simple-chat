import { HomeComponent } from './home/home.component';
import { PokersListComponent } from './poker-list/poker-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChatsComponent } from './chats/chats.component';
import { AuthGuard } from './auth/auth.guard';
import { ChatComponent } from './chats/chat/chat.component';
import { PokerComponent } from './poker-list/poker/poker.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'chat', component: ChatsComponent },
    { path: 'chat/:id', component: ChatComponent },
    { path: 'poker', component: PokersListComponent },
    { path: 'poker/:id', component: PokerComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
