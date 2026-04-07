export default interface ItemType {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  spec: {
    cpu: string;
    ram: string;
    storage: string;
    display: string;
    battery: string;
  };
}
