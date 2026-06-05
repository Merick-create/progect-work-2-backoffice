import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reservation } from './reservation.entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);
    
  add(reservation: any) {
        return this.http.post<Reservation>(
        `${environment.apiUrl}/api/reservations`,
        reservation
        );
    }

  list() {
    return this.http.get<Reservation[]>(
      `${environment.apiUrl}/api/reservations`
    );
  }

  get(id: string) {
    return this.http.get<Reservation>(
      `${environment.apiUrl}/api/reservations/${id}`
    );
  }

  delete(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/api/reservations/${id}`
    );
  }

  update(id: string, data: any) {
    return this.http.put(
      `${environment.apiUrl}/api/reservations/${id}`,
      data
    );
  }

  changeStatus(id: string, status: string) {
    return this.http.put(
      `${environment.apiUrl}/api/reservations/${id}/status`,
      { status }
    );
  }
 
  
}