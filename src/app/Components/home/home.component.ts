import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tokenData: any;
  token: any;
  UserDashboardName: any;

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.tokenData = jwt_decode(this.token);
    this.UserDashboardName =
      this.tokenData[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ];

    var options = {
      strings: [
        'مرحبا بك في لوحة تحكم موقع فرح',
        'نسهل عليك إدارة خدماتك، يمكنك إضافة خدمات جديدة، متابعة الطلبات التي تتلقاها، والتواصل مع الدعم الفني للحصول على المساعدة التي تحتاجها.',
      ],
      typeSpeed: 50,
      backSpeed: 40,
      backDelay: 1000,
      loop: true,
      showCursor: false,
    };
    var typed = new Typed('.typed-message', options);
  }
}
