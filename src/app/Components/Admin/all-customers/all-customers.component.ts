import { CustomerResponse } from './../../../Interfaces/customer-response';
import { Customer } from './../../../Interfaces/customer';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { GetUsersService } from 'src/app/Service/get-users.service';
import { OwnerAccountStatus } from 'src/app/enums/owner-account-status';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css'],
})
export class AllCustomersComponent implements OnInit {
  AllCustomers: Customer[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  pages: number[] = [];
  isLoading: boolean = false;

  isBlocked: boolean | null = null;

  originalIsBlocked: boolean | null = null;

  constructor(
    private getUsersService: GetUsersService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers(): void {
    this.spinner.show();
    this.getUsersService
      .getAllCustomers(this.currentPage, this.pageSize, this.isBlocked)
      .subscribe(
        (response: CustomerResponse) => {
          this.AllCustomers = response.data.map((customer) => ({
            ...customer,
            profileImage:
              customer.profileImage &&
              customer.profileImage.includes('images/CustomersImages')
                ? `${environment.UrlForImages}/${customer.profileImage}`
                : customer.profileImage,
          }));

          this.totalPages = response.paginationInfo.totalPages;
          this.generatePageNumbers();
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching Customers:', error);
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
      this.getAllCustomers();
    }
  }

  toggleBlockStatus(event: Event, customer: Customer): void {
    event.stopPropagation();
    this.spinner.show();
    const action = customer.isBlocked ? 'unblock' : 'block';
    const CustomerId = customer.id;

    this.originalIsBlocked = customer.isBlocked;
    console.log(this.originalIsBlocked, CustomerId, action, customer.isBlocked);
    this.getUsersService.toggleBlockCustomer(CustomerId, action).subscribe(
      (response) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: 'نجاح!',
          text: response.message,
        });

        customer.isBlocked = !customer.isBlocked;
      },
      (error) => {
        this.spinner.hide();
        console.error('Error toggling block status:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ!',
          text: 'فشل تغيير حالة الحظر.',
        });
        customer.isBlocked = this.originalIsBlocked;
      }
    );
  }

  onDeleteOwner(customer: Customer): void {
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
        console.log('Deleting customer:', customer);
      }
    });
  }

  getAccountStatusName(status: number): string {
    return OwnerAccountStatus[status];
  }
}
