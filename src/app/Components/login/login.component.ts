import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    const rememberMe = this.loginForm.value.rememberMe;

    if (typeof email === 'string' && typeof password === 'string') {
      this.loginService.login(email, password).subscribe({
        next: (response: any) => {
          if (response && response.body.succeeded && response.body.data.token) {
            console.log(response);
            const token = response.body.data.token;
            const role = response.body.data.role;
            const accountStatus = response.body.data.accountStatus;
            const isConfirmed = response.body.data.isEmailConfirmed;

            if (role === 'Owner') {
              if (accountStatus === 'Pending') {
                Swal.fire({
                  icon: 'info',
                  title: 'قيد المراجعة',
                  text: 'نحن حالياً نراجع حسابك، سيتم إرسال رسالة إلى بريدك الإلكتروني بمجرد قبول حسابك. شكراً لانتظارك.',
                });
              } else if (isConfirmed === false) {
                Swal.fire({
                  icon: 'info',
                  title: 'لم يتم تأكيد البريد الإلكتروني',
                  text: 'يرجى تفعيل البريد الإلكتروني باستخدام الرمز المرسل إلى بريدك الإلكتروني. شكراً.',
                });
              } else if (accountStatus === 'Accepted') {
                if (rememberMe) {
                  localStorage.setItem('token', token);
                  localStorage.setItem('role', role);
                  localStorage.setItem('username', response.body.data.name);
                } else {
                  sessionStorage.setItem('token', token);
                  sessionStorage.setItem('role', role);
                  sessionStorage.setItem('username', response.body.data.name);
                }
                this.router.navigate(['/home']);
              } else {
                console.error('حالة الحساب غير معروفة.');
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'غير مسموح لك بتسجيل الدخول هنا.',
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: 'حاول الدخول مرة أخرى.',
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
          });
          console.log(error);
        },
      });
    } else {
      console.error('البريد الإلكتروني أو كلمة المرور ليست سلسلة نصية.');
    }
  }
}
