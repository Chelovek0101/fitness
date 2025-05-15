import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  unsubscribe$ = new Subject();
  currentUser: string | null = null;

  constructor(private router: Router, private authSvc: AuthService) {
    this.authSvc
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((currentUserData) => (this.currentUser = currentUserData));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(console.log('unsubscribe'));
    this.unsubscribe$.complete();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.currentUser) {
      return true;
    } else {
      return this.router.createUrlTree(['/login'], {
        queryParams: { url: state.url },
      });
    }
  }
}
