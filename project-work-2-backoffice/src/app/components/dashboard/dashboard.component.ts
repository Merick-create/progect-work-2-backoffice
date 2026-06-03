import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import {User} from "../../../enity/user/user-entity";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
   isLoggedIn = false;
  userInitials = '';
  userName = '';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      
      if (user) {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        this.userName = `${firstName} ${lastName}`.trim();
        
        if (firstName && lastName) {
          this.userInitials = `${firstName[0]}${lastName[0]}`.toUpperCase();
        } else if (firstName) {
          this.userInitials = firstName.substring(0, 2).toUpperCase();
        } else {
          this.userInitials = 'UU';
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProfile() {
  this.router.navigate(['/profilo']); 
}

goToBookings() {
  this.router.navigate(['/prenotazioni']); 
}

}
