export interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    transmission: string;
    passengers: number;
    mainImage: string;
    dailyPrice: number;
}

export interface CarPost {
    make: string;
    model: string;
    year: number;
    transmission: string;
    passengers: number;
    dayliPrice: number;
    horsePower: number;
    engineTipe: string;
    driverPrice?: number;
    airportPrice?: number;
    mainImage: string;
}