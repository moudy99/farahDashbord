import { Component } from '@angular/core';
import { ResetPasswordService } from 'src/app/Service/reset-password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  oldPassword: string = '';
  newPassword1: string = '';
  newPassword2: string = '';
  securityQuestionAnswer: string = '';
  minCharacterNumber: number = 6;

  constructor(private resetPasswordService: ResetPasswordService) {}

  get isOldPasswordFilled() {
    return Boolean(this.oldPassword.length);
  }

  get arePasswordsEqual() {
    return (
      this.newPassword1 &&
      this.newPassword2 &&
      this.newPassword1 === this.newPassword2
    );
  }

  get hasAtLeastSixCharacters() {
    return this.newPassword1.length >= this.minCharacterNumber;
  }

  get hasOneUpperCaseLetter() {
    const rule = /(.*[A-Z].*)/;
    return rule.test(this.newPassword1);
  }

  get hasOneLowerCaseLetter() {
    const rule = /(.*[a-z].*)/;
    return rule.test(this.newPassword1);
  }

  get hasOneNumber() {
    const rule = /[0-9]{1}/;
    return rule.test(this.newPassword1);
  }
  save() {
    if (!this.arePasswordsEqual) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يجب أن تتطابق كلمة المرور الجديدة مع تأكيد كلمة المرور',
      });
      return;
    }

    if (
      !this.isOldPasswordFilled ||
      !this.hasAtLeastSixCharacters ||
      !this.hasOneUpperCaseLetter ||
      !this.hasOneLowerCaseLetter ||
      !this.hasOneNumber
    ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'الرجاء تعبئة جميع الحقول بشكل صحيح',
      });
      return;
    }

    const token = localStorage.getItem('token');
    this.resetPasswordService
      .changePassword(
        this.oldPassword,
        this.newPassword1,
        this.securityQuestionAnswer
      )
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'تم تغيير كلمة المرور بنجاح!',
            text: 'تم تحديث كلمة المرور بنجاح',
            confirmButtonText: 'حسناً',
          }).then(() => {
            this.reset();
          });
        },
        error: (error) => {
          let errorMessage =
            'حدثت مشكلة أثناء محاولة تغيير كلمة المرور. يرجى المحاولة مرة أخرى.';
          if (
            error.error &&
            error.error.errors &&
            error.error.errors.length > 0
          ) {
            errorMessage = error.error.errors[0];
          }
          Swal.fire({
            icon: 'error',
            title: 'فشل تغيير كلمة المرور!',
            text: errorMessage,
            confirmButtonText: 'حسناً',
          });
          console.error('Error changing password:', error);
        },
      });
  }

  reset() {
    this.oldPassword = '';
    this.newPassword1 = '';
    this.newPassword2 = '';
    this.securityQuestionAnswer = '';
  }
}
