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

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home
      { path: 'home', component: HomeComponent },
      { path: 'addService', component: AddServiceComponent },
      { path: 'mangeServices', component: MangeServicesComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'contactUs', component: ContactUsComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  // This can be removed as it's already handled above
  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
