import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUsersService } from 'src/app/Service/get-users.service';
import { PhotographyService } from 'src/app/Service/photography.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-edit-photographer',
  templateUrl: './edit-photographer.component.html',
  styleUrls: ['./edit-photographer.component.css']
})
export class EditPhotographerComponent implements OnInit {
  photographerServiceForm: FormGroup;
  images: { file: File; url: string }[] = [];
  imageUrls: string[] = [];
  ownerID: string = 'owner-id-string';
  PhotoId: string | null = "";

  constructor(
    private fb: FormBuilder,
    private photographyService: PhotographyService,
    private router: Router,
    private route: ActivatedRoute,
    private getUsersService: GetUsersService
  ) {
    this.photographerServiceForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.PhotoId = this.route.snapshot.paramMap.get('id');
    if (this.PhotoId) {
      this.getUsersService.getServiceById(this.PhotoId).subscribe(
        (response: any) => {
          console.log('Received data in EditPhotographerComponent:', response.data); // Log data for debugging
          this.populateForm(response.data);
        },
        (error: any) => {
          console.error('Error fetching photographer data:', error);
        }
      );
    } else {
      console.error('No photographer ID found in route parameters');
    }
  }

  populateForm(data: any): void {
    this.photographerServiceForm.patchValue({
      description: data.description,
    });

    this.imageUrls = data.pictureUrls
      .map((pictureUrl: string) => `${environment.UrlForImages}${pictureUrl}`);
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
    if (this.PhotoId) {
      this.getUsersService.DeleteImage(this.PhotoId, image.url).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'تم الحذف',
            text: 'تم حذف الصورة بنجاح.',
          });
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

  removeImageUrl(imageUrl: string): void {
    this.imageUrls = this.imageUrls.filter((url) => url !== imageUrl);
    if (this.PhotoId) {
      this.getUsersService.DeleteImage(this.PhotoId, imageUrl).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'تم الحذف',
            text: 'تم حذف الصورة بنجاح.',
          });
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
    if (this.photographerServiceForm.invalid || (this.images.length === 0 && this.imageUrls.length === 0)) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('OwnerID', this.ownerID);
    formData.append('Description', this.photographerServiceForm.get('description')?.value);

    this.images.forEach((image, index) => {
      formData.append('Pictures', image.file, image.file.name);
    });

    if (this.PhotoId) {
      this.photographyService.updatePhotographerService(this.PhotoId, formData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'تم التعديل بنجاح',
            text: 'تم التعديل علي خدمة المصور بنجاح.',
          });
          this.photographerServiceForm.reset();
          this.images = [];
          this.imageUrls = [];
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء تعديل خدمة المصور. حاول مرة أخرى.',
          });
          console.error('Error:', error);
        }
      );
    }
  }
}
