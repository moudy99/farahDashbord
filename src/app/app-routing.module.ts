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
      { path: 'orders', component: OrdersComponent },
      { path: 'contactUs', component: ContactUsComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
