import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Account {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<string | null>(null);

  constructor() {
    const accountList: Account[] = [{ username: 'root', password: 'toor' }];
    localStorage.setItem('accountList', JSON.stringify(accountList));

    this.currentUser$.next(localStorage.getItem('currentUser'));
  }

  getCurrentUser(): Observable<string | null> {
    return this.currentUser$.asObservable();
  }

  registration(username: string, password: string): void {
    const newAcc: Account[] = [{ username, password }];
    const accountList: Account[] = JSON.parse(localStorage.getItem('accountList') as string).concat(
      newAcc
    );
    localStorage.setItem('accountList', JSON.stringify(accountList));
  }

  login(username: string, password: string): 'ok' | 'wrong-username' | 'wrong-password' {
    const accountList: Account[] = JSON.parse(localStorage.getItem('accountList') as string);
    for (const account of accountList) {
      if (account.username === username) {
        if (account.password === password) {
          localStorage.setItem('currentUser', username);
          this.currentUser$.next(username);
          return 'ok';
        }
        return 'wrong-password';
      }
    }
    return 'wrong-username';
  }


  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser$.next(null);
  }
}
