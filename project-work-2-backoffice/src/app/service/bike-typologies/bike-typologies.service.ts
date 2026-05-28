import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { BikeTypology } from '../../../enity/bike-typologies/bike-typologies-entity';

@Injectable({
  providedIn: 'root'
})
export class BikeTypologiesService {
    private apiUrl = '/api/bike-typologies'; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<BikeTypology[]> {
    return this.http.get<BikeTypology[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getById(id: string): Observable<BikeTypology> {
    return this.http.get<BikeTypology>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  create(typology: Omit<BikeTypology, 'id'>): Observable<BikeTypology> {
    return this.http.post<BikeTypology>(this.apiUrl, typology)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(id: string, typology: Partial<BikeTypology>): Observable<BikeTypology> {
    return this.http.put<BikeTypology>(`${this.apiUrl}/${id}`, typology)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Errore BikeTypologiesService:', error);
    
    let errorMessage = 'Si è verificato un errore imprevisto';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
