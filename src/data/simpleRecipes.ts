export interface SimpleRecipe {
  id: string;
  title: string;
  image: string;
  creator: string;
  ingredients: string[];
  method: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
}

export const simpleRecipes: SimpleRecipe[] = [
  {
    id: '1',
    title: 'Butter Chicken',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    creator: 'Chef Priya',
    difficulty: 'Medium',
    time: '45 mins',
    ingredients: [
      '500g chicken breast',
      '200ml yogurt',
      '2 tsp garam masala',
      '400ml tomato puree',
      '200ml heavy cream',
      '50g butter'
    ],
    method: [
      'Marinate chicken in yogurt and spices for 2 hours',
      'Grill chicken until charred and cooked through',
      'Prepare tomato-based gravy with spices',
      'Add grilled chicken and cream to gravy',
      'Simmer for 10 minutes and finish with butter'
    ]
  },
  {
    id: '2',
    title: 'Homemade Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
    creator: 'Marco Rossi',
    difficulty: 'Medium',
    time: '60 mins',
    ingredients: [
      '300g all-purpose flour',
      '200g fresh mozzarella',
      '20g fresh basil',
      '150ml tomato sauce',
      '30ml olive oil'
    ],
    method: [
      'Prepare pizza dough and let it rise for 1 hour',
      'Roll out dough and add tomato sauce',
      'Add fresh mozzarella and basil',
      'Bake at 450°F for 12-15 minutes until crispy'
    ]
  },
  {
    id: '3',
    title: 'Thai Green Curry',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
    creator: 'Somchai Thai',
    difficulty: 'Easy',
    time: '35 mins',
    ingredients: [
      '3 tbsp green curry paste',
      '400ml coconut milk',
      '300g mixed vegetables',
      '2 tbsp fish sauce',
      '1 tbsp palm sugar'
    ],
    method: [
      'Fry green curry paste in oil until fragrant',
      'Add coconut milk and bring to simmer',
      'Add vegetables and cook until tender',
      'Season with fish sauce and palm sugar',
      'Serve hot with steamed rice'
    ]
  },
  {
    id: '4',
    title: 'French Croissants',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f40388010?w=800',
    creator: 'Marie Dubois',
    difficulty: 'Hard',
    time: '70 mins',
    ingredients: [
      '500g all-purpose flour',
      '300g butter',
      '7g active dry yeast',
      '250ml milk',
      '50g sugar'
    ],
    method: [
      'Prepare dough and let it rise for 1 hour',
      'Roll out dough and fold in butter layers',
      'Chill and repeat folding process 3 times',
      'Shape into croissants and let rise',
      'Bake at 400°F for 15-20 minutes'
    ]
  },
  {
    id: '5',
    title: 'Mexican Street Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    creator: 'Carlos Mendoza',
    difficulty: 'Easy',
    time: '40 mins',
    ingredients: [
      '500g beef flank steak',
      '12 corn tortillas',
      '50g fresh cilantro',
      '1 white onion',
      '3 limes'
    ],
    method: [
      'Marinate beef with lime, garlic, and spices',
      'Grill beef to medium-rare and slice thinly',
      'Warm corn tortillas on griddle',
      'Assemble tacos with beef, onion, and cilantro',
      'Serve with lime wedges and salsa'
    ]
  }
];
