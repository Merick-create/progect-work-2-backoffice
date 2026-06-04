import { Component, OnDestroy } from '@angular/core';
import { User } from '../../../enity/user/user-entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnDestroy {
  user: User | null = null;
  profileForm!: FormGroup;
  saving = false;
  saved = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (!user) return;
      this.user = user;
      this.loadFullProfile();
      if (!this.profileForm) {
        this.initForm(this.user);
      }
    });
  }

  private loadFullProfile() {
    this.userService.getMe().pipe(takeUntil(this.destroy$)).subscribe({
      next: (fullUser) => {
        this.user = fullUser;
        if (this.profileForm) {
          this.profileForm.patchValue({ email: fullUser.email || '' });
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(user: User) {
    this.profileForm = this.fb.group({
      email: [user.email || '', [Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  get email() { return this.profileForm?.get('email'); }
  get password() { return this.profileForm?.get('password'); }

  onSubmit() {
    if (!this.profileForm?.valid || !this.user) return;

    this.saving = true;
    this.saved = false;

    setTimeout(() => {
      this.saving = false;
      this.saved = true;
      this.profileForm.patchValue({ password: '' });
    }, 800);
  }
}
