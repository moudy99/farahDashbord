import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { BeautyCenterService } from 'src/app/Service/beauty-center.service';
import { AddressService } from 'src/app/Service/address.service';
import { City } from 'src/app/Interfaces/city';
import { Governorate } from 'src/app/Interfaces/governorate';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-add-beauty-center',
  templateUrl: './add-beauty-center.component.html',
  styleUrls: ['./add-beauty-center.component.css'],
})
export class AddBeautyCenterComponent implements OnInit {
  beautyCenterForm: FormGroup;
  serviceForm: FormGroup;
  images: { file: File; url: string }[] = [];
  ownerID: string = 'owner-id-string';
  AllGovernments: Governorate[] = [];
  Cites: City[] = [];

  constructor(
    private fb: FormBuilder,
    private beautyCenterService: BeautyCenterService,
    private addressService: AddressService
  ) {
    this.beautyCenterForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      gove: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      services: this.fb.array([]),
    });

    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      serviceTime: ['', Validators.required],
      servicePrice: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();

    this.beautyCenterForm
      .get('gove')
      ?.valueChanges.subscribe((governorateID: number) => {
        if (governorateID) {
          this.onGovernorateChange(governorateID);
        } else {
          this.Cites = [];
          this.beautyCenterForm
            .get('city')
            ?.reset({ value: '', disabled: true });
        }
      });
  }

  loadGovernorates(): void {
    this.addressService.getGovernorates().subscribe((response: any) => {
      this.AllGovernments = response.data;
    });
  }

  onGovernorateChange(governorateID: number): void {
    this.addressService
      .getCitiesByGovId(governorateID)
      .subscribe((response: any) => {
        this.Cites = response.data;
        this.beautyCenterForm.get('city')?.enable();
      });
  }

  get services(): FormArray {
    return this.beautyCenterForm.get('services') as FormArray;
  }

  openServiceModal() {
    this.serviceForm.reset();
    const serviceModalElement = document.getElementById('serviceModal');
    if (serviceModalElement) {
      const serviceModal = new Modal(serviceModalElement);
      serviceModal.show();
    }
  }

  addServiceFromModal() {
    if (this.serviceForm.invalid) {
      return;
    }

    const newService = this.fb.group({
      serviceName: this.serviceForm.get('serviceName')?.value,
      serviceDescription: this.serviceForm.get('serviceDescription')?.value,
      serviceTime: this.serviceForm.get('serviceTime')?.value,
      servicePrice: this.serviceForm.get('servicePrice')?.value,
    });

    this.services.push(newService);

    const serviceModalElement = document.getElementById('serviceModal');
    if (serviceModalElement) {
      const serviceModal = Modal.getInstance(serviceModalElement);
      if (serviceModal) {
        serviceModal.hide();
      }
    }
  }

  removeService(index: number) {
    this.services.removeAt(index);
  }

  onFileSelected(event: any) {
    if (event.target.files.length + this.images.length > 10) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يمكنك إضافة 10 صور فقط.',
      });
      return;
    }
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(image: { file: File; url: string }) {
    this.images = this.images.filter((img) => img !== image);
  }

  onSubmit(): void {
    if (this.beautyCenterForm.invalid || this.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور.',
      });
      return;
    }

    const beautyCenterFormData = this.constructBeautyCenterFormData();

    this.beautyCenterService.addBeautyCenter(beautyCenterFormData).subscribe(
      (beautyCenterResponse: any) => {
        const beautyCenterId = beautyCenterResponse.data.beautyCenterId;
        const servicesData = this.constructServicesFormData(beautyCenterId);

        console.log('Services Data:', JSON.stringify(servicesData, null, 2)); 

        this.beautyCenterService.addBeautyServices(servicesData).subscribe(
          (servicesResponse: any) => {
            Swal.fire({
              icon: 'success',
              title: 'نجاح',
              text: 'تمت إضافة البيوتي سنتر والخدمات بنجاح.',
            });
            this.beautyCenterForm.reset();
            this.images = [];
            this.services.clear();
          },
          (error: any) => {
            console.log(error);
            
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: 'حدث خطأ أثناء إضافة الخدمات للبيوتي سنتر.',
            });
          }
        );
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة البيوتي سنتر.',
        });
      }
    );
  }

  constructBeautyCenterFormData(): FormData {
    const formData = new FormData();
    formData.append('Name', this.beautyCenterForm.get('name')?.value);
    formData.append(
      'Description',
      this.beautyCenterForm.get('description')?.value
    );
    formData.append('Gove', this.beautyCenterForm.get('gove')?.value);
    formData.append('City', this.beautyCenterForm.get('city')?.value);
    formData.append('OwnerID', this.ownerID);

    this.images.forEach((image, index) => {
      formData.append('Images', image.file, image.file.name);
    });

    return formData;
  }

  constructServicesFormData(beautyCenterId: number): any {
    const services = (this.beautyCenterForm.get('services') as FormArray).value;
    const servicesData = services.map((service: any) => ({
      beautyCenterId: beautyCenterId,
      name: service.serviceName,
      description: service.serviceDescription,
      price: service.servicePrice,
      appointment: service.serviceTime,
    }));
    return servicesData;
  }
}
