import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import {BikesService} from "../../service/bikes.service";



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  protected bikesService = inject(BikesService);
  protected authSrv = inject(AuthService);

  refresh$ = new BehaviorSubject<void>(undefined);


   request$ = this.authSrv.isAuthenticated$.pipe(

    switchMap(isAuth => {

      if (!isAuth) return of([]);

      return this.refresh$.pipe(

        switchMap(() =>
          this.bikesService.list().pipe(

            catchError(err => {
              console.error(err);
              return of([]);
            })

          )
        )

      );
    })
  );



}