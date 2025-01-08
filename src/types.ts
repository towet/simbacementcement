export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'steel' | 'tanks' | 'roofing' | 'construction';
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}