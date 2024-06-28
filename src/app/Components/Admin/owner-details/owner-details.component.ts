import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Owner } from 'src/app/Interfaces/owner';
import { OwnersState } from './../../../reducers/owners.reducer';
import { environment } from 'src/environments/environment.development';
import { AddressService } from 'src/app/Service/address.service';
import { Router } from '@angular/router';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrls: ['./owner-details.component.css'],
})
export class OwnerDetailsComponent implements OnInit, OnDestroy {
  gov: string = '';
  city: string = '';
  selectedOwner: Observable<Owner | null>;
  private selectedOwnerSubscription: Subscription | undefined;
  albums: Array<any> = [];

  constructor(
    private store: Store<{ owners: OwnersState }>,
    private addressService: AddressService,
    private router: Router,
    private lightbox: Lightbox,
    private lightboxConfig: LightboxConfig
  ) {
    this.selectedOwner = this.store.pipe(
      select((state) => state.owners.selectedOwner),
      map((owner) => (owner ? this.mapResponseToOwner(owner) : null))
    );

    this.lightboxConfig.fadeDuration = 0.7;
    this.lightboxConfig.resizeDuration = 0.5;
    this.lightboxConfig.wrapAround = true;
    this.lightboxConfig.showImageNumberLabel = true;
    this.lightboxConfig.centerVertically = true;
  }

  ngOnInit(): void {
    this.selectedOwnerSubscription = this.selectedOwner.subscribe((owner) => {
      if (owner) {
        this.getGovernorateName(owner.govID).subscribe();
        this.getCityName(owner.cityID).subscribe();
        this.initializeAlbum(owner);
      } else {
        console.log('No owner selected.');
        this.goBack();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.selectedOwnerSubscription) {
      this.selectedOwnerSubscription.unsubscribe();
    }
  }

  private mapResponseToOwner(response: any): Owner {
    return {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      userName: response.userName,
      ssn: response.ssn,
      city: this.city,
      gov: this.gov,
      govID: response.govID,
      cityID: response.cityID,
      email: response.email,
      phoneNumber: response.phoneNumber,
      profileImage: `${response.profileImage}`,
      isBlocked: response.isBlocked,
      isDeleted: response.isDeleted,
      yourFavirotePerson: '',
      idFrontImage: `${environment.UrlForImages}/${response.idFrontImage}`,
      idBackImage: `${environment.UrlForImages}/${response.idBackImage}`,
      userType: response.userType,
      accountStatus: response.accountStatus,
    };
  }

  private getGovernorateName(govID: number): Observable<any> {
    return this.addressService.getGovernorateByID(govID).pipe(
      map((response) => {
        this.gov = response.data.name;
        return response;
      })
    );
  }

  private getCityName(cityID: number): Observable<any> {
    return this.addressService.getCityByID(cityID).pipe(
      map((response) => {
        this.city = response.data.name;
        return response;
      })
    );
  }

  private initializeAlbum(owner: Owner): void {
    this.albums = [
      {
        src: owner.profileImage,
        thumb: owner.profileImage,
        caption: 'Profile Image',
      },
      {
        src: owner.idFrontImage,
        thumb: owner.idFrontImage,
        caption: 'ID Front Image',
      },
      {
        src: owner.idBackImage,
        thumb: owner.idBackImage,
        caption: 'ID Back Image',
      },
    ];
  }

  openAlbum(index: number): void {
    this.lightbox.open(this.albums, index);
  }

  goBack(): void {
    this.router.navigate(['/newOwnersRequests']);
  }
}
