import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../entities/user.entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected http = inject(HttpClient);

  list(role:string) {
    return this.http.get<User[]>('${environment.apiUrl}/users',{params:{role}});
  }

}