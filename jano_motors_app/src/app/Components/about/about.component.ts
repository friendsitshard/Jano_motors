import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { LanguageService } from '../../Services/language.service';

import aboutInfo from '../../../../public/json/about.json';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit{
  currentInfo = aboutInfo['about-info-en'][0];
  currentAbout = aboutInfo['about-section-en'];
  currentContact = aboutInfo['contact-section-en'][0];

  constructor(
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = sessionStorage.getItem('currentLang');
      if (savedLang) {
        this.languageService.setCurrentLang(savedLang);
        this.updateContent(savedLang);
      } else {
        this.updateContent(this.languageService.getCurrentLang());
      }
    }

    this.languageService.getCurrentLangObservable().subscribe((lang) => {
      this.updateContent(lang);
    });
  }

  updateContent(lang: string) {
    this.currentInfo = lang === 'en' ? aboutInfo['about-info-en'][0] : aboutInfo['about-info-geo'][0];
    this.currentAbout = lang === 'en' ? aboutInfo['about-section-en'] : aboutInfo['about-section-geo'];
    this.currentContact = lang === 'en' ? aboutInfo['contact-section-en'][0] : aboutInfo['contact-section-geo'][0];
  }

  copyNumber() {
    const numberToCopy = "999999999"

    navigator.clipboard.writeText(numberToCopy).then(() => {
      console.log('Number copied to clipboard')
    }).catch(err => {
      console.error('Could not copy text: ', err)
    })
  }

  copyMail() {
    const mailToCopy = 'jano@gmail.com'

    navigator.clipboard.writeText(mailToCopy).then(() => {
      console.log('Mail copied to clipboard')
    }).catch(err => {
      console.error('Could not copy Mail: ', err)
    })
  }

  copyAddres() {
    const addresToCopy = 'lisi simon getyvi xval zeg zustad'

    navigator.clipboard.writeText(addresToCopy).then(() => {
      console.log('Mail copied to clipboard')
    }).catch(err => {
      console.error('Could not copy Mail: ', err)
    })
  }

  moveToMap() {
    window.open('https://maps.app.goo.gl/yuCe25Hyme9mGafh8')
  }
}
