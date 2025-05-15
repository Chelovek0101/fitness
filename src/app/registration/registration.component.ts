import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {
  public isDisplayProgressBar = false;

  public registrationForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {}

  registration(): void {
    const newUsername = this.registrationForm.value.username;
    const newPassword = this.registrationForm.value.password;
    this.authSvc.registration(newUsername, newPassword);
  }
}
