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
          console.log('Services response:', response);
          const { data, paginationInfo } = response;

          const services = this.extractServices(data);
          console.log('Extracted services:', services);
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
        console.log('Owner details:', ownerDetailsArray);

        services.forEach((service, index) => {
          const ownerDetails = ownerDetailsArray[index];
          if (ownerDetails && ownerDetails.data) {
            service.ownerDetails = ownerDetails.data;
            service.ownerDetails.profileImage = `${environment.UrlForImages}${service.ownerDetails.profileImage}`;

            console.log('Service with owner details:', service);
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

  acceptService(service: any) {}

  declineService(service: any) {}

  showDetails(service: any) {}

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPendingServices();
    }
  }
}
