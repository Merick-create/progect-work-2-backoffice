import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reservation } from './reservation.entity';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);
    
  add(reservation: any) {
        return this.http.post<Reservation>(
        `/api/reservations`,
        reservation
        );
    }

  list() {
    return this.http.get<Reservation[]>(
      `/api/reservations`
    );
  }

  get(id: string) {
    return this.http.get<Reservation>(
      `/api/reservations/${id}`
    );
  }

  delete(id: string) {
    return this.http.delete(
      `/api/reservations/${id}`
    );
  }

  update(id: string, data: any) {
    return this.http.put(
      `/api/reservations/${id}`,
      data
    );
  }

  changeStatus(id: string, status: string) {
    return this.http.put(
      `/api/reservations/${id}/status`,
      { status }
    );
  }
 
  
}