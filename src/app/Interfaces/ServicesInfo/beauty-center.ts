import { ServiceForBeautyCenter } from './service-for-beauty-center';

export interface BeautyCenter {
  beautyCenterId: number;
  name: string;
  description: string;
  gove: number;
  ownerId: string;
  city: number;
  imageUrls?: string[];
  services?: ServiceForBeautyCenter[];
}
