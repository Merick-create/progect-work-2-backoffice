import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {BikeTypology} from "../../enity/bikes/bikes-entity";


@Injectable({
  providedIn: 'root'
})
export class BikesService {
  protected http = inject(HttpClient);

  list() {
    return this.http.get<BikeTypology[]>(`/api/bikes`);
  }

  getById(id: string) {
    return this.http.get<BikeTypology>(`/api/bikes/${id}`);
  }

  add(request:Partial<BikeTypology>) {
    return this.http.post<BikeTypology>(`/api/bikes`, request);
  }

  delete(id: string) {
    return this.http.delete(`/api/bikes/${id}`);
  }

  update(id: string, body: any) {
    return this.http.put(`/api/bikes/${id}`, body);
  }

  approveRequest(id: string) {
    return this.http.put(`/api/bikes/${id}/approve`, {});
  }
}
