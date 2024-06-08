import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BeautyCenterService } from 'src/app/Service/beauty-center.service';
import { AddressService } from 'src/app/Service/address.service';
import { City } from 'src/app/Interfaces/city';
import { Governorate } from 'src/app/Interfaces/governorate';

@Component({
  selector: 'app-add-beauty-center',
  templateUrl: './add-beauty-center.component.html',
  styleUrls: ['./add-beauty-center.component.css'],
})
export class AddBeautyCenterComponent implements OnInit {
  beautyCenterForm: FormGroup;
  images: { file: File; url: string }[] = [];
  services: any[] = [];
  newService: any = {};
  ownerID: string = 'owner-id-string';
  beautyCenterID: string = 'beauty-center-id-string';

  AllGovernments: Governorate[] = [];
  Cites: City[] = [];
  selectedGovernorate: Governorate | null = null;

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

  openServiceModal() {
    this.newService = {};
  }

  addService() {
    if (
      this.newService.name &&
      this.newService.description &&
      this.newService.price &&
      this.newService.appointment
    ) {
      this.services.push({ ...this.newService });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع تفاصيل الخدمة.',
      });
    }
  }

  removeService(service: any) {
    this.services = this.services.filter((s) => s !== service);
  }

  onSubmit() {
    if (
      this.beautyCenterForm.invalid ||
      this.images.length === 0 ||
      this.services.length === 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور والخدمات.',
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
    formData.append('BeautyCenterID', this.beautyCenterID);
    this.images.forEach((image, index) => {
      formData.append(`Images[${index}]`, image.file, image.file.name);
    });
    formData.append('Services', JSON.stringify(this.services));

    console.log('FormData entries:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (File)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    this.beautyCenterService.addBeautyCenter(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'تمت الإضافة بنجاح',
          text: 'تمت إضافة بيوتي سنتر بنجاح.',
        });
        this.beautyCenterForm.reset();
        this.images = [];
        this.services = [];
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة بيوتي سنتر. حاول مرة أخرى.',
        });
      },
    });
  }
}
