import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BikeSizesEntity } from '../../enity/bike-sizes/bike-sizes-etity';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BikeSizesService {
  private http = inject(HttpClient);

  list() {
    return this.http.get<BikeSizesEntity[]>(`${environment.apiUrl}/api/bike-sizes`);
  }
}
