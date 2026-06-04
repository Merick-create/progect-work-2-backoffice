import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../service/reservation.service';
import { Reservation } from '../../service/reservation.entity';

@Component({
  selector: 'app-my-reservations',
  standalone: false,
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  get currentReservation(): Reservation | null {
    const active = this.reservations.filter(r => r.status === 'active' || r.status === 'confirmed');
    return active.length > 0 ? active[0] : null;
  }

  get upcomingReservations(): Reservation[] {
    return this.reservations.filter(r => r.status === 'pending' || r.status === 'confirmed')
      .filter(r => !this.currentReservation || r.id !== this.currentReservation.id);
  }

  get pastReservations(): Reservation[] {
    return this.reservations.filter(r => r.status === 'completed' || r.status === 'cancelled' || r.status === 'archived');
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.list().subscribe({
      next: (res) => { this.reservations = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  cancelReservation(id: string) {
    if (!confirm('Annullare questa prenotazione?')) return;
    this.reservationService.changeStatus(id, 'cancelled').subscribe({
      next: () => this.loadReservations()
    });
  }
}