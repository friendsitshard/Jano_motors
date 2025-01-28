import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');

  currentLang$ = this.currentLang.asObservable();
  
  toggleLanguage(): string {
    const newLang = this.currentLang.value === 'en' ? 'geo' : 'en';
    this.currentLang.next(newLang);
    return this.currentLang.value;
  }

  getCurrentLang(): string {
    return this.currentLang.value;
  }

  getOpposideLang(): string {
    return this.currentLang.value === 'en' ? 'geo' : 'en';
  }

  setCurrentLang(lang: string) {
    this.currentLang.next(lang);
  }

  getCurrentLangObservable() {
    return this.currentLang.asObservable();
  }
}
