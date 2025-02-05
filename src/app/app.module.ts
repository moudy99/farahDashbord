// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component'; // Import HomeComponent
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { AddServiceComponent } from './Components/add-service/add-service.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { MangeServicesComponent } from './Components/mange-services/mange-services.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { AddHallComponent } from './Components/All Servicess/add-hall/add-hall.component';
import { AddCarComponent } from './Components/All Servicess/add-car/add-car.component';
import { AddBeautyCenterComponent } from './Components/All Servicess/add-beauty-center/add-beauty-center.component';
import { AddDressComponent } from './Components/All Servicess/add-dress/add-dress.component';
import { AddPhotographerComponent } from './Components/All Servicess/add-photographer/add-photographer.component';
import { AuthService } from './Service/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Import NoopAnimationsModule
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './Components/edit-profile/change-password/change-password.component';
import { GeneralComponent } from './Components/edit-profile/general/general.component';
import { SocialLinksComponent } from './Components/edit-profile/social-links/social-links.component';
import { InfoComponent } from './Components/edit-profile/info/info.component';
import { AllUsersComponent } from './Components/Admin/all-users/all-users.component';
import { AllCustomersComponent } from './Components/Admin/all-customers/all-customers.component';
import { SignalrService } from './Service/signalr.service';
import { NewOwnersRequestsComponent } from './Components/Admin/new-owners-requests/new-owners-requests.component';
import { NewAddServicesRequestsComponent } from './Components/Admin/new-add-services-requests/new-add-services-requests.component';
import { OwnerDetailsComponent } from './Components/Admin/owner-details/owner-details.component';
import { StoreModule } from '@ngrx/store';
import { ownersReducer } from './reducers/owners.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LightboxModule } from 'ngx-lightbox';
import { ToastrModule } from 'ngx-toastr';
import { ComplainsComponent } from './Components/Admin/complains/complains.component';
import { EditHallComponent } from './Components/edit_service/edit-hall/edit-hall.component';
import { EditcarComponent } from './Components/edit_service/editcar/editcar.component';
import { ChatComponent } from './Components/chat/chat.component';
import { EditBeautyCenterComponent } from './Components/edit_service/edit-beauty-center/edit-beauty-center.component';
import { EditPhotographerComponent } from './Components/edit_service/edit-photographer/edit-photographer.component';
import { ServiceDetailsComponent } from './Components/Admin/service-details/service-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    AddServiceComponent,
    LayoutComponent,
    MangeServicesComponent,
    OrdersComponent,
    ContactUsComponent,
    AddHallComponent,
    AddCarComponent,
    AddBeautyCenterComponent,
    AddDressComponent,
    AddPhotographerComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    GeneralComponent,
    SocialLinksComponent,
    InfoComponent,
    AllUsersComponent,
    AllCustomersComponent,
    NewOwnersRequestsComponent,
    NewAddServicesRequestsComponent,
    OwnerDetailsComponent,
    ComplainsComponent,
    ChatComponent,
    EditHallComponent,
    EditcarComponent,
    EditBeautyCenterComponent,
    EditPhotographerComponent,
    ServiceDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgbModalModule,
    StoreModule.forRoot({ owners: ownersReducer }),
    LightboxModule,
    ToastrModule.forRoot({
      progressBar: true,
      positionClass: 'toast-top-left',
      timeOut: 2000,
      extendedTimeOut: 1000,
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      preventDuplicates: true,
      easing: 'ease-in',
      easeTime: 300,
      progressAnimation: 'increasing',
      toastClass: 'ngx-toastr animated bounceInLeft',
      titleClass: 'ngx-toastr-title',
      messageClass: 'ngx-toastr-message',
    }),
  ],
  providers: [AuthService, SignalrService],
  bootstrap: [AppComponent],
})
export class AppModule {}
