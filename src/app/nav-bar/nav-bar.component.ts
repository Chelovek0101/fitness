import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnDestroy {
  private unsubscribe$ = new Subject();
  public currentUser: string | null = null;
  public currentLang: string;

  public constructor(
    private readonly authSvc: AuthService,
    private readonly router: Router
  ) {
    this.authSvc
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((currentUserData) => (this.currentUser = currentUserData));
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(console.log('unsubscribe'));
    this.unsubscribe$.complete();
  }

  public logout(): void {
    this.authSvc.logout();
    this.router.navigate(['login']).then();
  }
}
