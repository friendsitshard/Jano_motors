import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { UserInfoPost, UserInfo } from '../../../Interfaces/user-info';
import { UserDocPost, UserDoc } from '../../../Interfaces/user-doc';
import { AuthService } from '../../../Services/auth.service';
import { UserService } from '../../../Services/user.service';
import { first } from 'rxjs';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UpdatePasswordComponent],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent implements OnInit {
  userInfo!: UserInfo;
  userDoc!: UserDoc[];

  isPasswordVisible: boolean = false;
  isPasswordRepeatVisible: boolean = false;
  isPasswordChangeVissible: boolean = false;

  accountForm!: FormGroup;

  profileImageSrc: any;
  idFrontsrc: any;
  idBacksrc: any;
  driverFrontsrc: any;
  driverBacksrc: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.accountForm = this.fb.group({
      id: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      profileImage: [null, Validators.required],
      idFrontImage: [null, Validators.required],
      idBackImage: [null, Validators.required],
      driverLicenseFrontImage: [null, Validators.required],
      driverLicenseBackImage: [null, Validators.required],
    });

    const userId = this.authService.getLogedInUserId();
    console.log('userId: ', userId);
    if (userId) {
      if (this.authService.getLoggedInUserIsVerified()) {
        this.userService.getUserInfo(userId).subscribe((userInfo: UserInfo) => {
          this.userInfo = userInfo;
          this.updateFormValues();
        });
        this.userService.getUserDocs(userId).subscribe((userDocs: any[]) => {
          this.userDoc = userDocs.map((doc) => ({
            ...doc,
            docImage: doc.imageBase64,
          }));
          this.updateFormValues();
        });
      } else {
        this.accountForm.patchValue({
          id: userId,
        });
      }
    }
  }

  updateFormValues() {
    if (this.userInfo && this.userDoc) {
      this.accountForm.patchValue({
        id: this.userInfo.id,
        firstName: this.userInfo.firstname,
        lastName: this.userInfo.lastname,
        dateOfBirth: this.userInfo.dateOfBirth,
        phoneNumber: this.userInfo.phoneNumber,
        profileImage: `data:image/jpeg;base64,${this.userInfo.profileImage}`,
        idFrontImage: this.userDoc[0]?.docImage,
        idBackImage: this.userDoc[1]?.docImage,
        driverLicenseFrontImage: this.userDoc[2]?.docImage,
        driverLicenseBackImage: this.userDoc[3]?.docImage,
      });

      if(this.userInfo.profileImage) {
        this.profileImageSrc = this.userInfo.profileImage;
      }
      if (this.userDoc[0]?.docImage) {
        this.idFrontsrc = this.userDoc[0]?.docImage;
      }
      if (this.userDoc[1]?.docImage) {
        this.idBacksrc = this.userDoc[1]?.docImage;
      }
      if (this.userDoc[2]?.docImage) {
        this.driverFrontsrc = this.userDoc[2]?.docImage;
      }
      if (this.userDoc[3]?.docImage) {
        this.driverBacksrc = this.userDoc[3]?.docImage;
      }
    }
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const dateOfBirth = new Date(this.accountForm.value.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      console.error('Invalid date of birth');
      this.accountForm.get('dateOfBirth')?.setErrors({ invalidDate: true });
      return;
    }

    const userInfo: UserInfoPost = {
      id: this.authService.getLogedInUserId()!,
      firstName: this.accountForm.value.firstName,
      lastName: this.accountForm.value.lastName,
      dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format date correctly
      phoneNumber: this.accountForm.value.phoneNumber,
      profileImage: this.accountForm.value.profileImage,
      idFrontImage: this.accountForm.value.idFrontImage,
      idBackImage: this.accountForm.value.idBackImage,
      driverLicenseFrontImage: this.accountForm.value.driverLicenseFrontImage,
      driverLicenseBackImage: this.accountForm.value.driverLicenseBackImage,
    };

    const formData = new FormData();
    formData.append('UserId', userInfo.id.toString());
    formData.append('PhoneNumber', userInfo.phoneNumber);
    formData.append('Firstname', userInfo.firstName);
    formData.append('Lastname', userInfo.lastName);
    formData.append('DateOfBirth', userInfo.dateOfBirth); // Use formatted date
    formData.append('ProfileImage', userInfo.profileImage);
    formData.append('IDFront', userInfo.idFrontImage);
    formData.append('IDBack', userInfo.idBackImage);
    formData.append('LicenseFront', userInfo.driverLicenseFrontImage);
    formData.append('LicenseBack', userInfo.driverLicenseBackImage);

    if (!this.authService.getLoggedInUserIsVerified()) {
      console.log('uploading user infos');
      this.userService.uploadUserInfos(userInfo.id, formData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.userService.updateUserInfo(userInfo.id, formData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  profileImage(event: any) {
    if (event.target.files && event.target.files.length) {
      this.profileImageSrc = event.target.files[0];
      this.accountForm.patchValue({
        profileImage: event.target.files[0],
      });
    }
  }

  idFront(event: any) {
    if (event.target.files && event.target.files.length) {
      this.accountForm.patchValue({
        idFrontImage: event.target.files[0],
      });
    }
  }

  idBack(event: any) {
    if (event.target.files && event.target.files.length) {
      this.accountForm.patchValue({
        idBackImage: event.target.files[0],
      });
    }
  }

  driverFront(event: any) {
    if (event.target.files && event.target.files.length) {
      this.accountForm.patchValue({
        driverLicenseFrontImage: event.target.files[0],
      });
    }
  }

  driverBack(event: any) {
    if (event.target.files && event.target.files.length) {
      this.accountForm.patchValue({
        driverLicenseBackImage: event.target.files[0],
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.accountForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  markAsTouched(controlName: string) {
    const control = this.accountForm.get(controlName);
    if (control) {
      control.markAsTouched();
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
