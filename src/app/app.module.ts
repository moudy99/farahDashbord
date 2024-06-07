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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
