import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../Services/auth.service';
import { LanguageService } from '../../../../Services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent {
  updatePasswordForm: FormGroup;

  isPasswordVisible: boolean = false;
  isPasswordRepeatVisible: boolean = false;
  isPasswordChangeVissible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.updatePasswordForm = this.fb.group({
      id: [this.authService.getLogedInUserId(), Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  onSubmit(): void { 
    if (this.updatePasswordForm.valid) {
      this.authService.updatePassword(this.updatePasswordForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.updatePasswordForm.reset();
          this.updatePasswordForm.setErrors({invalid: true});
        }
      })
    }
  }

  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  showRepeatPassword() {
    this.isPasswordRepeatVisible = !this.isPasswordRepeatVisible;
  }

  showPasswordChange() {
    this.isPasswordChangeVissible = !this.isPasswordChangeVissible;
  }
}
