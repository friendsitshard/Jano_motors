import { Car } from "./car";

export interface BookingGet {
    id: number;
    userId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
    totalPrice: Float32Array;
    status: string;
}

export interface Booking {
    id: number;
    userId: number;
    car: Car;
    startDate: Date;
    endDate: Date;
    totalPrice: Float32Array;
    status: string;
}

export interface BookingPost {
    userId: number;
    carId: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
}