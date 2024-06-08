import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
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
import { AuthService } from './Service/auth.service';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
