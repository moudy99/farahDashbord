import { Component, OnInit } from '@angular/core';
import { GetServicesService } from 'src/app/Service/get-services.service';
import { BeautyCenter } from './../../Interfaces/ServicesInfo/beauty-center';
import { Hall } from './../../Interfaces/ServicesInfo/hall';
import { Car } from './../../Interfaces/ServicesInfo/car';
import { Photographer } from './../../Interfaces/ServicesInfo/photographer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

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
  pageSize: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  isLoading = false;

  constructor(
    private getServices: GetServicesService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    this.spinner.show();

    this.getServices.getAllServices().subscribe(
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
}
