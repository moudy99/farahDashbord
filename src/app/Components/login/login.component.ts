import { Component } from '@angular/core';
import { FormGroup,FormControl ,Validators} from '@angular/forms';
import { LoginService } from 'src/Service/login.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

token:any;
errorMessage:any;
  loginForm =new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),

})

get getUserName(){
  return this.loginForm.controls['username']
};get getPassword(){
  return this.loginForm.controls['password']
};

constructor(private router: Router,
  private loginService:LoginService) {}


  login() {
    const user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    
    this.loginService.login(user).subscribe({

      next: (response: any) => {
      console.log(response);
        
      this.token = response.body.generatedJwtToken;
      localStorage.setItem("token", this.token); 
      this.router.navigate(['/home']);


      },
      error: (error) => {
        //this.router.navigate(['/login']);
        this.errorMessage = "اسم المستخدم او كلمة المرور غير صحيح.";
        console.log(error);
      }
    });

    
   
  }

  

}
