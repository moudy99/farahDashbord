import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotographyService } from 'src/app/Service/photography.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-photographer',
  templateUrl: './add-photographer.component.html',
  styleUrls: ['./add-photographer.component.css'],
})
export class AddPhotographerComponent implements OnInit {
  photographerServiceForm: FormGroup;
  images: { file: File; url: string }[] = [];
  ownerID: string = 'owner-id-string';

  constructor(
    private fb: FormBuilder,
    private photographyService: PhotographyService
  ) {
    this.photographerServiceForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

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
    if (this.photographerServiceForm.invalid || this.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('OwnerID', this.ownerID);
    formData.append(
      'Description',
      this.photographerServiceForm.get('description')?.value
    );

    this.images.forEach((image, index) => {
      formData.append('Pictures', image.file, image.file.name);
    });

    this.photographyService.addPhotographerService(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'تمت الإضافة بنجاح',
          text: 'تمت إضافة خدمة المصور بنجاح.',
        });
        this.photographerServiceForm.reset();
        this.images = [];
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة خدمة المصور. حاول مرة أخرى.',
        });
        console.error('Error:', error);
      },
    });
  }
}
