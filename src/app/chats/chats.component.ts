import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ChatService } from './chat.service';
import { Chat } from './chat.model';
import { UIService } from '../shared/ui.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'actions'];
  dataSource = new MatTableDataSource<Chat>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  availableChatsSubscription: Subscription;
  availableChatsLoadedSubscription: Subscription;
  loaded: Boolean = false;

  availableChats: Chat[];
  constructor(private chatService: ChatService, private uiService: UIService) { }

  ngOnInit() {
    this.availableChatsLoadedSubscription = this.uiService.avaliableChatsLoaded.subscribe(loaded => this.loaded = loaded);
    this.availableChatsSubscription = this.chatService.availableChatsChanged.subscribe(chats => this.dataSource.data = chats);
    this.chatService.fetchAvailableChats();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLocaleLowerCase();
  }
  onSubmit(form: NgForm) {
    this.chatService.createChat(form.value.chat);
  }
  ngOnDestroy() {
    this.availableChatsLoadedSubscription.unsubscribe();
    this.availableChatsSubscription.unsubscribe();
  }
}
