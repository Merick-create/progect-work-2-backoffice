import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { HomeComponent } from './page/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationComponent } from './page/reservation/reservation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './utils/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent       // ← home come root
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
    path: 'reservation',
    canActivate:[authGuard],
    component: ReservationComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: ''                 // opzionale: fallback alla home
  },
  {
  path: 'profilo',
  canActivate:[authGuard],
  component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
