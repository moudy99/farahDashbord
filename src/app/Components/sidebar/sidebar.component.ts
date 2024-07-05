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
  // sidebar.component.ts
  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.signalrService.startNotificationsHubConnection();

    const storedServicesCount = localStorage.getItem('notSeenServicesCount');
    const storedOwnersCount = localStorage.getItem('notSeenRegisteredOwners');

    if (storedServicesCount) {
      this.ServicesCount = parseInt(storedServicesCount, 10);
      this.newServicesAddedCount = `${this.ServicesCount}`;
    }

    if (storedOwnersCount) {
      this.OwnersNum = parseInt(storedOwnersCount, 10);
      this.newOwnersRegisterCount = `${this.OwnersNum}`;
    }

    if (this.role === 'Admin') {
      this.signalrService.newOwnerRegister(() => {
        this.newOwnerRegisterNotification();
      });
      this.signalrService.newServiceAdded((data) => {
        this.newServicesNotification(data);
      });
    }
  }

  ngDoCheck(): void {
    this.token = localStorage.getItem('token');
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
  public newServicesNotification(data: any): void {
    this.toastr.info(`تم اضافة خدمة ${data}`, 'اضافة خدمة جديدة');
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
  public openComplaint() {
    this.ComplainsNum = 0;
    this.newComplainsCount = `${this.ComplainsNum}`;
  }
  public openNewServices() {
    this.ServicesCount = 0;
    this.newServicesAddedCount = `${this.ServicesCount}`;
  }
  public openNewOwnerRequests() {
    this.OwnersNum = 0;
    this.newOwnersRegisterCount = `${this.OwnersNum}`;
  }
}
