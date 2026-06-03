export interface LocationEntity {
    id?: string;
  name: string;
  address: string
  city: string;
  phoneNumber: string;
  latitude: number | null;
  longitude: number | null;
}