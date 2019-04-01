import { User } from '../../auth/user.model';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  loggedIn: Boolean = false;
  user: User;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(r => {
        this.loggedIn = r;
        this.user = this.authService.getCurrentUser();
    });
  }
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
  onSignIn() {
    this.authService.login();
  }
  onLogout() {
    this.authService.logout();
  }

  onToggle() {
    this.sidenavToggle.emit();
  }


}
