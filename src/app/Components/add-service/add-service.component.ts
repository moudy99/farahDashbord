import { Component } from '@angular/core';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
})
export class AddServiceComponent {
  services = [
    {
      title: 'اضافة قاعة',
      icon: '../../../assets/images/wedding-hall.svg',
      route: 'addHall',
    },
    {
      title: 'اضافة عربية',
      icon: '../../../assets/images/Car.svg',
      route: 'addCar',
    },
    {
      title: 'اضافة بيوتي سنتر',
      icon: '../../../assets/images/beauty-center.svg',
      route: 'addBeautyCenter',
    },
    {
      title: 'اضافة فستان',
      icon: '../../../assets/images/dress.svg',
      route: 'addDress',
    },
    {
      title: 'اضافة مصور',
      icon: '../../../assets/images/Photographer .svg',
      route: 'addPhotographer',
    },
  ];
}
