import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Service/login.service';
import { SendOtpService } from 'src/app/Service/send-otp.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResetPasswordService } from 'src/app/Service/reset-password.service';

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

  isLoading = false; // Add isLoading flag

  constructor(
    private router: Router,
    private loginService: LoginService,
    private resetPasswordService: ResetPasswordService,
    private sendOtpService: SendOtpService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    const email = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    const rememberMe = this.loginForm.value.rememberMe;

    if (typeof email === 'string' && typeof password === 'string') {
      this.loginService.login(email, password).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.isLoading = false;
          if (response && response.body.succeeded && response.body.data.token) {
            const token = response.body.data.token;
            const role = response.body.data.role;
            const accountStatus = response.body.data.accountStatus;
            const isConfirmed = response.body.data.isEmailConfirmed;

            localStorage.setItem('token', token); // Store token in localStorage

            if (role === 'Owner') {
              if (!isConfirmed) {
                this.sendOtpService.resendOTP().subscribe({
                  next: () => {
                    Swal.fire({
                      icon: 'info',
                      title: 'لم يتم تأكيد البريد الإلكتروني',
                      text: 'تم إرسال رمز التفعيل إلى بريدك الإلكتروني. يرجى إدخال الرمز هنا لتفعيل بريدك الإلكتروني:',
                      input: 'text',
                      inputPlaceholder: 'أدخل رمز التفعيل',
                      showCancelButton: true,
                      confirmButtonText: 'تأكيد',
                      cancelButtonText: 'إلغاء',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        const otp = result.value;
                        this.sendOtpService.confirmEmail(otp).subscribe({
                          next: (verifyResponse) => {
                            if (verifyResponse && verifyResponse.succeeded) {
                              Swal.fire({
                                icon: 'success',
                                title: 'تم التفعيل بنجاح',
                                text: 'تم تفعيل بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.',
                              }).then(() => {
                                localStorage.clear();
                                sessionStorage.clear();
                                this.router.navigate(['/login']);
                              });
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'خطأ',
                                text: 'الرمز غير صحيح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.',
                              });
                            }
                          },
                          error: (error) => {
                            Swal.fire({
                              icon: 'error',
                              title: 'خطأ',
                              text: 'حدث خطأ أثناء التحقق من الرمز. حاول مرة أخرى.',
                            });
                          },
                        });
                      }
                    });
                  },
                  error: (error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'خطأ',
                      text: 'حدث خطأ أثناء إرسال الرمز. حاول مرة أخرى.',
                    });
                  },
                });
              } else if (accountStatus === 'Pending') {
                Swal.fire({
                  icon: 'info',
                  title: 'قيد المراجعة',
                  text: 'نحن حالياً نراجع حسابك، سيتم إرسال رسالة إلى بريدك الإلكتروني بمجرد قبول حسابك. شكراً لانتظارك.',
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
          this.spinner.hide();
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
          });
          console.log(error);
        },
      });
    } else {
      this.spinner.hide();
      this.isLoading = false;
      console.error('البريد الإلكتروني أو كلمة المرور ليست سلسلة نصية.');
    }
  }
  openForgotPasswordPopup() {
    Swal.fire({
      title: 'استعادة كلمة المرور',
      input: 'email',
      inputLabel: 'أدخل بريدك الإلكتروني',
      inputPlaceholder: 'البريد الإلكتروني',
      showCancelButton: true,
      confirmButtonText: 'إرسال',
      cancelButtonText: 'إلغاء',
      inputValidator: (value) => {
        if (!value) {
          return 'يرجى إدخال بريدك الإلكتروني!';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const email = result.value;
        this.sendForgotPasswordEmail(email);
      }
    });
  }

  sendForgotPasswordEmail(email: string) {
    this.spinner.show();
    this.resetPasswordService.forgetPassword(email).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.succeeded) {
          Swal.fire({
            icon: 'success',
            title: 'تم الإرسال',
            text: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. صالح لمدة 30 يومًا.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.',
          });
        }
      },
      error: (error) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.',
        });
      },
    });
  }
}
