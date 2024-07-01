export interface ProductModel {
  _id: string;
  title: string;
  price: number;
  description: string;
  imageURL: string;
  rate: any;
  sizes: string[];
  likedBys: string[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
