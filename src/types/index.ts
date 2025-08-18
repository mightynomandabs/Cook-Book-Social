export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  cookingLevel: number;
  cookingLevelTitle: string;
  badges: Badge[];
  followers: number;
  following: number;
  posts: number;
  savedRecipes: string[];
  interests: string[];
  dietaryPreferences: string[];
  preferredLanguages: string[];
  location: string;
  isRestaurant: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: 'orange' | 'yellow' | 'green';
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  creator: User;
  image: string;
  video?: string;
  teaser: string;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  isSaved: boolean;
  isLiked: boolean;
  tags: string[];
  cuisine: string;
  dietaryTags: string[];
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  method: MethodStep[];
  nutrition: NutritionInfo;
  language: string;
  translations: Record<string, string>;
  createdAt: Date;
  views: number;
  // New properties for optimized components
  cookingTime: number;
  // Legacy properties for backward compatibility
  likes?: number;
  comments?: number;
  saves?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  price: number;
  suppliers: Supplier[];
  isAvailable: boolean;
  userHas: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  logo: string;
}

export interface MethodStep {
  id: string;
  stepNumber: number;
  description: string;
  image?: string;
  time: number;
  tips?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  video?: string;
  caption: string;
  createdAt: Date;
  views: number;
  isViewed: boolean;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  members: number;
  posts: number;
  isJoined: boolean;
  tags: string[];
  createdAt: Date;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  image: string;
  prize: string;
  deadline: Date;
  participants: number;
  isParticipating: boolean;
  rules: string[];
  submissions: ContestSubmission[];
}

export interface ContestSubmission {
  id: string;
  user: User;
  recipe: Recipe;
  submittedAt: Date;
  votes: number;
}

export interface Restaurant extends User {
  restaurantInfo: {
    name: string;
    logo: string;
    coverImage: string;
    address: string;
    coordinates: { lat: number; lng: number };
    phone: string;
    website?: string;
    cuisine: string[];
    priceRange: 'Budget' | 'Mid-range' | 'Premium';
    rating: number;
    reviews: Review[];
    featuredDishes: FeaturedDish[];
    openingHours: OpeningHours;
    deliveryAvailable: boolean;
    deliveryPartners: string[];
  };
}

export interface Review {
  id: string;
  user: User;
  rating: number;
  text: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
}

export interface FeaturedDish {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  isVegetarian: boolean;
  spiceLevel: number;
  allergens: string[];
  orderLink?: string;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ShoppingCart {
  id: string;
  items: CartItem[];
  total: number;
  supplier: Supplier;
  deliveryTime: string;
}

export interface CartItem {
  ingredient: Ingredient;
  quantity: number;
  price: number;
}

export interface PantryItem {
  id: string;
  ingredient: Ingredient;
  quantity: number;
  expiryDate?: Date;
  addedAt: Date;
}

export interface MealPlan {
  id: string;
  weekStart: Date;
  days: MealPlanDay[];
  shoppingList: Ingredient[];
}

export interface MealPlanDay {
  date: Date;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  };
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'contest' | 'reminder';
  title: string;
  message: string;
  user?: User;
  recipe?: Recipe;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}
