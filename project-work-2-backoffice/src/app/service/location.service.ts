import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocationEntity } from '../../enity/location/location-entity';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private http = inject(HttpClient);

  list() {
    return this.http.get<LocationEntity[]>(
      `${environment.apiUrl}/api/locations`
    );
  }
}