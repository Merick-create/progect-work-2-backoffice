
import {BikeTypology} from "../../enity/bike-typologies/bike-typologies-entity";
import {BikeSizesEntity} from "../../enity/bike-sizes/bike-sizes-etity";


export interface Bike {
  id?: string;
  bikeSize: BikeSizesEntity | string;
  bikeTypology: BikeTypology | string;
  location: Location | string;
  available: boolean;
  code: string;
}