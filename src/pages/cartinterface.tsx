export interface CardItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number; // for cart items
  image?: string;
  cloudinaryPublicId?: string;
  category?: string;
  vendorId?: string;
  status?: 'approved' | 'pending' | 'rejected'; // optional for cart
}
