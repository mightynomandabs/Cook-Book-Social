export interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  creator: {
    name: string;
    avatar?: string;
  };
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  likes: number;
  views: number;
}

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Butter Chicken - The Ultimate Indian Classic',
    description: 'Creamy, rich, and perfectly spiced butter chicken that will transport you straight to India. This recipe features tender chicken in a luscious tomato-based gravy.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    tags: ['Indian', 'Chicken', 'Creamy', 'Spicy'],
    creator: {
      name: 'Chef Priya',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    cookingTime: 45,
    servings: 4,
    difficulty: 'Medium',
    likes: 1247,
    views: 8923
  },
  {
    id: '2',
    title: 'Homemade Pizza Margherita',
    description: 'Learn to make authentic Italian pizza from scratch with this classic Margherita recipe. Perfect crispy crust, fresh mozzarella, and basil.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
    tags: ['Italian', 'Pizza', 'Vegetarian', 'Homemade'],
    creator: {
      name: 'Marco Rossi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    cookingTime: 60,
    servings: 2,
    difficulty: 'Medium',
    likes: 892,
    views: 6541
  },
  {
    id: '3',
    title: 'Spicy Thai Green Curry',
    description: 'Aromatic and flavorful Thai green curry with coconut milk, fresh vegetables, and your choice of protein. Perfect balance of heat and creaminess.',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
    tags: ['Thai', 'Curry', 'Spicy', 'Coconut'],
    creator: {
      name: 'Somchai Thai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    cookingTime: 35,
    servings: 6,
    difficulty: 'Easy',
    likes: 1567,
    views: 11234
  },
  {
    id: '4',
    title: 'Classic French Coq au Vin',
    description: 'Traditional French braised chicken in red wine with mushrooms, pearl onions, and bacon. A sophisticated dish perfect for special occasions.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    tags: ['French', 'Chicken', 'Wine', 'Braised'],
    creator: {
      name: 'Chef Pierre',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    cookingTime: 120,
    servings: 4,
    difficulty: 'Hard',
    likes: 723,
    views: 5432
  },
  {
    id: '5',
    title: 'Mexican Street Tacos',
    description: 'Authentic Mexican street tacos with marinated carne asada, fresh cilantro, onions, and lime. Served on warm corn tortillas.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
    tags: ['Mexican', 'Tacos', 'Beef', 'Street Food'],
    creator: {
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    cookingTime: 30,
    servings: 8,
    difficulty: 'Easy',
    likes: 2341,
    views: 15678
  },
  {
    id: '6',
    title: 'Japanese Ramen Bowl',
    description: 'Rich and flavorful ramen with perfectly cooked noodles, tender chashu pork, soft-boiled egg, and aromatic broth.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    tags: ['Japanese', 'Ramen', 'Noodles', 'Pork'],
    creator: {
      name: 'Takashi Yamamoto',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    },
    cookingTime: 90,
    servings: 2,
    difficulty: 'Hard',
    likes: 1892,
    views: 13456
  },
  {
    id: '7',
    title: 'Mediterranean Quinoa Bowl',
    description: 'Healthy and nutritious quinoa bowl with roasted vegetables, feta cheese, olives, and lemon herb dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    tags: ['Mediterranean', 'Quinoa', 'Vegetarian', 'Healthy'],
    creator: {
      name: 'Elena Costa',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    },
    cookingTime: 25,
    servings: 4,
    difficulty: 'Easy',
    likes: 945,
    views: 6789
  },
  {
    id: '8',
    title: 'Chinese Kung Pao Chicken',
    description: 'Spicy and tangy Kung Pao chicken with peanuts, vegetables, and the perfect balance of sweet and sour flavors.',
    image: 'https://images.unsplash.com/photo-1563379091339-3b21d0c8b4e8?w=800',
    tags: ['Chinese', 'Chicken', 'Spicy', 'Stir Fry'],
    creator: {
      name: 'Li Wei',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    cookingTime: 40,
    servings: 4,
    difficulty: 'Medium',
    likes: 1345,
    views: 9876
  }
];
