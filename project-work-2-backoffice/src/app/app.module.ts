import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './page/register/register.component';
import { LoginComponent } from './page/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth.interceptor';
import { logoutInterceptor } from './utils/logout.interceptor';
import {CommonModule} from "@angular/common";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationComponent } from './page/reservation/reservation.component';

import { HomeComponent } from '../app/page/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ReservationComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, logoutInterceptor])
    )],
  bootstrap: [AppComponent]
})
export class AppModule { }
