import { Component } from '@angular/core';
import { User } from '../../../enity/user/user-entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
   user: User | null = null;
  profileForm!: FormGroup;
  saving = false;
  saved = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user && !this.profileForm) {
        this.initForm(user);
      }
    });
  }

  initForm(user: User) {
    this.profileForm = this.fb.group({
      password: ['', [Validators.minLength(6)]]
    });
  }

  get email() { return this.profileForm.get('email'); }
  get password() { return this.profileForm.get('password'); }

  onSubmit() {
    if (!this.profileForm.valid || !this.user) return;

    this.saving = true;
    this.saved = false;

    const payload: any = {
      email: this.email?.value
    };

    if (this.password?.value) {
      payload.password = this.password.value;
    }
    setTimeout(() => {
      this.saving = false;
      this.saved = true;
      this.profileForm.patchValue({ password: '' });
    }, 800);
  }
}
