import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocationEntity } from '../../enity/location/location-entity';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private http = inject(HttpClient);

  list() {
    return this.http.get<LocationEntity[]>(
      `/api/locations`
    );
  }
}