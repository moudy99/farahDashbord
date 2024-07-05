import { GetUsersService } from 'src/app/Service/get-users.service';
import { HallService } from 'src/app/Service/hall.service';
import { Component, OnInit } from '@angular/core';
import { GetServicesService } from 'src/app/Service/get-services.service';
import { ServicesManagementService } from 'src/app/Service/services-management.service';
import { BeautyCenter } from './../../Interfaces/ServicesInfo/beauty-center';
import { Hall } from './../../Interfaces/ServicesInfo/hall';
import { Car } from './../../Interfaces/ServicesInfo/car';
import { Photographer } from './../../Interfaces/ServicesInfo/photographer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
@Component({
  selector: 'app-mange-services',
  templateUrl: './mange-services.component.html',
  styleUrls: ['./mange-services.component.css'],
})
export class MangeServicesComponent implements OnInit {
  beautyCenters: BeautyCenter[] = [];
  halls: Hall[] = [];
  cars: Car[] = [];
  photographers: Photographer[] = [];
  allServices: any[] = [];
  paginatedServices: any[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  pages: number[] = [];

  isLoading = false;
  serviceData: any;
  constructor(
    private getServices: GetServicesService,
    private servicesManagementService: ServicesManagementService,
    private spinner: NgxSpinnerService,
    private getUsersService :GetUsersService,
    private router: Router

  ) {
    const navigation = this.router.getCurrentNavigation();
    //this.serviceData = navigation?.extras.state?.data;
  }
 

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    this.spinner.show();

    this.getServices.getAllOwnerServices().subscribe(
      (responseData: any) => {
        this.beautyCenters = responseData.data.beautyCenters;
        this.halls = responseData.data.halls;
        this.cars = responseData.data.cars;
        this.photographers = responseData.data.photographys;

        this.allServices = [
          ...this.beautyCenters.map((service) => ({
            ...service,
            type: 'Beauty Center',
            timeAdded: new Date(),
          })),
          ...this.halls.map((service) => ({
            ...service,
            type: 'Hall',
            timeAdded: new Date(),
          })),
          ...this.cars.map((service) => ({
            ...service,
            name: 'خدمة عربية',
            type: 'Car',
            timeAdded: new Date(),
          })),
          ...this.photographers.map((service) => ({
            ...service,
            name: 'خدمة مصور',
            type: 'Photographer',
            timeAdded: new Date(),
          })),
        ];

        this.totalPages = Math.ceil(this.allServices.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePaginatedServices();

        this.isLoading = false;
        this.spinner.hide();
      },
      (error) => {
        this.isLoading = false;
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.',
        });
      }
    );
  }

  updatePaginatedServices() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedServices = this.allServices.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedServices();
    }
  }
  EditService(service: any) {
    let serviceId: string;
    let route: string;
  
    switch (service.type) {
      case "Hall":
        serviceId = service.hallID;
        route = 'edithall';
        break;
      case "Beauty Center":
        serviceId = service.beautyCenterId;
        route = 'editbeautycenter';
        break;
      case "Car":
        serviceId = service.carID;
        route = 'editcar';
        break;
      case "Photographer":
        serviceId = service.photographyID;
        route = 'editphotographer';
        break;
      default:
        console.error("Unknown service type");
        return;
    }
  
  
        this.router.navigate(['mangeServices', route,serviceId] );
    
  
  }
  

  DeleteService(service: any) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن هذا!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      console.log(result);
      
      if (result.isConfirmed) {
        this.isLoading = true;
        this.spinner.show();

        let serviceType = '';
        let id = 0;

        switch (service.type) {
          case 'Beauty Center':
            serviceType = 'BeautyCenter';
            id = service.beautyCenterId;
            break;
          case 'Car':
            serviceType = 'Car';
            id = service.carID;
            break;
          case 'Hall':
            serviceType = 'Hall';
            id = service.hallID;
            break;
          case 'Photographer':
            serviceType = 'Photography';
            id = service.photographyID;
            break;
          default:
            return;
        }

        this.servicesManagementService.RemoveService(serviceType, id).subscribe(
          (response) => {
            console.log(response);
            
            this.isLoading = false;
            this.spinner.hide();
            if (response.succeeded) {
              Swal.fire('تم الحذف!', 'تم حذف الخدمة بنجاح.', 'success');
              this.loadServices();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء حذف الخدمة. يرجى المحاولة مرة أخرى.',
              });
            }
          },
          (error) => {
            this.isLoading = false;
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: 'حدث خطأ أثناء حذف الخدمة. يرجى المحاولة مرة أخرى.',
            });
          }
        );
      }
    });
  }
}
