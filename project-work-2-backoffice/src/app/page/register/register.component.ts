import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: false
})
export class RegisterComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);

  protected destroyed$ = new Subject<void>();
  loading = false;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;
    this.loading = true;

    this.authSrv.register({
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      username: formValue.username || '',
      password: formValue.password || ''
    })
    .subscribe({
      next: () => this.router.navigate(['/verification-sent']),
      error: () => this.loading = false
    });
  }

  isInvalid(control: string): boolean {
    const c = this.registerForm.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  fieldError(control: string): string {
    const c = this.registerForm.get(control);
    if (!c || !c.errors || !(c.dirty || c.touched)) return '';
    if (c.errors['required']) return 'Campo obbligatorio';
    if (c.errors['email']) return 'Inserisci un email valida';
    if (c.errors['minlength']) return 'Minimo 6 caratteri';
    return '';
  }
}
