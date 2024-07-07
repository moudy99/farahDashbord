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
  MessagesNum: number = 0;
  newOwnersRegisterCount: string = `${this.OwnersNum}`;
  newServicesAddedCount: string = `${this.ServicesCount}`;
  newMessagesCount: string = `${this.ServicesCount}`;

  currentUserID: string = '';

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
    this.currentUserID = localStorage.getItem('currentUserId') || '';
    this.role = this.authService.getRole();
    this.signalrService.startNotificationsHubConnection();

    const storedServicesCount = localStorage.getItem('notSeenServicesCount');
    const storedOwnersCount = localStorage.getItem('notSeenRegisteredOwners');
    const storeNewMessagesCount = localStorage.getItem('notSeenMessages');

    if (storedServicesCount) {
      this.ServicesCount = parseInt(storedServicesCount, 10);
      this.newServicesAddedCount = `${this.ServicesCount}`;
    }

    if (storedOwnersCount) {
      this.OwnersNum = parseInt(storedOwnersCount, 10);
      this.newOwnersRegisterCount = `${this.OwnersNum}`;
    }
    if (storeNewMessagesCount) {
      this.MessagesNum = parseInt(storeNewMessagesCount, 10);
      this.newMessagesCount = `${this.MessagesNum}`;
    }

    if (this.role === 'Admin') {
      this.signalrService.newOwnerRegister(() => {
        this.newOwnerRegisterNotification();
      });
      this.signalrService.newServiceAdded((data) => {
        this.newServicesNotification(data);
      });
    }
    // if (this.role == 'Owner') {
    //   console.log(
    //     this.currentUserID === localStorage.getItem('newMessagesReceiverId')
    //   );
    //   this.signalrService.newMessageReceived((data) => {});
    // }
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
  public newMessagedReceived(data: any): void {
    console.log('New Message Received:', data);
    // this.toastr.info(`وصول رسالة جديدة ${data}`, 'رسالة جديدة');
    this.MessagesNum++;
    if (this.MessagesNum > 9) {
      this.newMessagesCount = `+9`;
    } else {
      this.newMessagesCount = `${this.MessagesNum}`;
    }
  }

  public openNewServices() {
    this.ServicesCount = 0;
    this.newServicesAddedCount = `${this.ServicesCount}`;
  }
  public openMessages() {
    this.MessagesNum = 0;
    this.newMessagesCount = `${this.MessagesNum}`;
  }
  public openNewOwnerRequests() {
    this.OwnersNum = 0;
    this.newOwnersRegisterCount = `${this.OwnersNum}`;
  }
}
