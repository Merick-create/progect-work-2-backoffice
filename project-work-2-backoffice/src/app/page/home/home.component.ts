import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { RequestService } from '../../service/request.service';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  protected requestService = inject(RequestService);
  protected authSrv = inject(AuthService);

  refresh$ = new BehaviorSubject<void>(undefined);


   request$ = this.authSrv.isAuthenticated$.pipe(

    switchMap(isAuth => {

      if (!isAuth) return of([]);

      return this.refresh$.pipe(

        switchMap(() =>
          this.requestService.list().pipe(

            catchError(err => {
              console.error(err);
              return of([]);
            })

          )
        )

      );
    })
  );



  deleteRequest(id: string) {

    if (!confirm('Vuoi eliminare questa richiesta?')) return;

    this.requestService.delete(id).subscribe(() => {
      this.refresh$.next();
    });
  }


  approveRequest(id: string) {

    this.requestService.approveRequest(id).subscribe(() => {
      this.refresh$.next();
    });
  }

}