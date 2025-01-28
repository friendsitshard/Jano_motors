import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { LanguageService } from '../../Services/language.service';

import loginInfo from '../../../../public/json/login.json';
import usersLInfo from '../../../../public/json/users.json';
import { User } from '../../Interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string = '';
  currentLoginInfo = loginInfo['login-en'][0]
  users = usersLInfo['users'];


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    this.currentLoginInfo = lang === 'en' ? loginInfo['login-en'][0] : loginInfo['login-geo'][0];
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token!);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.errorMessage = 'Invalid email or password';
        }
      });
    }
  }
}
