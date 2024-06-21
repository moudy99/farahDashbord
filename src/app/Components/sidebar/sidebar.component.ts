import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/Service/auth.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements DoCheck, OnInit {
  token: any;
  tokenData: any;
  isLogged = false;
  navhidden = false;
  role: string | null = null;
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {
    this.role = this.authService.getRole();
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
}
