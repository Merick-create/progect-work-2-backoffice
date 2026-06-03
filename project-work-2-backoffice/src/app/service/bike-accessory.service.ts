import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BikeAccessoryService {

  private http = inject(HttpClient);

  list() {
    return this.http.get<any[]>(
      `/api/bike-accessories`
    );
  }
}