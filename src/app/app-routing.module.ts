import { HomeComponent } from './home/home.component';
import { VotingComponent } from './votings-list/voting/voting.component';
import { VotingsListComponent } from './votings-list/votings-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChatsComponent } from './chats/chats.component';
import { AuthGuard } from './auth/auth.guard';
import { ChatComponent } from './chats/chat/chat.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'chat', component: ChatsComponent },
    { path: 'chat/:id', component: ChatComponent },
    { path: 'voting', component: VotingsListComponent },
    { path: 'voting/:id', component: VotingComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
