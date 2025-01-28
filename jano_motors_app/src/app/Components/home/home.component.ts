import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FilterComponent } from "./filter/filter.component";
import { AboutUsComponent} from "./about-us/about-us.component"
import { CarTypesComponent } from "./car-types/car-types.component";
import { LanguageService } from '../../Services/language.service';
import { isPlatformBrowser } from '@angular/common';

import homeInfo from '../../../../public/json/home.json';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FilterComponent, AboutUsComponent, CarTypesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  currentSlider = homeInfo['slider-en'];
  currentAboutUs = homeInfo['about-us-en'];
  currentFilter = homeInfo['filter-en'];
  currentTypes = homeInfo['types-en'];

  constructor(
    public languageService: LanguageService,
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
    this.currentSlider = lang === 'en' ? homeInfo['slider-en'] : homeInfo['slider-geo'];
    this.currentAboutUs = lang === 'en' ? homeInfo['about-us-en'] : homeInfo['about-us-geo'];
    this.currentFilter = lang === 'en' ? homeInfo['filter-en'] : homeInfo['filter-geo'];
    this.currentTypes = lang === 'en' ? homeInfo['types-en'] : homeInfo['types-geo'];
  }
}
