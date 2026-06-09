import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private authSrv = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private destroyed$ = new Subject<void>();

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  requestedUrl: string | null = null;
  loading = false;

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map(params => params['requestedUrl'])
      )
      .subscribe(url => {
        this.requestedUrl = url;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    this.loading = true;

    this.authSrv.login(username!, password!)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([this.requestedUrl ? this.requestedUrl : '/home']);
        },
        error: () => this.loading = false
      });
  }

  isInvalid(control: string): boolean {
    const c = this.loginForm.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  fieldError(control: string): string {
    const c = this.loginForm.get(control);
    if (!c || !c.errors || !(c.dirty || c.touched)) return '';
    if (c.errors['required']) return 'Campo obbligatorio';
    if (c.errors['email']) return 'Inserisci un email valida';
    if (c.errors['minlength']) return 'Minimo 6 caratteri';
    return '';
  }
}
