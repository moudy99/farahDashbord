import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/Service/login.service';
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
          console.log(response.body);
          console.log(response.body.data);
          // Check the structure of the response
          if (response && response.body.succeeded && response.body.data.token) {
            const token = response.body.data.token;
            const role = response.body.data.role;
            const username = response.body.data.name;

            if (role === 'Owner') {
              localStorage.setItem('token', token);
              localStorage.setItem('role', role);
              sessionStorage.setItem('username', username);
              this.router.navigate(['/home']);
            } else {
              this.errorMessage = 'غير مسموح للمستخدم الدخول الي لوحة التحكم.';
              console.error('Unauthorized role.');
            }
          } else {
            console.error('Token not found in the response data.');
          }
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
