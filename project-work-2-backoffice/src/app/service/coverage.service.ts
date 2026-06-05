import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCoverageService {

  private http = inject(HttpClient);

  list() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/insurance-coverages`
    );
  }
}