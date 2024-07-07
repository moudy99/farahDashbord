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
      icon: 'bi bi-building',
      route: 'addHall',
      description: 'يمكنك إضافة قاعة جديدة لمناسبتك الخاصة بسهولة.',
    },
    {
      title: 'اضافة عربية',
      icon: 'bi bi-car-front',
      route: 'addCar',
      description: 'إضافة سيارة لتوصيل الضيوف أو العروسين بأناقة.',
    },
    {
      title: 'اضافة بيوتي سنتر',
      icon: 'bi bi-scissors',
      route: 'addBeautyCenter',
      description: 'إضافة بيوتي سنتر لتجهيز العروس بأحدث صيحات الجمال.',
    },
    {
      title: 'اضافة مصور',
      icon: 'bi bi-camera',
      route: 'addPhotographer',
      description: 'إضافة مصور لالتقاط أجمل اللحظات في مناسبتك.',
    },
  ];
}
