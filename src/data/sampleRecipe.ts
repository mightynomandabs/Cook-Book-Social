import { Recipe, User, Ingredient, MethodStep, NutritionInfo, Supplier, Story } from '../types';

export const sampleUser: User = {
  id: '1',
  name: 'Chef Priya',
  email: 'priya@cookbook.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  bio: 'Passionate home chef from Mumbai. Love experimenting with fusion recipes!',
  cookingLevel: 85,
  cookingLevelTitle: 'Master Chef',
  badges: [
    { id: '1', name: 'Master Baker', icon: '🥖', color: 'orange', description: 'Expert in bread making' },
    { id: '2', name: 'Street Food Star', icon: '🌶️', color: 'yellow', description: 'Street food specialist' },
    { id: '3', name: 'Healthy Eats', icon: '🥗', color: 'green', description: 'Nutrition focused cooking' }
  ],
  followers: 15420,
  following: 892,
  posts: 156,
  savedRecipes: ['1', '2', '3'],
  interests: ['South Indian', 'Fusion', 'Baking'],
  dietaryPreferences: ['Vegetarian'],
  preferredLanguages: ['English', 'Hindi', 'Marathi'],
  location: 'Mumbai, Maharashtra',
  isRestaurant: false
};

export const sampleSuppliers: Supplier[] = [
  { id: '1', name: 'Blinkit', price: 0, deliveryTime: '10 minutes', logo: '🛒' },
  { id: '2', name: 'Swiggy Instamart', price: 0, deliveryTime: '15 minutes', logo: '🛒' },
  { id: '3', name: 'Zepto', price: 0, deliveryTime: '10 minutes', logo: '🛒' }
];

export const sampleIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Basmati Rice',
    amount: 2,
    unit: 'cups',
    price: 120,
    suppliers: sampleSuppliers,
    isAvailable: true,
    userHas: false
  },
  {
    id: '2',
    name: 'Onions',
    amount: 2,
    unit: 'medium',
    price: 40,
    suppliers: sampleSuppliers,
    isAvailable: true,
    userHas: true
  },
  {
    id: '3',
    name: 'Tomatoes',
    amount: 3,
    unit: 'medium',
    price: 60,
    suppliers: sampleSuppliers,
    isAvailable: true,
    userHas: false
  },
  {
    id: '4',
    name: 'Ginger',
    amount: 1,
    unit: 'inch',
    price: 20,
    suppliers: sampleSuppliers,
    isAvailable: true,
    userHas: false
  },
  {
    id: '5',
    name: 'Garlic',
    amount: 4,
    unit: 'cloves',
    price: 15,
    suppliers: sampleSuppliers,
    isAvailable: true,
    userHas: true
  },
  {
    id: '6',
    name: 'Garam Masala',
    amount: 1,
    unit: 'tsp',
    price: 25,
    suppliers: sampleSuppliers,
    isAvailable: true,
    userHas: false
  }
];

export const sampleMethodSteps: MethodStep[] = [
  {
    id: '1',
    stepNumber: 1,
    description: 'Wash and soak basmati rice in water for 30 minutes. Drain and set aside.',
    time: 30,
    tips: 'Soaking rice makes it fluffier and cooks faster'
  },
  {
    id: '2',
    stepNumber: 2,
    description: 'Heat oil in a large pan. Add cumin seeds and let them splutter.',
    time: 2,
    tips: 'Make sure oil is hot before adding seeds'
  },
  {
    id: '3',
    stepNumber: 3,
    description: 'Add finely chopped onions and sauté until golden brown.',
    time: 8,
    tips: 'Stir occasionally to prevent burning'
  },
  {
    id: '4',
    stepNumber: 4,
    description: 'Add ginger-garlic paste and sauté for 2 minutes until raw smell disappears.',
    time: 2,
    tips: 'Don\'t rush this step - it\'s crucial for flavor'
  },
  {
    id: '5',
    stepNumber: 5,
    description: 'Add chopped tomatoes and cook until they turn mushy.',
    time: 5,
    tips: 'Add a pinch of salt to speed up cooking'
  },
  {
    id: '6',
    stepNumber: 6,
    description: 'Add spices and cook for 1 minute to release their flavors.',
    time: 1,
    tips: 'Keep stirring to prevent spices from burning'
  },
  {
    id: '7',
    stepNumber: 7,
    description: 'Add soaked rice and gently mix with the masala.',
    time: 2,
    tips: 'Be gentle to avoid breaking the rice grains'
  },
  {
    id: '8',
    stepNumber: 8,
    description: 'Add water, salt to taste, and bring to a boil. Then simmer covered for 15-20 minutes.',
    time: 20,
    tips: 'Don\'t peek too often - let the steam do its work'
  }
];

