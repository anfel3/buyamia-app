import type { Brand, Category, ChatMessage, Marketplace, Product } from '../types';

export const appMetadata = {
  environment: 'Demo mobile local',
  name: 'Buyamia',
} as const;

export const categories: Category[] = [
  {
    id: 'art',
    label: 'Art',
    description: 'Sculptures, pottery, paintings, glass art and functional art.',
    subcategories: ['Sculptures', 'Pottery', 'Antique', 'Metal Art', 'Glass Art', 'Print', 'Drawings & Paintings', '3D Printing', 'Photography & Prints'],
    imageKey: 'design',
  },
  {
    id: 'beauty-care',
    label: 'Beauty & Care',
    description: 'Carefully sourced beauty and wellness essentials.',
    subcategories: ['Skin care', 'Hair care', 'Wellness', 'Bath'],
    imageKey: 'featured4',
  },
  {
    id: 'furniture',
    label: 'Furniture',
    description: 'Indonesian furniture, bamboo pieces and premium seating.',
    subcategories: ['Chairs', 'Tables', 'Storage', 'Outdoor', 'Bamboo furniture'],
    imageKey: 'featured1',
  },
  {
    id: 'home-decoration',
    label: 'Home Decoration',
    description: 'Objects, textiles and accents for warmer rooms.',
    subcategories: ['Vases', 'Lighting', 'Mirrors', 'Decorative objects'],
    imageKey: 'heroRoom',
  },
  {
    id: 'food-beverage',
    label: 'Food & Beverage',
    description: 'Pantry, coffee, tea and specialty sourcing.',
    subcategories: ['Coffee', 'Tea', 'Pantry', 'Gifts'],
    imageKey: 'kitchen',
  },
  {
    id: 'jewelry',
    label: 'Jewelry & Accessories',
    description: 'Small-batch accessories and premium gifts.',
    subcategories: ['Jewelry', 'Bags', 'Scarves', 'Accessories'],
    imageKey: 'carved',
  },
];

export const brands: Brand[] = [
  {
    id: 'artisan-craft',
    name: 'Artisan Craft',
    description: 'Enterprise capable makers producing statement pieces at boutique or bulk scale.',
    imageKey: 'brand',
  },
  {
    id: 'jalin-mimpi',
    name: 'Jalin Mimpi',
    description: 'Impact partner focused on responsible materials and artisan support.',
    imageKey: 'review2',
  },
  {
    id: 'terra-water',
    name: 'Terra Water Filter',
    description: 'Partner brand supporting clean water initiatives through every order.',
    imageKey: 'featured4',
  },
  {
    id: 'seller-name',
    name: 'Seller Name',
    description: 'A featured Buyamia supplier with furniture, decor and packaging capacity.',
    imageKey: 'featured1',
  },
];

export const marketplaces: Marketplace[] = [
  {
    id: 'vehicles',
    label: 'Vehicles',
    description: 'Premium vehicles and sourcing requests for business buyers.',
    imageKey: 'marketplaceCars',
  },
  {
    id: 'property',
    label: 'Property',
    description: 'Residential and hospitality procurement opportunities.',
    imageKey: 'heroRoom',
  },
  {
    id: 'florals',
    label: 'Florals',
    description: 'Flowers, arrangements and event-ready sourcing.',
    imageKey: 'beauty',
  },
];

