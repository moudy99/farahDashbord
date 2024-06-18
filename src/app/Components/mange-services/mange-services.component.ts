import { Component } from '@angular/core';
import { GetServicesService } from 'src/app/Service/get-services.service';
@Component({
  selector: 'app-mange-services',
  templateUrl: './mange-services.component.html',
  styleUrls: ['./mange-services.component.css'],
})
export class MangeServicesComponent {
  constructor(private getServices: GetServicesService) {}
  getAllServices() {
    this.getServices.getAllServices().subscribe((response: any) => {
      console.log(response);
    });
  }
}
