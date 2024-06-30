import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { GetUsersService } from 'src/app/Service/get-users.service';
import { OwnerAccountStatus } from 'src/app/enums/owner-account-status';
import { environment } from 'src/environments/environment';
import { OwnerService } from 'src/app/Service/owner.service';
import { OwnerResponse } from 'src/app/Interfaces/owner-response';
import { selectOwner } from 'src/app/actions/owners.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Owner } from './../../../Interfaces/owner';

@Component({
  selector: 'app-new-owners-requests',
  templateUrl: './new-owners-requests.component.html',
  styleUrls: ['./new-owners-requests.component.css'],
})
export class NewOwnersRequestsComponent implements OnInit {
  selectedOwner: Owner | null = null;
  paginatedOwners: Owner[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  pages: number[] = [];
  isLoading: boolean = false;

  constructor(
    private getUsersService: GetUsersService,
    private spinner: NgxSpinnerService,
    private ownerServices: OwnerService,
    private router: Router,
    private store: Store<{}>
  ) {}

  ngOnInit(): void {
    this.getAllPendingOwners();
  }

  getAllPendingOwners(): void {
    this.spinner.show();
    this.ownerServices
      .getAllOwners(this.currentPage, this.pageSize, 0, null)
      .subscribe(
        (response: OwnerResponse) => {
          this.paginatedOwners = response.data.map((owner) => ({
            ...owner,
            profileImage: `${environment.UrlForImages}/${owner.profileImage}`,
          }));
          this.totalPages = response.paginationInfo.totalPages;
          this.generatePageNumbers();
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching pending owners:', error);
          this.spinner.hide();
        }
      );
  }

  generatePageNumbers(): void {
    const totalPagesToShow = 5;
    const maxPages = 10;

    this.pages = [];
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > maxPages) {
      if (this.currentPage <= totalPagesToShow) {
        endPage = maxPages;
      } else if (this.currentPage + totalPagesToShow >= this.totalPages) {
        startPage = this.totalPages - maxPages + 1;
      } else {
        startPage = this.currentPage - totalPagesToShow;
        endPage = this.currentPage + totalPagesToShow - 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllPendingOwners();
    }
  }

  acceptOwner(owner: Owner): void {
    this.spinner.show();
    console.log('Accepting owner:', owner);
    Swal.fire({
      icon: 'info',
      title: 'تأكيد العملية',
      text: 'هل أنت متأكد أنك ترغب في قبول المالك؟',
      showCancelButton: true,
      confirmButtonText: 'نعم، قبول',
      cancelButtonText: 'لا، إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ownerServices.acceptOwner(owner.id).subscribe(
          (response) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'تم العملية بنجاح',
              text: 'تم قبول المالك بنجاح',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.getAllPendingOwners();
            });
          },
          (error) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'حدث خطأ',
              text: 'فشل في قبول طلب المالك',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        );
      } else {
        this.spinner.hide();
      }
    });
  }

  declineOwner(owner: Owner): void {
    this.spinner.show();
    console.log('Declining owner:', owner);
    Swal.fire({
      icon: 'info',
      title: 'تأكيد العملية',
      text: 'هل أنت متأكد أنك ترغب في رفض المالك؟',
      showCancelButton: true,
      confirmButtonText: 'نعم، رفض',
      cancelButtonText: 'لا، إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ownerServices.declineOwner(owner.id).subscribe(
          (response) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'تم العملية بنجاح',
              text: 'تم رفض المالك بنجاح',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.getAllPendingOwners();
            });
          },
          (error) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'حدث خطأ',
              text: 'فشل في رفض طلب المالك',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        );
      } else {
        this.spinner.hide();
      }
    });
  }

  showDetails(owner: Owner): void {
    this.store.dispatch(selectOwner({ owner }));
    this.router.navigate(['/ownerDetails']);
  }

  getAccountStatusName(status: number): string {
    return OwnerAccountStatus[status] || 'غير معروف';
  }

  getUserTypeName(userType: number): string {
    switch (userType) {
      case 0:
        return 'Hall-Owner';
      case 1:
        return 'Photographer';
      case 2:
        return 'Car-Owner';
      case 3:
        return 'BeautyCenter-Owner';
      case 4:
        return 'Dresses-Owner';
      default:
        return 'Unknown';
    }
  }
}
