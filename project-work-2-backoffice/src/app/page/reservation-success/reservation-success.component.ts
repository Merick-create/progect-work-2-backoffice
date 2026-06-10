import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-success',
  standalone: false,
  templateUrl: './reservation-success.component.html',
  styleUrls: ['./reservation-success.component.css']
})
export class ReservationSuccessComponent {
  constructor(private router: Router) {}

  goToMyReservations(): void {
    this.router.navigate(['/my-reservations']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