export const sampleNutrition: NutritionInfo = {
  calories: 320,
  protein: 6.5,
  carbs: 58.2,
  fat: 8.1,
  fiber: 3.2,
  sugar: 2.8
};

export const sampleRecipe: Recipe = {
  id: '1',
  title: 'Perfect Basmati Rice with Aromatic Spices',
  description: 'A fragrant and fluffy basmati rice dish infused with traditional Indian spices. Perfect as a side dish or base for biryanis.',
  creator: sampleUser,
  image: 'https://images.unsplash.com/photo-1563379091339-3b21d0c1d146?w=600&h=400&fit=crop',
  video: 'https://sample-video-url.mp4',
  teaser: 'Learn the secret to making restaurant-style fluffy basmati rice at home!',
  likes_count: 1247,
  comments_count: 89,
  saves_count: 456,
  // legacy fields maintained for any old code paths
  likes: 1247,
  comments: 89,
  saves: 456,
  isSaved: false,
  isLiked: false,
  tags: ['Rice', 'Indian', 'Vegetarian', 'Side Dish', 'Spices'],
  cuisine: 'Indian',
  dietaryTags: ['Vegetarian', 'Vegan'],
  prepTime: 35,
  cookTime: 25,
  totalTime: 60,
  servings: 4,
  difficulty: 'Easy',
  ingredients: sampleIngredients,
  method: sampleMethodSteps,
  nutrition: sampleNutrition,
  language: 'English',
  translations: {
    'Hindi': 'सुगंधित बासमती चावल',
    'Marathi': 'सुगंधी बासमती भात'
  },
  createdAt: new Date('2024-01-15'),
  views: 8920,
  cookingTime: 60
};

export const sampleStories: Story[] = [
  {
    id: '1',
    user: sampleUser,
    image: 'https://images.unsplash.com/photo-1563379091339-3b21d0c1d146?w=300&h=400&fit=crop',
    caption: 'Today\'s special: Perfect Basmati Rice! 🌾✨',
    createdAt: new Date(),
    views: 1200,
    isViewed: false
  },
  {
    id: '2',
    user: {
      ...sampleUser,
      id: '2',
      name: 'Chef Raj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=400&fit=crop',
    caption: 'Homemade Pizza Night! 🍕',
    createdAt: new Date(),
    views: 890,
    isViewed: false
  },
  {
    id: '3',
    user: {
      ...sampleUser,
      id: '3',
      name: 'Chef Meera',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=400&fit=crop',
    caption: 'Fresh Garden Salad 🌱',
    createdAt: new Date(),
    views: 650,
    isViewed: false
  }
];

export const sampleRecipes: Recipe[] = [
  sampleRecipe,
  {
    ...sampleRecipe,
    id: '2',
    title: 'Mumbai Street Style Vada Pav',
    creator: {
      ...sampleUser,
      id: '2',
      name: 'Chef Raj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    tags: ['Street Food', 'Mumbai', 'Vegetarian', 'Snack'],
    cuisine: 'Indian',
    likes_count: 2156,
    comments_count: 156,
    saves_count: 789,
    likes: 2156,
    comments: 156,
    saves: 789
  },
  {
    ...sampleRecipe,
    id: '3',
    title: 'Homemade Margherita Pizza',
    creator: {
      ...sampleUser,
      id: '3',
      name: 'Chef Meera',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    tags: ['Pizza', 'Italian', 'Vegetarian', 'Baking'],
    cuisine: 'Italian',
    likes_count: 1890,
    comments_count: 134,
    saves_count: 567,
    likes: 1890,
    comments: 134,
    saves: 567
  }
];
