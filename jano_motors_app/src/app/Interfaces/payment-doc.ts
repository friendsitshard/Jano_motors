export interface PaymentDoc{
    id: number;
    bookingId: number;
    invoice?: string;
    check?: string;
}