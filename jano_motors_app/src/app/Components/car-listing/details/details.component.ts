import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { LanguageService } from '../../../Services/language.service';

import carDetailsInfo from '../../../../../public/json/car-listing.json';
import { BookingComponent } from "./booking/booking.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarsService } from '../../../Services/cars.service';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, BookingComponent, FontAwesomeModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  profImage = '149071.png'
  mainImage = ''
  modalVisible: boolean = false;
  showDLASSection: boolean = false;
  showCADSection: boolean = false;
  showPaymentSection: boolean = false;
  bookingCreated: boolean = false;

  isDriver: boolean = false;
  isAirport: boolean = false;

  car!: any;
  carDocs!: any[];
  currentCarInfo = carDetailsInfo["listing-cart-en"][0]
  currentCarAbout = carDetailsInfo["about-car-details-en"][0]

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private carsService: CarsService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    const carId = +this.route.snapshot.paramMap.get('id')!;
    this.carsService.getCarDetailsById(carId).subscribe({
      next: (data: any) => {
        this.mainImage = data.mainImage;
        this.car = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.carsService.getCarImagesById(carId).subscribe({
      next: (data: any) => {
        this.carDocs = data.images;
        this.mainImage = data.images[0].image;
      },
      error: (error) => {
        console.error(error);
      }
    });

    if(isPlatformBrowser(this.platformId)) {
      const savedLang = sessionStorage.getItem('currentLang');
      if(savedLang) {
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
    this.currentCarInfo = lang === 'en' ? carDetailsInfo['listing-cart-en'][0] : carDetailsInfo['listing-cart-geo'][0];
    this.currentCarAbout = lang === 'en' ? carDetailsInfo['about-car-details-en'][0] : carDetailsInfo['about-car-details-geo'][0];
  }

  Close() {
    this.bookingCreated = false;
  }

  openModal() {
    if (this.authService.getLoggedInUserIsVerified()) {
      this.modalVisible = true;
    } else {
      alert('Please verify your account before booking a car');
    }
  }

  driver() {
    this.isDriver = !this.isDriver;
    console.log(this.isDriver);
  }

  airport() {
    this.isAirport = !this.isAirport;
    console.log(this.isAirport);
  }

  setMainImage(image: string) {
    this.mainImage = image;
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  navigateToInstagram() {
    window.open('https://www.instagram.com/jano.motors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',)
  }

  copyNumber() {
    const numberToCopy = "+995555130031"

    navigator.clipboard.writeText(numberToCopy).then(() => {
      console.log('Number copied to clipboard')
    }).catch(err => {
      console.error('Could not copy text: ', err)
    })
  }

  copyMail() {
    const mailToCopy = 'janomotor.rental@gmail.com'

    navigator.clipboard.writeText(mailToCopy).then(() => {
      console.log('Mail copied to clipboard')
    }).catch(err => {
      console.error('Could not copy Mail: ', err)
    })
  }

}
