import { Component, inject, HostListener} from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  
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
    // Trigger scroll listener on init
    this.onScroll();
  }
}