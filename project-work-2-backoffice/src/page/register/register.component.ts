import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone:false
})
export class RegisterComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);

  protected destroyed$ = new Subject<void>();
  registerError = '';

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required]
  });

  ngOnInit(): void {
    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.registerError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
  const formValue = this.registerForm.value;


  this.authSrv.register({
    firstName: formValue.firstName || '',
    lastName: formValue.lastName || '',
    email: formValue.email || '',
    password: formValue.password || '',
    role: formValue.role || ''
  })
  .pipe(
    catchError(err => {
      this.registerError = err.error.message || 'Registration failed';
      return throwError(() => err);
    })
  )
  .subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
