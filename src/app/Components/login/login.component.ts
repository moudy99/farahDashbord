import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/Service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: string | undefined;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private loginService: LoginService) {}

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    // Ensure that email and password are strings
    if (typeof email === 'string' && typeof password === 'string') {
      this.loginService.login(email, password).subscribe({
        next: (response: any) => {
          console.log(response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = 'الايميل او كلمة المرور غير صحيح.';
          console.log(error);
        },
      });
    } else {
      console.error('Email or password is not a string.');
    }
  }
}
