import { Component, inject } from '@angular/core';
import { BikeTypology } from '../../../enity/bike-typologies/bike-typologies-entity';
import { BikeTypologiesService } from '../../service/bike-typologies/bike-typologies.service';
import { AuthService } from '../../service/auth.service';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-bike-typologies',
  standalone: false,
  templateUrl: './bike-typologies.component.html',
  styleUrl: './bike-typologies.component.css'
})
export class BikeTypologiesComponent {
  protected bikeTypologyService = inject(BikeTypologiesService);


  protected authSrv = inject(AuthService);

  refresh$ = new BehaviorSubject<void>(undefined);
  
  
     request$ = this.authSrv.isAuthenticated$.pipe(
  
      switchMap(isAuth => {
  
        if (!isAuth) return of([]);
  
        return this.refresh$.pipe(
  
          switchMap(() =>
            this.bikeTypologyService.getAll().pipe(
  
              catchError(err => {
                console.error(err);
                return of([]);
              })
  
            )
          )
  
        );
      })
    );
  bikesService: any;


}
