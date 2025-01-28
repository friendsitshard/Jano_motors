export interface User {
    email: string;
    password: string;
    token?: string;
}


export interface UserPswChange {
    id: number;
    oldPassword: string;
    newPassword: string;
}