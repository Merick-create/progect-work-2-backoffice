import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bike } from './bikes.entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private http = inject(HttpClient);

  getAvailable(locationId: string, startDate: string, endDate: string) {
    let params = `location=${locationId}&available=true&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<Bike[]>(`${environment.apiUrl}/api/bikes?${params}`);
  }
}