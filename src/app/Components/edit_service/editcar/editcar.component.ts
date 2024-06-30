import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CarService } from 'src/app/Service/car.service';
import { AddressService } from 'src/app/Service/address.service';
import { City } from 'src/app/Interfaces/city';
import { Governorate } from 'src/app/Interfaces/governorate';
import { GetUsersService } from 'src/app/Service/get-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-editcar',
  templateUrl: './editcar.component.html',
  styleUrls: ['./editcar.component.css']
})
export class EditcarComponent implements OnInit {
  carServiceForm: FormGroup;
  images: { file: File; url: string }[] = [];
  AllGovernments: Governorate[] = [];
  Cities: City[] = [];
  ownerID: string = 'owner-id-string';
  carID: string|null = '';
  imageUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private addressService: AddressService,
    private getUsersService: GetUsersService,
    private router: Router,
    private route: ActivatedRoute,
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

    this.carServiceForm.get('governorate')?.valueChanges.subscribe((governorateID: number) => {
      if (governorateID) {
        this.onGovernorateChange(governorateID);
      } else {
        this.Cities = [];
        this.carServiceForm.get('city')?.reset({ value: '', disabled: true });
      }
    });
    this.carID = this.route.snapshot.paramMap.get('id');
    if (this.carID) {
      this.getUsersService.getServiceById(this.carID).subscribe(
        (response: any) => {
          console.log('Received data in EditHallComponent:', response.data); // Log data for debugging
          this.populateForm(response.data);
        },
        (error: any) => {
          console.error('Error fetching hall data:', error);
        }
      );
    } else {
      console.error('No hall ID found in route parameters');
    }
  }

  loadGovernorates(): void {
    this.addressService.getGovernorates().subscribe((response: any) => {
      this.AllGovernments = response.data;
    });
  }

  onGovernorateChange(governorateID: number): void {
    this.addressService.getCitiesByGovId(governorateID).subscribe((response: any) => {
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
  removeImageUrl(imageUrl: string) {
    this.imageUrls = this.imageUrls.filter((url) => url !== imageUrl);
  }

  onSubmit(): void {
    if (this.carServiceForm.invalid) {
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
    formData.append('Description', this.carServiceForm.get('description')?.value);
    formData.append('GovernorateID', this.carServiceForm.get('governorate')?.value);
    formData.append('City', this.carServiceForm.get('city')?.value);
    formData.append('OwnerID', this.ownerID);
  
    if (this.images.length === 0) {
      formData.append('Pictures', ''); 
    } else {
      this.images.forEach((image, index) => {
        formData.append('Pictures', image.file, image.file.name);
      });
    }
  
    this.carService.UpdateCar(this.carID, formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'تم التعديل بنجاح',
          text: 'تم تعديل خدمة السيارة بنجاح.',
        });
        this.carServiceForm.reset();
        this.images = [];
      },
      error: (error) => {
        console.log(error);
  
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء تعديل خدمة السيارة. حاول مرة أخرى.',
        });
        console.error('Error:', error);
      },
    });
  }
  

  populateForm(data: any): void {
    this.carServiceForm.patchValue({
      brand: data.brand,
      year: data.year,
      price: data.price,
      description: data.description,
      governorate: data.governorateID,
      city: data.city,
    });

    this.imageUrls = data.pictureUrls.map((pictureUrl: string) => `${environment.UrlForImages}${pictureUrl}`);
  }
}
