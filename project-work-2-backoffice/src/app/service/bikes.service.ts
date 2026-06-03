import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bike } from './bikes.entity';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private http = inject(HttpClient);

  getAvailable(locationId: string) {
    return this.http.get<Bike[]>(
      `/api/bikes?location=${locationId}&available=true`
    );
  }
}