import { VotingService } from './voting.service';
import { Voting } from './voting.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { UIService } from '../shared/ui.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
@Component({
  selector: 'app-votings-list',
  templateUrl: './votings-list.component.html',
  styleUrls: ['./votings-list.component.css']
})
export class VotingsListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'count', 'actions'];
  dataSource = new MatTableDataSource<Voting>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  availableVotingsSubscription: Subscription;
  availableVotingsLoadedSubscription: Subscription;
  loaded: Boolean = false;

  availableVotings: Voting[];
  constructor(private votingService: VotingService, private uiService: UIService) { }

  ngOnInit() {
    this.availableVotingsLoadedSubscription = this.uiService.avaliableVotingsLoaded.subscribe(loaded => this.loaded = loaded);
    this.availableVotingsSubscription = this.votingService.availableVotingsChanged.subscribe(votings => this.dataSource.data = votings);
    this.votingService.fetchAvailableVotings();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLocaleLowerCase();
  }
  onSubmit(form: NgForm) {
    this.votingService.createVoting(form.value.voting);
  }
  ngOnDestroy() {
    this.availableVotingsLoadedSubscription.unsubscribe();
    this.availableVotingsSubscription.unsubscribe();
  }
}
