import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CarService } from 'src/app/Service/car.service';
import { AddressService } from 'src/app/Service/address.service';
import { City } from 'src/app/Interfaces/city';
import { Governorate } from 'src/app/Interfaces/governorate';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent implements OnInit {
  carServiceForm: FormGroup;
  images: { file: File; url: string }[] = [];
  AllGovernments: Governorate[] = [];
  Cities: City[] = [];
  ownerID: string = 'owner-id-string';
  carID: number = 666;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private addressService: AddressService
  ) {
    this.carServiceForm = this.fb.group({
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1886)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      governorate: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();

    this.carServiceForm
      .get('governorate')
      ?.valueChanges.subscribe((governorateID: number) => {
        if (governorateID) {
          this.onGovernorateChange(governorateID);
        } else {
          this.Cities = [];
          this.carServiceForm.get('city')?.reset({ value: '', disabled: true });
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
        this.Cities = response.data;
        this.carServiceForm.get('city')?.enable();
      });
  }

  onFileSelected(event: any): void {
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

  removeImage(image: { file: File; url: string }): void {
    this.images = this.images.filter((img) => img !== image);
  }

  onSubmit(): void {
    if (this.carServiceForm.invalid || this.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('Brand', this.carServiceForm.get('brand')?.value);
    formData.append('Year', this.carServiceForm.get('year')?.value);
    formData.append('Price', this.carServiceForm.get('price')?.value);
    formData.append(
      'Description',
      this.carServiceForm.get('description')?.value
    );
    formData.append(
      'GovernorateID',
      this.carServiceForm.get('governorate')?.value
    );
    formData.append('City', this.carServiceForm.get('city')?.value);
    formData.append('OwnerID', this.ownerID);

    this.images.forEach((image, index) => {
      formData.append('Pictures', image.file, image.file.name);
    });

    this.carService.addCarService(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'تمت الإضافة بنجاح',
          text: 'تمت إضافة خدمة السيارة بنجاح.',
        });
        this.carServiceForm.reset();
        this.images = [];
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة خدمة السيارة. حاول مرة أخرى.',
        });
        console.error('Error:', error);
      },
    });
  }
}
