import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SignalrService } from 'src/app/Service/signalr.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements DoCheck, OnInit {
  OwnersNum: number = 0;
  ServicesCount: number = 0;
  ComplainsNum: number = 0;
  newOwnersRegisterCount: string = `${this.OwnersNum}`;
  newServicesAddedCount: string = `${this.ServicesCount}`;
  newComplainsCount: string = `${this.ComplainsNum}`;
  token: any;
  tokenData: any;
  isLogged = false;
  navhidden = false;
  role: string | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,

    private signalrService: SignalrService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.signalrService.startNotificationsHubConnection();
    this.signalrService.newOwnerRegister(() => {
      this.newOwnerRegisterNotification();
    });
  }

  ngDoCheck(): void {
    this.token = localStorage.getItem('token');

    // if (this.token != null) {
    //   this.navhidden = true;
    //   this.tokenData = jwt_decode(this.token);

    // } else {
    //   this.navhidden = false;
    // }
    this.navhidden = true;
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.navhidden = false;
    this.router.navigate(['/login']);
  }
  public newOwnerRegisterNotification(): void {
    this.toastr.info('تم تسجيل مالك جديد في الموقع', 'تسجيل مالك جديد');
    this.OwnersNum++;
    if (this.OwnersNum > 9) {
      this.newOwnersRegisterCount = `+9`;
    } else {
      this.newOwnersRegisterCount = `${this.OwnersNum}`;
    }
  }
  public newServicesNotification(): void {
    this.toastr.info('تم تسجيل مالك جديد في الموقع', 'تسجيل مالك جديد');
    this.ServicesCount++;
    if (this.ServicesCount > 9) {
      this.newServicesAddedCount = `+9`;
    } else {
      this.newServicesAddedCount = `${this.ServicesCount}`;
    }
  }
  public newComplaintNotification(): void {
    this.toastr.info('تم تسجيل مالك جديد في الموقع', 'تسجيل مالك جديد');
    this.ComplainsNum++;
    if (this.ComplainsNum > 9) {
      this.newComplainsCount = `+9`;
    } else {
      this.newComplainsCount = `${this.ComplainsNum}`;
    }
  }
}
