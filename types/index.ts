export type RootStackParamList = {
  'auth/sign-in': undefined;
  'auth/sign-up': undefined;
  amia: undefined;
  cart: undefined;
  categories: undefined;
  community: undefined;
  'fast-selling': undefined;
  'flash-sale': undefined;
  index: undefined;
  'product/[id]': { id: string };
  recommendations: undefined;
  saved: undefined;
  search: { category?: string; query?: string };
  'sellers-promo': undefined;
};

export type ImageKey =
  | 'avatar1'
  | 'avatar2'
  | 'avatar3'
  | 'bamboo'
  | 'beauty'
  | 'brand'
  | 'carved'
  | 'chair'
  | 'design'
  | 'featured1'
  | 'featured2'
  | 'featured3'
  | 'featured4'
  | 'field'
  | 'heroRoom'
  | 'kitchen'
  | 'makers'
  | 'marketplaceBike'
  | 'marketplaceCars'
  | 'newsletter'
  | 'product1'
  | 'product2'
  | 'product3'
  | 'review1'
  | 'review2'
  | 'review3'
  | 'qr'
  | 'vehicles';

export type Product = {
  id: string;
  name: string;
  seller: string;
  categoryId: string;
  brandId: string;
  marketplaceId?: string;
  imageKey: ImageKey;
  estimatedPrice: string;
  idrPrice: string;
  rating: number;
  soldLabel: string;
  discount?: string;
  availability?: string;
  description: string;
  tags: readonly string[];
  style: 'modern' | 'traditional' | 'minimalist' | 'rustic' | 'industrial' | 'bohemian' | 'scandinavian' | 'coastal';
  mood: 'calm' | 'energetic' | 'cozy' | 'elegant' | 'playful' | 'romantic' | 'formal';
  room: 'Living Room' | 'Kitchen' | 'Garden' | 'Bathroom' | 'Bedroom';
  color: string;
  colorName: 'beige' | 'black' | 'blue' | 'brown' | 'green' | 'pink' | 'red' | 'white' | 'yellow';
  material: 'bamboo' | 'coconut-shell' | 'glass' | 'metal' | 'natural' | 'wood';
  productType: 'armchair' | 'chair' | 'cookware' | 'package' | 'table' | 'vehicle';
  priceIdr: number;
  keywords: readonly string[];
  bulkAvailable?: boolean;
  isFlashSale?: boolean;
  isFastSelling?: boolean;
  isRecommended?: boolean;
  isSellerPromo?: boolean;
};

export type Category = {
  id: string;
  label: string;
  description: string;
  subcategories: readonly string[];
  imageKey: ImageKey;
};

export type Brand = {
  id: string;
  name: string;
  description: string;
  imageKey: ImageKey;
};

export type Marketplace = {
  id: string;
  label: string;
  description: string;
  imageKey: ImageKey;
};

export type ChatMessage = {
  id: string;
  author: string;
  avatar: string;
  message: string;
  time: string;
};
