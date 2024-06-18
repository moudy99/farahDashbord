export interface Hall {
  hallID: number;
  ownerId: string;
  price: number;
  features?: string[];
  name: string;
  description: string;
  capacity: number;
  governorateID: number;
  city: number;
  pictureUrls?: string[];
}
