import { Component, inject, HostListener} from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, take } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { JwtService } from '../../service/jwt.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected auth = inject(AuthService);
  protected jwtSrv = inject(JwtService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.jwtSrv.hasToken() && !!this.jwtSrv.decodeToken();
  }
  
  @HostListener('window:scroll', [])
  onScroll() {
    const heroSection = document.querySelector('.hero-section');
    const sections = document.querySelectorAll('.section-fade');
    
    // Hero background animation
    if (heroSection) {
      const scrolled = window.pageYOffset;
      if (scrolled > 50) {
        heroSection.classList.add('scrolled');
      } else {
        heroSection.classList.remove('scrolled');
      }
    }
    
    // Section fade-in animation
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight * 0.85) {
        section.classList.add('visible');
      }
    });
  }

  ngOnInit() {
    this.onScroll();
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const token = params.get('token');
      if (token) {
        this.auth.verifyEmail(token).subscribe({
          next: () => this.router.navigate(['/verification-success']),
          error: () => {}
        });
      }
    });
  }
}