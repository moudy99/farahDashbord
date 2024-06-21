import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Service/login.service';
import { SendOtpService } from 'src/app/Service/send-otp.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResetPasswordService } from 'src/app/Service/reset-password.service';
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

  isLoading = false;

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
    const rememberMe = !!this.loginForm.value.rememberMe;

    if (typeof email === 'string' && typeof password === 'string') {
      this.loginService.login(email, password).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.isLoading = false;
          this.handleLoginResponse(response, rememberMe);
        },
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          this.handleLoginError(error);
        },
      });
    } else {
      this.spinner.hide();
      this.isLoading = false;
      console.error('البريد الإلكتروني أو كلمة المرور ليست سلسلة نصية.');
    }
  }

  handleLoginResponse(response: any, rememberMe: boolean) {
    if (response && response.body.succeeded && response.body.data.token) {
      const token = response.body.data.token;
      const role = response.body.data.role;
      const accountStatus = response.body.data.accountStatus;
      const isConfirmed = response.body.data.isEmailConfirmed;
      console.log(role);
      localStorage.setItem('token', token);

      if (role === 'Admin') {
        this.handleAdminLogin(token, role, response.body.data.name, rememberMe);
      } else if (role === 'Owner') {
        this.handleOwnerLogin(
          isConfirmed,
          accountStatus,
          token,
          role,
          response.body.data.name,
          rememberMe
        );
      } else {
        this.showErrorMessage('غير مسموح لك بتسجيل الدخول هنا.');
      }
    } else {
      this.showErrorMessage('حاول الدخول مرة أخرى.');
    }
  }

  handleAdminLogin(
    token: string,
    role: string,
    name: string,
    rememberMe: boolean
  ) {
    this.storeCredentials(rememberMe, token, role, name);
    this.router.navigate(['/home']);
  }

  handleOwnerLogin(
    isConfirmed: boolean,
    accountStatus: string,
    token: string,
    role: string,
    name: string,
    rememberMe: boolean
  ) {
    if (!isConfirmed) {
      Swal.fire({
        icon: 'info',
        title: 'لم يتم تأكيد البريد الإلكتروني',
        text: 'هل تريد إرسال رمز التفعيل إلى بريدك الإلكتروني؟',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا',
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.sendOtpService.resendOTP().subscribe({
            next: () => {
              this.spinner.hide();
              this.promptForOtp();
            },
            error: (error) => {
              this.spinner.hide();
              this.showErrorMessage(
                'حدث خطأ أثناء إرسال الرمز. حاول مرة أخرى.'
              );
            },
          });
        }
      });
    } else if (accountStatus === 'Pending') {
      Swal.fire({
        icon: 'info',
        title: 'قيد المراجعة',
        text: 'نحن حالياً نراجع حسابك، سيتم إرسال رسالة إلى بريدك الإلكتروني بمجرد قبول حسابك. شكراً لانتظارك.',
      });
    } else if (accountStatus === 'Accepted') {
      this.storeCredentials(rememberMe, token, role, name);
      this.router.navigate(['/home']);
    } else {
      console.error('حالة الحساب غير معروفة.');
    }
  }

  handleLoginError(error: any) {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    });
    console.log(error);
  }

  promptForOtp(errorMessage?: string) {
    Swal.fire({
      icon: 'info',
      title: 'تم إرسال رمز التفعيل',
      text:
        errorMessage ||
        'تم إرسال رمز التفعيل إلى بريدك الإلكتروني. يرجى إدخال الرمز هنا لتفعيل بريدك الإلكتروني:',
      input: 'text',
      inputPlaceholder: 'أدخل رمز التفعيل',
      showCancelButton: true,
      confirmButtonText: 'تأكيد',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        const otp = result.value;
        this.verifyOtp(otp);
      }
    });
  }

  verifyOtp(otp: string) {
    this.spinner.show();
    this.sendOtpService.confirmEmail(otp).subscribe({
      next: (verifyResponse) => {
        this.spinner.hide();
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
          this.promptForOtp(
            'الرمز غير صحيح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.'
          );
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.promptForOtp('حدث خطأ أثناء التحقق من الرمز. حاول مرة أخرى.');
      },
    });
  }

  storeCredentials(
    rememberMe: boolean,
    token: string,
    role: string,
    name: string
  ) {
    if (rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', name);
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('username', name);
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
          this.promptForOtp(
            'الرمز غير صحيح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.'
          );
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.promptForOtp(
          'الرمز غير صحيح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.'
        );
      },
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: message,
    });
  }
}
