import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { OwnerService } from 'src/app/Service/owner.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { OwnersState } from 'src/app/reducers/owners.reducer';
import { environment } from 'src/environments/environment.development';
import { ServiceStatusEnum } from 'src/app/enums/service-status-enum';
import { GetServicesService } from 'src/app/Service/get-services.service';

@Component({
  selector: 'app-new-add-services-requests',
  templateUrl: './new-add-services-requests.component.html',
  styleUrls: ['./new-add-services-requests.component.css'],
})
export class NewAddServicesRequestsComponent implements OnInit {
  paginatedServices: any[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  maxPagesToShow: number = 10;
  pages: number[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private ownerService: OwnerService,
    private store: Store<OwnersState>,
    private router: Router,
    private getServicesService: GetServicesService
  ) {}

  ngOnInit(): void {
    this.loadPendingServices();
  }

  loadPendingServices() {
    this.spinner.show();
    const serviceStatus = ServiceStatusEnum.Pending;
    const { currentPage, pageSize } = this;

    this.getServicesService
      .getAllServices(serviceStatus, currentPage, pageSize)
      .subscribe(
        (response: any) => {
          const { data, paginationInfo } = response;

          const services = this.extractServices(data);
          this.loadOwnerDetailsForServices(services);

          this.currentPage = paginationInfo.currentPage;
          this.totalPages = paginationInfo.totalPages;

          const startPage = Math.max(
            1,
            this.currentPage - Math.floor(this.maxPagesToShow / 2)
          );
          const endPage = Math.min(
            startPage + this.maxPagesToShow - 1,
            this.totalPages
          );

          this.pages = Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          );
        },
        (error) => {
          this.spinner.hide();
          Swal.fire('Error', 'Failed to load services', 'error');
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  extractServices(data: any): any[] {
    let services: any[] = [];

    if (data.beautyCenters) {
      data.beautyCenters.forEach((center: any) => {
        if (center.serviceStatus === 0) {
          services.push({ ...center, type: 'beautyCenter', name: center.name });
        }
      });
    }

    if (data.halls) {
      data.halls.forEach((hall: any) => {
        if (hall.serviceStatus === 0) {
          services.push({ ...hall, type: 'hall', name: hall.name });
        }
      });
    }

    if (data.cars) {
      data.cars.forEach((car: any) => {
        if (car.serviceStatus === 0) {
          services.push({ ...car, type: 'car', name: car.brand });
        }
      });
    }

    if (data.photographys) {
      data.photographys.forEach((photography: any) => {
        if (photography.serviceStatus === 0) {
          services.push({
            ...photography,
            type: 'photography',
            name: photography.description,
          });
        }
      });
    }
    return services;
  }

  loadOwnerDetailsForServices(services: any[]) {
    const ownerDetailsPromises = services.map((service) => {
      return this.ownerService.GetOwnerDetails(service.ownerID).toPromise();
    });

    Promise.all(ownerDetailsPromises)
      .then((ownerDetailsArray) => {
        services.forEach((service, index) => {
          const ownerDetails = ownerDetailsArray[index];
          if (ownerDetails && ownerDetails.data) {
            service.ownerDetails = ownerDetails.data;
            service.ownerDetails.profileImage = `${environment.UrlForImages}${service.ownerDetails.profileImage}`;
          } else {
            console.error(
              `Failed to load owner details for service ID: ${service.ownerID}`
            );
          }
        });

        this.paginatedServices = services;
      })
      .catch((error) => {
        console.error('Error loading owner details:', error);
        Swal.fire('Error', 'Failed to load owner details', 'error');
      });
  }

  getIndex(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  getServiceType(service: any): { typeText: string; cssClass: string } {
    let typeText: string;
    let cssClass: string;

    switch (service.type) {
      case 'beautyCenter':
        typeText = 'مركز تجميل';
        cssClass = 'user-type-BeautyCenter-Owner';
        break;
      case 'hall':
        typeText = 'قاعة';
        cssClass = 'user-type-Hall-Owner';
        break;
      case 'car':
        typeText = 'سيارة';
        cssClass = 'user-type-Car-Owner';
        break;
      case 'photography':
        typeText = 'تصوير';
        cssClass = 'user-type-Photographer';
        break;
      default:
        typeText = 'غير معروف';
        cssClass = 'user-type-Unknown';
        break;
    }

    return { typeText, cssClass };
  }

  getStaticAddedTime(): string {
    return '2023-01-01';
  }

  acceptService(service: any) {
    this.spinner.show();
    console.log('Accepting owner:', service);
    let serviceId: number = 0;
    switch (service.type) {
      case 'hall':
        serviceId = service.hallID;
        break;
      case 'photography':
        serviceId = service.photographyID;
        break;
      case 'car':
        serviceId = service.carID;
        break;
      case 'beautyCenter':
        serviceId = service.beautyCenterId;
        break;
      default:
        serviceId = 0;
        break;
    }
    this.acceptServiceAlert(serviceId);
  }

  acceptServiceAlert(serviceId: number) {
    Swal.fire({
      icon: 'info',
      title: 'تأكيد العملية',
      text: 'هل أنت متأكد أنك ترغب في قبول الخدمة؟',
      showCancelButton: true,
      confirmButtonText: 'نعم، قبول',
      cancelButtonText: 'لا، إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.getServicesService.acceptService(serviceId).subscribe(
          (response) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'تم العملية بنجاح',
              text: 'تم قبول الخدمة بنجاح',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.loadPendingServices();
            });
          },
          (error) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'حدث خطأ',
              text: 'فشل في قبول طلب الخدمة',
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

  declineService(service: any) {
    this.spinner.show();
    console.log('Accepting owner:', service);
    let serviceId: number = 0;
    switch (service.type) {
      case 'hall':
        serviceId = service.hallID;
        break;
      case 'photography':
        serviceId = service.photographyID;
        break;
      case 'car':
        serviceId = service.carID;
        break;
      case 'beautyCenter':
        serviceId = service.beautyCenterId;
        break;
      default:
        serviceId = 0;
        break;
    }
    this.declineServiceAlert(serviceId);
  }

  declineServiceAlert(serviceId: number) {
    Swal.fire({
      icon: 'info',
      title: 'تأكيد العملية',
      text: 'هل أنت متأكد أنك ترغب في رفض الخدمة؟',
      showCancelButton: true,
      confirmButtonText: 'نعم، رفضص',
      cancelButtonText: 'لا، إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.getServicesService.declineService(serviceId).subscribe(
          (response) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'تم العملية بنجاح',
              text: 'تم رفض الخدمة بنجاح',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.loadPendingServices();
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

  showDetails(service: any) {}

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPendingServices();
    }
  }
}