export const products: Product[] = [
  {
    id: 'eco-friendly-bamboo-table',
    name: 'Eco Friendly Bamboo side table',
    seller: 'Ty a little',
    categoryId: 'furniture',
    brandId: 'artisan-craft',
    imageKey: 'bamboo',
    estimatedPrice: 'Estimated Price',
    idrPrice: 'IDR 1,000,000',
    rating: 5,
    soldLabel: '1.8M Sold',
    discount: '-50%',
    availability: 'In stock',
    description: 'A refined bamboo side table for boutique hotels, villas and warm living rooms.',
    tags: ['Bamboo', 'Furniture', 'Eco friendly'],
    productType: 'table',
    material: 'bamboo',
    style: 'scandinavian',
    mood: 'calm',
    room: 'Living Room',
    color: '#C8FF24',
    colorName: 'green',
    priceIdr: 1000000,
    keywords: ['bamboo', 'natural', 'eco friendly', 'side table', 'living room', 'hotel'],
    bulkAvailable: true,
    isFlashSale: true,
    isRecommended: true,
  },
  {
    id: 'coconut-shell-wood-kitchen-chair',
    name: 'Eco Friendly Coconut Shell Wood Kitchen Chair',
    seller: 'Ty a little',
    categoryId: 'furniture',
    brandId: 'seller-name',
    imageKey: 'featured1',
    estimatedPrice: 'Estimated Price',
    idrPrice: 'IDR 1,000,000',
    rating: 5,
    soldLabel: '6.3k Sold',
    discount: '-70%',
    availability: 'Living Room',
    description: 'Coconut shell wood chair with a clean silhouette for curated packages.',
    tags: ['Chair', 'Wood', 'Best seller'],
    productType: 'chair',
    material: 'wood',
    style: 'traditional',
    mood: 'elegant',
    room: 'Living Room',
    color: '#6F4D35',
    colorName: 'brown',
    priceIdr: 1000000,
    keywords: ['chair', 'wood', 'coconut-shell', 'natural', 'living room', 'brown'],
    bulkAvailable: true,
    isFastSelling: true,
    isRecommended: true,
  },
  {
    id: 'hand-carved-armchair',
    name: 'Hand carved armchair',
    seller: 'Ty a little',
    categoryId: 'furniture',
    brandId: 'artisan-craft',
    marketplaceId: 'property',
    imageKey: 'carved',
    estimatedPrice: 'Estimated Price',
    idrPrice: 'IDR 1,000,000',
    rating: 5,
    soldLabel: '17k Sold',
    availability: 'Contract ready',
    description: 'Hand carved armchair made for high-touch hospitality sourcing.',
    tags: ['Armchair', 'Hotel', 'Contract'],
    productType: 'armchair',
    material: 'wood',
    style: 'rustic',
    mood: 'formal',
    room: 'Living Room',
    color: '#EFEEDC',
    colorName: 'beige',
    priceIdr: 1000000,
    keywords: ['armchair', 'chair', 'wood', 'carved', 'hotel', 'contract', 'living room'],
    bulkAvailable: true,
    isSellerPromo: true,
  },
  {
    id: 'eco-friendly-bamboo-skin-table',
    name: 'Eco Friendly Bamboo skin table',
    seller: 'Ty a little',
    categoryId: 'home-decoration',
    brandId: 'jalin-mimpi',
    imageKey: 'featured2',
    estimatedPrice: 'Estimated Price',
    idrPrice: 'IDR 1,000,000',
    rating: 5,
    soldLabel: '5.3k Sold',
    discount: '-30%',
    availability: 'Quick shipping',
    description: 'A lighter bamboo accent table for decor-led rooms and bundles.',
    tags: ['Bamboo', 'Accent', 'Decor'],
    productType: 'table',
    material: 'bamboo',
    style: 'bohemian',
    mood: 'cozy',
    room: 'Bedroom',
    color: '#D7C7A3',
    colorName: 'beige',
    priceIdr: 1000000,
    keywords: ['bamboo', 'natural', 'eco friendly', 'accent table', 'decor', 'bedroom'],
    bulkAvailable: true,
    isFlashSale: true,
  },
  {
    id: 'eco-friendly-cookware-set',
    name: 'Eco Friendly Cookware set',
    seller: 'Ty a little',
    categoryId: 'food-beverage',
    brandId: 'terra-water',
    imageKey: 'featured4',
    estimatedPrice: 'Estimated Price',
    idrPrice: 'IDR 1,000,000',
    rating: 5,
    soldLabel: '5.7k Sold',
    availability: 'Kitchen',
    description: 'Sourced cookware set for premium appliances edits and kitchen packages.',
    tags: ['Kitchen', 'Appliances', 'Bundle'],
    productType: 'cookware',
    material: 'metal',
    style: 'modern',
    mood: 'calm',
    room: 'Kitchen',
    color: '#FFFFFF',
    colorName: 'white',
    priceIdr: 1000000,
    keywords: ['cookware', 'kitchen', 'appliances', 'set', 'bundle'],
    bulkAvailable: false,
    isSellerPromo: true,
  },
  {
    id: 'beauty-care-package',
    name: 'Beauty & Care discovery package',
    seller: 'Buyamia Picks',
    categoryId: 'beauty-care',
    brandId: 'seller-name',
    imageKey: 'product2',
    estimatedPrice: 'Estimated Price',
    idrPrice: 'IDR 780,000',
    rating: 5,
    soldLabel: '9.2k Sold',
    discount: '-20%',
    availability: 'Fast selling',
    description: 'A curated beauty package for gifts, hotels and monthly care programs.',
    tags: ['Beauty', 'Package', 'Fast selling'],
    productType: 'package',
    material: 'natural',
    style: 'modern',
    mood: 'playful',
    room: 'Bathroom',
    color: '#F3D7D0',
    colorName: 'pink',
    priceIdr: 780000,
    keywords: ['beauty', 'care', 'package', 'hotel', 'gift'],
    bulkAvailable: true,
    isFastSelling: true,
  },
  {
    id: 'premium-vehicle-sourcing',
    name: 'Hand carved armchair',
    seller: 'Marketplace Network',
    categoryId: 'furniture',
    brandId: 'artisan-craft',
    marketplaceId: 'vehicles',
    imageKey: 'vehicles',
    estimatedPrice: 'Affiliate Price',
    idrPrice: 'IDR 1,000,000',
    rating: 5,
    soldLabel: 'B2B request',
    availability: 'Vehicles',
    description: 'Vehicle marketplace placeholder paired with sourcing inquiry flow.',
    tags: ['Vehicles', 'Marketplace', 'Sourcing'],
    productType: 'vehicle',
    material: 'metal',
    style: 'industrial',
    mood: 'energetic',
    room: 'Garden',
    color: '#111111',
    colorName: 'black',
    priceIdr: 1000000,
    keywords: ['vehicles', 'marketplace', 'sourcing', 'fleet'],
    bulkAvailable: false,
    isSellerPromo: true,
  },
];

