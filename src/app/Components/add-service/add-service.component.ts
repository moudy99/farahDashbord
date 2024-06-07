import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
})
export class AddServiceComponent implements OnInit {
  services = [
    { title: 'اضافة قاعة', icon: '../../../assets/images/wedding-hall.svg' },
    { title: 'اضافة عربية', icon: '../../../assets/images/Car.svg' },
    {
      title: 'اضافة بيوتي سنتر',
      icon: '../../../assets/images/beauty-center.svg',
    },
    { title: 'اضافة فستان', icon: '../../../assets/images/dress.svg' },
    { title: 'اضافة مصور', icon: '../../../assets/images/Photographer .svg' },
  ];
  serviceForms: FormGroup[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.services.forEach((service) => {
      let formGroup: FormGroup;
      switch (service.title) {
        case 'اضافة قاعة':
          formGroup = this.fb.group({
            hallName: [''],
            hallLocation: [''],
          });
          break;
        case 'اضافة عربية':
          formGroup = this.fb.group({
            carModel: [''],
            carColor: [''],
          });
          break;
        case 'اضافة بيوتي سنتر':
          formGroup = this.fb.group({
            beautyCenterName: [''],
            beautyCenterLocation: [''],
          });
          break;
        case 'اضافة فستان':
          formGroup = this.fb.group({
            dressType: [''],
            dressSize: [''],
          });
          break;
        case 'اضافة مصور':
          formGroup = this.fb.group({
            photographerName: [''],
            photographerExperience: [''],
          });
          break;
        default:
          formGroup = this.fb.group({});
      }
      this.serviceForms.push(formGroup);
    });
  }
}
