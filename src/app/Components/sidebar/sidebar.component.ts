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
  GroupsPagePower: any;
  BranchesPagePower: any;
  CoursesPagePower: any;
  SubjectsPower: any;
  CoursesToTraineeAdditionPower: any;
  TraineeCombinedAccountStatementPagePower: any;
  TraineeAdditionPower: any;
  UsersPagePower: any;
  navhidden = false;
  constructor(private router: Router) {}

  ngDoCheck(): void {
    this.token = localStorage.getItem('token');

    if (this.token != null) {
      this.navhidden = true;
      this.tokenData = jwt_decode(this.token);

      this.GroupsPagePower = this.tokenData['GroupsPage'] === 'True';
      this.BranchesPagePower = this.tokenData['BranchesPage'] === 'True';
      this.CoursesPagePower = this.tokenData['CoursesPage'] === 'True';
      this.CoursesToTraineeAdditionPower =
        this.tokenData['CoursesToTraineeAdditionPage'] === 'True';
      this.SubjectsPower = this.tokenData['SubjectsPage'] === 'True';
      this.TraineeAdditionPower =
        this.tokenData['TraineeAdditionPage'] === 'True';
      this.TraineeCombinedAccountStatementPagePower =
        this.tokenData['TraineeCombinedAccountStatementPage'] === 'True';
      this.UsersPagePower = this.tokenData['UsersPage'] === 'True';

      console.log(this.GroupsPagePower);
    } else {
      this.navhidden = false;
    }
  }

  signOut() {
    localStorage.clear();
    this.navhidden = false;
    this.router.navigate(['/login']);
  }
}
