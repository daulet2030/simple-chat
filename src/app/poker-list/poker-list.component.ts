import { Poker } from './poker.model';
import { PokerService } from './poker.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { UIService } from '../shared/ui.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-poker-list',
  templateUrl: './poker-list.component.html',
  styleUrls: ['./poker-list.component.css']
})
export class PokersListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'count', 'actions'];
  dataSource = new MatTableDataSource<Poker>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  availablePokersSubscription: Subscription;
  availablePokersLoadedSubscription: Subscription;
  loaded: Boolean = false;

  availablePokers: Poker[];
  constructor(private pokerService: PokerService, private uiService: UIService) { }

  ngOnInit() {
    this.availablePokersLoadedSubscription = this.uiService.avaliablePokersLoaded.subscribe(loaded => this.loaded = loaded);
    this.availablePokersSubscription = this.pokerService.availablePokersChanged.subscribe(pokers => this.dataSource.data = pokers);
    this.pokerService.fetchAvailablePokers();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLocaleLowerCase();
  }
  onSubmit(form: NgForm) {
    this.pokerService.createPoker(form.value.poker);
  }
  ngOnDestroy() {
    this.availablePokersLoadedSubscription.unsubscribe();
    this.availablePokersSubscription.unsubscribe();
  }
}
