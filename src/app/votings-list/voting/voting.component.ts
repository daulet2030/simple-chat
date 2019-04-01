import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from './../../auth/user.model';
import { Voting } from './../voting.model';
import { VotingService } from './../voting.service';
import { ActivatedRoute } from '@angular/router';
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit, OnDestroy {
  voteId: string;
  vote: Voting;
  possibleVotes = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];
  votingUsers: User[];
  currentUser: User;
  currentUserSubscription: Subscription;
  constructor(private route: ActivatedRoute, private voteService: VotingService, private authService: AuthService) { }

  ngOnInit() {
    this.voteId = this.route.snapshot.paramMap.get('id');
    this.voteService.getVoting(this.voteId).subscribe(vote => this.vote = vote);
    this.voteService.getVotingUsers(this.voteId).subscribe((users: any) => this.votingUsers = users);
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
  //   this.voteService.exitVoting(this.voteId);
  //   var now = new Date().getTime();
  //   while(new Date().getTime() < now + 20000);
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {
  //   return true;
  // }

  ngOnDestroy() {
    // this.voteService.exitVoting(this.voteId);
    this.currentUserSubscription.unsubscribe();
  }
}
