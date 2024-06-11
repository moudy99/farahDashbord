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
  editingServiceIndex: number | null = null;

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

    if (this.editingServiceIndex !== null) {
      this.services
        .at(this.editingServiceIndex)
        .setValue(this.serviceForm.value);
      this.editingServiceIndex = null;
    } else {
      this.services.push(this.fb.group(this.serviceForm.value));
    }

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

    const services = this.beautyCenterForm.get('services') as FormArray;
    const servicesData = services.value;

    servicesData.forEach((service: any, index: number) => {
      formData.append(`Services[${index}].ServiceName`, service.serviceName);
      formData.append(
        `Services[${index}].ServiceDescription`,
        service.serviceDescription
      );
      formData.append(`Services[${index}].ServiceTime`, service.serviceTime);
    });

    this.beautyCenterService.addBeautyCenter(formData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'نجاح',
          text: 'تمت إضافة بيوتي سنتر بنجاح.',
        });
        this.beautyCenterForm.reset();
        this.images = [];
        services.clear();
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة بيوتي سنتر.',
        });
      }
    );
  }
}
