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
import { errorInterceptor } from './utils/error.interceptor';
import { CommonModule } from "@angular/common";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationComponent } from './page/reservation/reservation.component';
import { HomeComponent } from '../app/page/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyReservationsComponent } from './page/my-reservations/my-reservations.component';
import { VerificationSentComponent } from './page/verification-sent/verification-sent.component';
import { VerifyEmailComponent } from './page/verify-email/verify-email.component';
import { VerificationSuccessComponent } from './page/verification-success/verification-success.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ReservationComponent,
    HomeComponent,
    ProfileComponent,
    MyReservationsComponent,
    VerificationSentComponent,
    VerifyEmailComponent,
    VerificationSuccessComponent,
    ToastComponent
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
      withInterceptors([authInterceptor, logoutInterceptor, errorInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
