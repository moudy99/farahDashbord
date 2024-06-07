import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements DoCheck {
  token: any;
  tokenData: any;
  isLogged = false;
  navhidden = false;
  constructor(private router: Router) {}

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
    this.navhidden = false;
    this.router.navigate(['/login']);
  }
}
