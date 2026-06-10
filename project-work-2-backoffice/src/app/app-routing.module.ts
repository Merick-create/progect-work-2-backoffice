import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { HomeComponent } from './page/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationComponent } from './page/reservation/reservation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyReservationsComponent } from './page/my-reservations/my-reservations.component';
import { VerificationSentComponent } from './page/verification-sent/verification-sent.component';
import { VerifyEmailComponent } from './page/verify-email/verify-email.component';
import { VerificationSuccessComponent } from './page/verification-success/verification-success.component';
import { ReservationSuccessComponent } from './page/reservation-success/reservation-success.component';
import { authGuard } from './utils/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'verification-sent',
    component: VerificationSentComponent
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'verification-success',
    component: VerificationSuccessComponent
  },
  {
    path: 'reservation',
    component: ReservationComponent
  },
  {
    path: 'reservation-success',
    component: ReservationSuccessComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'my-reservations',
    component: MyReservationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profilo',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
