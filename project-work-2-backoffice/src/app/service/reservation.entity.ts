export interface Reservation {
  id: string;
  status: ReservationStatus;
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

export type ReservationStatus = 'in_rental' | 'completed' | 'cancelled' | 'pending';