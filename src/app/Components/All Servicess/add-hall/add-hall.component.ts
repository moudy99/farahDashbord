import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { HallService } from 'src/app/Service/hall.service';
import { AddressService } from 'src/app/Service/address.service';
import { City } from 'src/app/Interfaces/city';
import { Governorate } from 'src/app/Interfaces/governorate';

declare var bootstrap: any;

@Component({
  selector: 'app-add-hall',
  templateUrl: './add-hall.component.html',
  styleUrls: ['./add-hall.component.css'],
})
export class AddHallComponent implements OnInit {
  hallServiceForm: FormGroup;
  images: { file: File; url: string }[] = [];
  ownerID: string = 'owner-id-string';
  AllGovernments: Governorate[] = [];
  Cites: City[] = [];
  newFeature: string = '';

  constructor(
    private fb: FormBuilder,
    private hallService: HallService,
    private addressService: AddressService
  ) {
    this.hallServiceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      gove: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      features: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();

    this.hallServiceForm
      .get('gove')
      ?.valueChanges.subscribe((governorateID: number) => {
        if (governorateID) {
          this.onGovernorateChange(governorateID);
        } else {
          this.Cites = [];
          this.hallServiceForm
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
        this.hallServiceForm.get('city')?.enable();
      });
  }

  get features(): FormArray {
    return this.hallServiceForm.get('features') as FormArray;
  }

  addFeature() {
    this.features.push(
      this.fb.group({
        feature: ['', Validators.required],
      })
    );
  }

  removeFeature(index: number) {
    this.features.removeAt(index);
  }

  openFeatureModal() {
    const modal = new bootstrap.Modal(document.getElementById('featureModal'));
    modal.show();
  }

  addFeatureFromModal() {
    if (this.newFeature.trim()) {
      this.features.push(
        this.fb.group({
          feature: [this.newFeature, Validators.required],
        })
      );
      this.newFeature = '';
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('featureModal')
      );
      modal.hide();
    }
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
    this.hallServiceForm.markAllAsTouched();

    if (this.hallServiceForm.invalid || this.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.hallServiceForm.get('name')?.value);
    formData.append(
      'Description',
      this.hallServiceForm.get('description')?.value
    );
    formData.append('Price', this.hallServiceForm.get('price')?.value);
    formData.append('Capacity', this.hallServiceForm.get('capacity')?.value);
    formData.append('GovernorateID', this.hallServiceForm.get('gove')?.value);
    formData.append('City', this.hallServiceForm.get('city')?.value);
    formData.append('OwnerID', this.ownerID);

    this.images.forEach((image, index) => {
      formData.append('Pictures', image.file, image.file.name);
    });

    const features = this.hallServiceForm.get('features') as FormArray;
    const featuresData = features.value;

    featuresData.forEach((feature: any, index: number) => {
      formData.append(`Features[${index}]`, feature.feature);
    });

    this.hallService.addHall(formData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'نجاح',
          text: 'تمت إضافة القاعة بنجاح.',
        });
        this.hallServiceForm.reset();
        this.images = [];
        features.clear();
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة القاعة.',
        });
      }
    );
  }
}
