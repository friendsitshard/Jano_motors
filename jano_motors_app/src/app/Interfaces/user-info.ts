import { UserDocPost } from "./user-doc";
export interface UserInfoPost {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    profileImage: string;
    idFrontImage: File;
    idBackImage: File;
    driverLicenseFrontImage: File;
    driverLicenseBackImage: File;
}

export interface UserInfo {
    id: number;
    firstname: string;
    lastname: string;
    dateOfBirth: Date;
    phoneNumber: string;
    profileImage: string;
}
