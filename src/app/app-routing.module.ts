import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
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
import { authGuard } from './Guard/auth.guard';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './Components/edit-profile/change-password/change-password.component';
import { GeneralComponent } from './Components/edit-profile/general/general.component';
import { SocialLinksComponent } from './Components/edit-profile/social-links/social-links.component';
import { InfoComponent } from './Components/edit-profile/info/info.component';
import { AllUsersComponent } from './Components/Admin/all-users/all-users.component';
import { roleGuard } from './Guard/role.guard';
import { AllCustomersComponent } from './Components/Admin/all-customers/all-customers.component';
import { NewOwnersRequestsComponent } from './Components/Admin/new-owners-requests/new-owners-requests.component';
import { NewAddServicesRequestsComponent } from './Components/Admin/new-add-services-requests/new-add-services-requests.component';
import { OwnerDetailsComponent } from './Components/Admin/owner-details/owner-details.component';
import { ComplainsComponent } from './Components/Admin/complains/complains.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'addService', component: AddServiceComponent },
      {
        path: 'allUsers',
        component: AllUsersComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Admin' },
      },
      {
        path: 'allCustomers',
        component: AllCustomersComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Admin' },
      },
      {
        path: 'newOwnersRequests',
        component: NewOwnersRequestsComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Admin' },
      },
      {
        path: 'newAddServicesRequests',
        component: NewAddServicesRequestsComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Admin' },
      },
      {
        path: 'complains',
        component: ComplainsComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Admin' },
      },
      {
        path: 'ownerDetails',
        component: OwnerDetailsComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Admin' },
      },
      { path: 'addService/addHall', component: AddHallComponent },
      { path: 'addService/addCar', component: AddCarComponent },
      {
        path: 'addService/addBeautyCenter',
        component: AddBeautyCenterComponent,
      },
      { path: 'addService/addDress', component: AddDressComponent },
      {
        path: 'addService/addPhotographer',
        component: AddPhotographerComponent,
      },
      { path: 'mangeServices', component: MangeServicesComponent },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Owner' },
      },
      {
        path: 'contactUs',
        component: ContactUsComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Owner' },
      },
      {
        path: 'editProfile',
        component: EditProfileComponent,
        canActivate: [roleGuard],
        data: { expectedRole: 'Owner' },
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' },
          { path: 'changePassword', component: ChangePasswordComponent },
          { path: 'general', component: GeneralComponent },
          { path: 'socialLinks', component: SocialLinksComponent },
          { path: 'info', component: InfoComponent },
        ],
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
