import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Request } from './request.entity';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  protected http = inject(HttpClient);

  list() {
    return this.http.get<Request[]>(`${environment.apiUrl}/requests/getAllRequests`);
  }

  add(request:Partial<Request>) {
    return this.http.post<Request>(`${environment.apiUrl}/requests/createRequest`, request);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/requests/deleteRequest/${id}`);
  }

  update(id: string, body: any) {
    return this.http.put(`${environment.apiUrl}/requests/updateRequest/${id}`, body);
  }

  approveRequest(id: string) {
    return this.http.put(`${environment.apiUrl}/requests/approveRequest/${id}`, {});
  }
}
