import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bike } from './bikes.entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private http = inject(HttpClient);

  getAvailable(locationId: string, date?: string) {
    let params = `location=${locationId}&available=true`;
    if (date) params += `&date=${date}`;
    return this.http.get<Bike[]>(`${environment.apiUrl}/api/bikes?${params}`);
  }
}