export const communityMessages: ChatMessage[] = [
  {
    id: 'community-1',
    author: 'User Name',
    avatar: 'N',
    message: 'Temporibus ut pariatur dignissimos non vel corporis ea. Excepturi in voluptatem accusamus numquam quam et vel consequatur earum.',
    time: '09:12',
  },
  {
    id: 'community-2',
    author: 'User Name',
    avatar: 'D',
    message: 'Dignissimos sunt vero distinctio hic aut consectetur velit. Et quia ut non quo quod sit corrupti aut.',
    time: '09:18',
  },
  {
    id: 'community-3',
    author: 'User Name',
    avatar: 'S',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Community chat will connect to auth later.',
    time: '09:26',
  },
];

export const styleOptions = ['modern', 'traditional', 'minimalist', 'rustic', 'industrial', 'bohemian', 'scandinavian', 'coastal'] as const;
export const moodOptions = ['calm', 'energetic', 'cozy', 'elegant', 'playful', 'romantic', 'formal'] as const;
export const rooms = ['Living Room', 'Kitchen', 'Garden', 'Bathroom', 'Bedroom'] as const;
export const colorSwatches = ['#FFFFFF', '#000000', '#D9D6C3', '#C8FF24', '#6F4D35', '#B24747', '#63C5DA', '#2F6BFF', '#E9EA23', '#F4B740'];

export const getCategoryById = (categoryId: string) =>
  categories.find((category) => category.id === categoryId);

export const getBrandById = (brandId: string) => brands.find((brand) => brand.id === brandId);

export const getMarketplaceById = (marketplaceId: string) =>
  marketplaces.find((marketplace) => marketplace.id === marketplaceId);

export const getProductById = (productId: string) =>
  products.find((product) => product.id === productId);

export type ProductFilters = {
  category?: string;
  colors?: string[];
  maxPrice?: number;
  minPrice?: number;
  moods?: string[];
  query?: string;
  room?: string;
  styles?: string[];
};

const priceToNumber = (price: string) => Number(price.replace(/[^0-9]/g, '')) || 0;

export const filterProducts = ({
  category,
  colors,
  maxPrice,
  minPrice,
  moods,
  query,
  room,
  styles,
}: ProductFilters = {}) => {
  const normalizedQuery = query?.trim().toLowerCase();

  return products.filter((product) => {
    const productPrice = priceToNumber(product.idrPrice);
    const matchesQuery = normalizedQuery
      ? [product.name, product.seller, product.description, product.availability, ...product.tags]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery))
      : true;

    return (
      matchesQuery &&
      (!category || product.categoryId === category) &&
      (!room || product.room === room) &&
      (!styles?.length || styles.includes(product.style)) &&
      (!moods?.length || moods.includes(product.mood)) &&
      (!colors?.length || colors.includes(product.color)) &&
      (minPrice === undefined || productPrice >= minPrice) &&
      (maxPrice === undefined || productPrice <= maxPrice)
    );
  });
};
