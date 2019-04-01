import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from './../../auth/user.model';
import { Poker } from '../poker.model';
import { PokerService } from '../poker.service';
import { ActivatedRoute } from '@angular/router';
import {Component, OnInit, OnDestroy} from '@angular/core';


@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.css']
})
export class PokerComponent implements OnInit, OnDestroy {
  voteId: string;
  vote: Poker;
  possibleVotes = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];
  pokerUsers: User[];
  currentUser: User;
  currentUserSubscription: Subscription;
  constructor(private route: ActivatedRoute, private voteService: PokerService, private authService: AuthService) { }

  ngOnInit() {
    this.voteId = this.route.snapshot.paramMap.get('id');
    this.voteService.getPoker(this.voteId).subscribe(vote => this.vote = vote);
    this.voteService.getPokerUsers(this.voteId).subscribe((users: any) => this.pokerUsers = users);
    this.currentUserSubscription = this.authService.getCurrentUserSubscription().subscribe(user => {
      if (user) {
        this.currentUser = { id: user.uid, email: user.email, name: user.displayName, photo: user.photoURL };
      } else {
        this.currentUser = null;
      }
    });
  }

  onVoteSubmit(myVote: number) {
    this.voteService.vote(this.voteId, myVote);
  }
  onResetVote() {
    this.voteService.resetVote(this.voteId);
  }

  onEvictUser(user){
    this.voteService.evictUser(this.voteId, user.email);
  }
  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event) {
  //   this.voteService.exitPoker(this.voteId);
  //   var now = new Date().getTime();
  //   while(new Date().getTime() < now + 20000);
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {
  //   return true;
  // }

  ngOnDestroy() {
    // this.voteService.exitPoker(this.voteId);
    this.currentUserSubscription.unsubscribe();
  }
}
