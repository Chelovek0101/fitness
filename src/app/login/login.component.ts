import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface Error {
  code: string;
  status: boolean;
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  public redirectUrl = 'workout';

  public isDisplayProgressBar = false;
  public loginForm: FormGroup = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl('')
    }
  );

  public errorList: Array<Error> = [
    {
      code: 'auth/user-not-found',
      status: false,
      msg: 'Пользователь с таким именем не найден',
    },
    { code: 'auth/wrong-password', status: false, msg: 'Неверный пароль' },
  ];

  private querySubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService
  ) {
    this.querySubscription = route.queryParams.pipe(take(1)).subscribe((queryParam: any) => {
      if (queryParam.url) {
        this.redirectUrl = queryParam.url;
      }
    });
  }

  ngOnInit(): void {
    this.authSvc
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((currentUserData) => {
        if (currentUserData) {
          this.router.navigate([this.redirectUrl]).then();
        }
      });
  }

  login(): void {
    this.isDisplayProgressBar = true;
    for (const err of this.errorList) {
      err.status = false;
    }

    const { username, password } = this.loginForm.value;
    const svcAnswer = this.authSvc.login(username, password);

    switch (svcAnswer) {
      case 'ok':
        this.isDisplayProgressBar = false;
        this.router.navigate([this.redirectUrl]).then();
        break;
      case 'wrong-password':
        this.errorList[1].status = true;
        this.isDisplayProgressBar = false;
        break;
      case 'wrong-username':
        this.errorList[0].status = true;
        this.isDisplayProgressBar = false;
        break;
      default:
        console.log('Не типичная ошибка: ', svcAnswer);
    }
  }
}
