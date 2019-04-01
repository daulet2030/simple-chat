import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {take, tap} from "rxjs/operators";
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.authService.getCurrentUserSubscription().pipe(
        take(1)).pipe(map(authState => !!authState)).pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['']);
          }
        }));
    }
}
