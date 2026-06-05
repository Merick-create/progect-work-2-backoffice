import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BikeTypology } from '../../enity/bike-typologies/bike-typologies-entity';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BikeTypologiesService {
  private http = inject(HttpClient);

  list() {
    return this.http.get<BikeTypology[]>(`${environment.apiUrl}/api/bike-typologies`);
  }
}
