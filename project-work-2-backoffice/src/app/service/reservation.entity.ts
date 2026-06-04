export interface Reservation {
  id?: string;
  status?: string;
  pickupDate: Date;
  pickupTime: string;
  pickupLocation: string;
  returnDateTime: Date;
  bikes: string[];
  accessories?: string[];
  insuranceCoverage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}