export interface Car {
  carID: number;
  ownerId: string;
  brand: string;
  year: number;
  price: number;
  description: string;
  governorateID: number;
  city: number;
  pictureUrls?: string[];
}
