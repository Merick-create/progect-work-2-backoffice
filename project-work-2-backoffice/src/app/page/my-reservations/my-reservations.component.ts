import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../service/reservation.service';
import { Reservation } from '../../service/reservation.entity';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { BehaviorSubject, catchError, of } from 'rxjs';


@Component({
  selector: 'app-my-reservations',
  standalone: false,
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  refresh$ = new BehaviorSubject<void>(undefined);

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  reservation$ = this.refresh$.pipe(
      switchMap(() =>
        this.reservationService.list().pipe(
          catchError(err => { console.error(err); return of([]); })
        )
      )
    );

    get inRentalReservations(): Reservation[] {
      return this.reservations.filter(r => r.status === 'in_rental');
    }

    get currentReservations(): Reservation[] {
      return this.reservations.filter(r => r.status === 'pending');
    }

    get completedReservations(): Reservation[] {
      return this.reservations.filter(r => r.status === 'completed');
    }

    get cancelledReservations(): Reservation[] {
      return this.reservations.filter(r => r.status === 'cancelled');
    }


  loadReservations() {
    this.loading = true;

  this.reservationService.list().subscribe({
    next: (res) => {
      console.log('RAW RES:', res);

      this.reservations = [...res];

      console.log('IN RENTAL:', this.inRentalReservations);

      this.loading = false;
    },
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