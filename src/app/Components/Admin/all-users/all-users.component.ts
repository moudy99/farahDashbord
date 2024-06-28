import { OwnerResponse } from './../../../Interfaces/owner-response';
import { Owner } from './../../../Interfaces/owner';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { GetUsersService } from 'src/app/Service/get-users.service';
import { OwnerAccountStatus } from 'src/app/enums/owner-account-status';
import { environment } from 'src/environments/environment';
import { OwnerService } from 'src/app/Service/owner.service';
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  paginatedOwners: Owner[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  pages: number[] = [];
  isLoading: boolean = false;

  accountStatus: number | null = null;
  isBlocked: boolean | null = null;

  originalIsBlocked: boolean | null = null;

  constructor(
    private getUsersService: GetUsersService,
    private spinner: NgxSpinnerService,
    private ownerServices: OwnerService
  ) {}

  ngOnInit(): void {
    this.getAllOwners();
  }

  getAllOwners(): void {
    this.spinner.show();
    this.ownerServices
      .getAllOwners(
        this.currentPage,
        this.pageSize,
        this.accountStatus,
        this.isBlocked
      )
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
          console.error('Error fetching owners:', error);
          this.spinner.hide();
        }
      );
  }
  generatePageNumbers(): void {
    const totalPagesToShow = 5;
    const pagesToShow = totalPagesToShow * 2;
    this.pages = [];

    if (this.totalPages <= pagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      let startPage = 1;
      let endPage = this.totalPages;

      if (this.currentPage <= totalPagesToShow) {
        endPage = pagesToShow;
      } else if (this.currentPage + totalPagesToShow >= this.totalPages) {
        startPage = this.totalPages - pagesToShow + 1;
      } else {
        startPage = this.currentPage - totalPagesToShow;
        endPage = this.currentPage + pagesToShow;
      }

      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log('Page changed to:', this.currentPage);
      this.getAllOwners();
    }
  }

  toggleBlockStatus(event: Event, owner: Owner): void {
    event.stopPropagation();
    this.spinner.show();
    const action = owner.isBlocked ? 'unblock' : 'block';
    const ownerId = owner.id;

    this.originalIsBlocked = owner.isBlocked;
    console.log(this.originalIsBlocked, ownerId, action, owner.isBlocked);
    this.ownerServices.toggleBlockStatus(ownerId, action).subscribe(
      (response) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: 'نجاح!',
          text: response.message,
        });

        owner.isBlocked = !owner.isBlocked;
      },
      (error) => {
        this.spinner.hide();
        console.error('Error toggling block status:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ!',
          text: 'فشل تغيير حالة الحظر.',
        });
        owner.isBlocked = this.originalIsBlocked;
      }
    );
  }

  onDeleteOwner(owner: Owner): void {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة هذا المالك بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting owner:', owner);
      }
    });
  }

  getAccountStatusName(status: number): string {
    return OwnerAccountStatus[status];
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
