import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { BeautyCenterService } from 'src/app/Service/beauty-center.service';
import { AddressService } from 'src/app/Service/address.service';
import { City } from 'src/app/Interfaces/city';
import { Governorate } from 'src/app/Interfaces/governorate';
import { Modal } from 'bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUsersService } from 'src/app/Service/get-users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-beauty-center',
  templateUrl: './edit-beauty-center.component.html',
  styleUrls: ['./edit-beauty-center.component.css']
})
export class EditBeautyCenterComponent implements OnInit {
  beautyCenterForm: FormGroup;
  serviceForm: FormGroup;
  images: { file: File | null; url: string }[] = [];
  imageUrls: string[] = [];
  ownerID: string = 'owner-id-string';
  AllGovernments: Governorate[] = [];
  Cites: City[] = [];
  BeautyCenterId: string | null = "";

  constructor(
    private fb: FormBuilder,
    private beautyCenterService: BeautyCenterService,
    private addressService: AddressService,
    private router: Router,
    private route: ActivatedRoute,
    private getUsersService: GetUsersService
  ) {
    this.beautyCenterForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      gove: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      services: this.fb.array([]),
      images: [[], Validators.required],
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

    this.beautyCenterForm.get('gove')?.valueChanges.subscribe((governorateID: number) => {
      if (governorateID) {
        this.onGovernorateChange(governorateID);
      } else {
        this.Cites = [];
        this.beautyCenterForm.get('city')?.reset({ value: '', disabled: true });
      }
    });

    this.BeautyCenterId = this.route.snapshot.paramMap.get('id');
    if (this.BeautyCenterId) {
      this.getUsersService.getServiceById(this.BeautyCenterId).subscribe(
        (response: any) => {
          console.log('Received data in EditBeautyCenterComponent:', response.data);
          this.populateForm(response.data);
        },
        (error: any) => {
          console.error('Error fetching beauty center data:', error);
        }
      );
    } else {
      console.error('No beauty center ID found in route parameters');
    }
  }

  loadGovernorates(): void {
    this.addressService.getGovernorates().subscribe((response: any) => {
      this.AllGovernments = response.data;
    });
  }

  onGovernorateChange(governorateID: number): void {
    this.addressService.getCitiesByGovId(governorateID).subscribe((response: any) => {
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
      console.log("not valid");
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
        this.beautyCenterForm.get('images')?.setValue(this.images);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(image: { file: File | null; url: string }) {
    this.images = this.images.filter((img) => img !== image);
    this.beautyCenterForm.get('images')?.setValue(this.images);
    if (this.BeautyCenterId) {
      this.getUsersService.DeleteImage(this.BeautyCenterId, image.url).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'تم الحذف',
            text: 'تم حذف الصورة بنجاح.',
          });
          this.router.navigate(['mangeServices']);
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء حذف الصورة.',
          });
          console.error('Error deleting image:', error);
        }
      );
    }
   
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

    this.beautyCenterService.UpdateBeautyCenter(this.BeautyCenterId,beautyCenterFormData).subscribe(
      (beautyCenterResponse: any) => {
        const beautyCenterId = beautyCenterResponse.data.beautyCenterId;
        const servicesData = this.constructServicesFormData(beautyCenterId);

        console.log('Services Data:', JSON.stringify(servicesData, null, 2));

        this.beautyCenterService.addBeautyServices(servicesData).subscribe(
          (servicesResponse: any) => {
            Swal.fire({
              icon: 'success',
              title: 'نجاح',
              text: 'تم التعديل علي  البيوتي سنتر والخدمات بنجاح.',
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
              text: 'حدث خطأ أثناء تعديل الخدمات للبيوتي سنتر.',
            });
          }
        );
      },
      (error: any) => {
        console.log(error);
        
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء تعديل البيوتي سنتر.',
        });
      }
    );
  }

  constructBeautyCenterFormData(): FormData {
    const formData = new FormData();
    formData.append('Name', this.beautyCenterForm.get('name')?.value);
    formData.append('Description', this.beautyCenterForm.get('description')?.value);
    formData.append('Gove', this.beautyCenterForm.get('gove')?.value);
    formData.append('City', this.beautyCenterForm.get('city')?.value);
    formData.append('OwnerID', this.ownerID);

    this.images.forEach((image) => {
      if (image.file) {
        formData.append('Images', image.file, image.file.name);
      }
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

  populateForm(data: any): void {
    this.beautyCenterForm.patchValue({
      name: data.name,
      description: data.description,
      gove: data.gove,
      city: data.city,
    });

    this.imageUrls = data.imageUrls
    .map((pictureUrl: string) => `${environment.UrlForImages}${pictureUrl}`);

    // Patch the images to the form control
    this.imageUrls.forEach((url) => {
      this.images.push({ file: null, url });
    });
    this.beautyCenterForm.get('images')?.setValue(this.images);

    data.services.forEach((service: any) => {
      this.services.push(this.fb.group({
        serviceName: [service.name, Validators.required],
        serviceDescription: [service.description, Validators.required],
        serviceTime: [service.appointment, Validators.required],
        servicePrice: [service.price, Validators.required],
      }));
    });
  }
}
