import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../enity/user/user-entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected http = inject(HttpClient);

  list(role:string) {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`,{params:{role}});
  }

  getMe() {
    return this.http.get<User>(`${environment.apiUrl}/api/users/me`);
  }

}