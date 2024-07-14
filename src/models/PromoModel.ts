export interface PromoModel {
  _id: string;
  title: string;
  description: string;
  code: string;
  percent: number;
  start?: number;
  end?: number;
}
