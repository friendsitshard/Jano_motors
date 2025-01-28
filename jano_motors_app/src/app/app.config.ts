import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { MatNativeDateModule } from '@angular/material/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(MatNativeDateModule),
    provideHttpClient(withFetch()),
  ],
};
