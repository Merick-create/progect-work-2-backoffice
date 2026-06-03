import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {


}