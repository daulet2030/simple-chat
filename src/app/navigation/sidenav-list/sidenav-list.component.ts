import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  loggedIn: Boolean = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(r => {
        this.loggedIn = r;
    });
  }
  onSignIn() {
    this.authService.login();
  }
  onLogout() {
    this.authService.logout();
    this.onClose();
  }
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
  onClose() {
    this.sidenavToggle.emit();
  }
}
