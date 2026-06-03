export interface Reservation {
  pickupDate: Date;
  pickupTime: string;
  pickupLocation: string;
  returnDateTime: Date;
  bikes: string[];
  accessories?: string[];
  insuranceCoverage?: string;
}