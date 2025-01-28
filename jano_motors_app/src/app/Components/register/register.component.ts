import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import registerInfo from '../../../../public/json/register.json';
import { LanguageService } from '../../Services/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  errorMessage: string = '';
  currentRegisterInfo = registerInfo['register-en'][0]

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: 1
    });
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      const savedLang = sessionStorage.getItem('currentLang');

      if(savedLang) {
        this.languageService.setCurrentLang(savedLang);
        this.updateContent(savedLang);
      } else {
        this.updateContent(this.languageService.getCurrentLang());
      }
    }

    this.languageService.getCurrentLangObservable().subscribe(lang => {this.updateContent(lang)});
  }

  updateContent(lang: string) {
    this.currentRegisterInfo = lang === 'en' ? registerInfo['register-en'][0] : registerInfo['register-geo'][0];
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Registration failed';
        }
      });
    }
  }
}
