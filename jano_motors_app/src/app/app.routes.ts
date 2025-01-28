import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AboutComponent } from './Components/about/about.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { CarListingComponent } from './Components/car-listing/car-listing.component';
import { DetailsComponent } from './Components/car-listing/details/details.component';
import { BookingComponent } from './Components/car-listing/details/booking/booking.component';
import { AdminComponent } from './admin/admin.component';
import { AllBookingsComponent } from './admin/all-bookings/all-bookings.component';
import { AllUsersComponent } from './admin/all-users/all-users.component';
import { UnverifiedBookingsComponent } from './admin/unverified-bookings/unverified-bookings.component';
import { VerifiedBookingsComponent } from './admin/verified-bookings/verified-bookings.component';
import { VerifiedUsersComponent } from './admin/verified-users/verified-users.component';
import { UnverifiedUsersComponent } from './admin/unverified-users/unverified-users.component';
import { AuthService } from './Services/auth.service';
import { inject } from '@angular/core';
import { BookingDetailsComponent } from './admin/booking-details/booking-details.component';
import { UploadCarComponent } from './admin/upload-car/upload-car.component';
import { UploadCarImagesComponent } from './admin/upload-car-images/upload-car-images.component';
import { AllCarComponent } from './admin/all-car/all-car.component';
import { EditCarComponent } from './admin/all-car/edit-car/edit-car.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, title: 'Home'},
    {path: 'home', component: HomeComponent, title: 'Home'},
    {path: 'about', component: AboutComponent, title: 'About'},
    {path: 'cars-listing', component: CarListingComponent, title: 'Cars'},
    {path: 'cars-listing/details/:id', component: DetailsComponent, title: 'Car Details'},
    {path: 'cars-listing/details/booking', component: BookingComponent, title: 'Car Details'},
    {path: 'profile', component: ProfileComponent, title: 'Profile'},
    {path: 'login', component: LoginComponent, title: 'Login'},
    {path: 'register', component: RegisterComponent, title: 'Register'},


    {path: 'admin', component: AdminComponent, title: 'Admin', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},

    {path: 'admin/all-bookings', component: AllBookingsComponent, title: 'All Bookings', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/unverified-bookings', component: UnverifiedBookingsComponent, title: 'Unverified Bookings', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/verified-bookings', component: VerifiedBookingsComponent, title: 'Verified Bookings', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/booking-details/:id', component: BookingDetailsComponent, title: 'Booking Details', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},

    {path: 'admin/all-users', component: AllUsersComponent, title: 'All Users', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/unverified-users', component: VerifiedUsersComponent, title: 'Unverified Users', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/verified-users', component: UnverifiedUsersComponent, title: 'Verified Users', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/upload-car', component: UploadCarComponent, title: 'Upload Car', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/upload-car-images', component: UploadCarImagesComponent, title: 'Upload Car Images', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/all-cars', component: AllCarComponent, title: 'All Cars', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]},
    {path: 'admin/edit-car/:id', component: EditCarComponent, title: 'Edit Car', canActivate: [() => inject(AuthService).canAccessAdminRoutes()]}
];
