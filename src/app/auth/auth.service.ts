import { Subject } from 'rxjs';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { UIService } from '../shared/ui.service';
import { auth } from 'firebase';
import {AngularFireDatabase} from "angularfire2/database";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private loggedIn: Boolean = false;
    currentUser: User;

    constructor(private realTimeDb: AngularFireDatabase, private router: Router, private authService: AngularFireAuth,
        private uiService: UIService) { }

    initAuthListener() {
        this.authService.authState.subscribe(user => {
            if (user) {
                this.currentUser =  { id: user.uid, email: user.email, name: user.displayName, photo: user.photoURL };
                this.loggedIn = true;
                this.authChange.next(true);
                this.updateOnConnect();
                // this.router.navigate(['/']);
            } else {
                this.currentUser = null;
                this.loggedIn = false;
                this.authChange.next(false);
                this.router.navigate(['/']);
            }
        });
    }

    login() {
        this.authService.auth.signInWithPopup(new auth.GoogleAuthProvider())
            .catch(error => {
                this.uiService.showNotification(error.message, null, 3000);
            });
    }

    logout() {
        this.authService.auth.signOut();
    }

    isAuth() {
        return this.loggedIn;
    }

    getCurrentUser() {
        return {...this.currentUser};
    }
    getCurrentUserSubscription() {
        return this.authService.authState;
    }
  /// Helper to perform the update in Firebase
  private updateStatus(status: string) {
    if (!this.currentUser) return

    this.realTimeDb.object(`users/` + this.currentUser.id).update({ status: status })
  }


  /// Updates status when connection to Firebase starts
  private updateOnConnect() {
    return this.realTimeDb.object('.info/connected').valueChanges().pipe(tap(connected => {
        let status = connected ? 'online' : 'offline'
        this.updateStatus(status)
      }))
      .subscribe()
  }

}
