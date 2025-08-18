import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, X, Mic, MicOff, Save } from 'lucide-react';

interface SmartRecipeForm {
  title: string;

  difficulty: 'Easy' | 'Medium' | 'Hard';

  category: string;

  ingredients: string[];
  method: string[];
  servings: number;
  cuisine: string;
  prepTime: string;
  cookTime: string;
}

interface SimpleRecipeCreateProps {
  onBackToFeed: () => void;
}

const SimpleRecipeCreate: React.FC<SimpleRecipeCreateProps> = ({ onBackToFeed }) => {
  const [form, setForm] = useState<SmartRecipeForm>({
    title: '',

    difficulty: 'Easy',

    category: '',

    ingredients: [],
    method: [],
    servings: 4,
    cuisine: '',
    prepTime: '15 min',
    cookTime: '15 min'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentVoiceField, setCurrentVoiceField] = useState<string | null>(null);

  const [activeStep, setActiveStep] = useState(1);

  // Predefined options for smart selection
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Appetizer', 'Soup', 'Salad', 'Main Course', 'Side Dish'];
  const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'French', 'Mediterranean', 'American', 'Japanese', 'Korean', 'Middle Eastern', 'Greek', 'Spanish', 'Vietnamese'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const prepTimeOptions = ['5 min', '10 min', '15 min', '20 min', '30 min', '45 min', '1 hour'];
  const cookTimeOptions = ['10 min', '15 min', '20 min', '30 min', '45 min', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3+ hours'];
  const servingsOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];

  // Smart ingredient suggestions based on category
  const getIngredientSuggestions = (category: string) => {
    const suggestions: { [key: string]: string[] } = {
      'Breakfast': ['Eggs', 'Milk', 'Bread', 'Butter', 'Cheese', 'Bacon', 'Sausage', 'Oats', 'Yogurt', 'Honey', 'Berries', 'Banana'],
      'Lunch': ['Chicken', 'Rice', 'Vegetables', 'Olive Oil', 'Garlic', 'Onion', 'Tomato', 'Lettuce', 'Cucumber', 'Avocado', 'Lemon', 'Herbs'],
      'Dinner': ['Beef', 'Fish', 'Pasta', 'Potato', 'Carrot', 'Broccoli', 'Spinach', 'Mushroom', 'Bell Pepper', 'Zucchini', 'Corn', 'Peas'],
      'Dessert': ['Flour', 'Sugar', 'Eggs', 'Butter', 'Vanilla', 'Chocolate', 'Cream', 'Milk', 'Strawberries', 'Blueberries', 'Nuts', 'Honey'],
      'Indian': ['Ginger', 'Turmeric', 'Cumin', 'Coriander', 'Cardamom', 'Cinnamon', 'Cloves', 'Mustard Seeds', 'Fenugreek', 'Asafoetida', 'Garam Masala', 'Red Chili Powder'],
      'Italian': ['Basil', 'Oregano', 'Thyme', 'Rosemary', 'Parmesan', 'Mozzarella', 'Ricotta', 'Prosciutto', 'Olives', 'Capers', 'Balsamic Vinegar', 'Extra Virgin Olive Oil'],
      'Chinese': ['Soy Sauce', 'Ginger', 'Garlic', 'Sesame Oil', 'Rice Vinegar', 'Oyster Sauce', 'Hoisin Sauce', 'Five Spice', 'Star Anise', 'Bok Choy', 'Water Chestnuts', 'Bamboo Shoots']
    };
    return suggestions[category] || [];
  };

  // Smart method step suggestions
  const getMethodSuggestions = (category: string) => {
    const suggestions: { [key: string]: string[] } = {
      'Breakfast': ['Heat a non-stick pan over medium heat', 'Crack eggs into a bowl and whisk', 'Add butter to the pan and let it melt', 'Pour in the egg mixture', 'Cook until eggs are set'],
      'Dinner': ['Preheat oven to 350°F (175°C)', 'Season meat with salt and pepper', 'Heat oil in a large skillet', 'Sear meat on all sides until browned', 'Transfer to oven and bake until done'],
      'Dessert': ['Preheat oven to 375°F (190°C)', 'Cream butter and sugar until fluffy', 'Add eggs one at a time', 'Mix in dry ingredients gradually', 'Bake until golden brown']
    };
    return suggestions[category] || [];
  };

  // Voice recognition setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentVoiceField(null);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setCurrentVoiceField(null);
      };
    }
  }, []);

  const startVoiceInput = (fieldName: string) => {
    if (recognitionRef.current) {
      setCurrentVoiceField(fieldName);
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
    }
  };



  const handleVoiceInput = (transcript: string) => {
    if (!currentVoiceField) return;

    setForm(prev => ({
      ...prev,
      [currentVoiceField]: transcript
    }));

    // Auto-advance to next field for better UX
    setTimeout(() => {
      const fields = ['title', 'category', 'cuisine'];
      const currentIndex = fields.indexOf(currentVoiceField);
      if (currentIndex < fields.length - 1) {
        setCurrentVoiceField(fields[currentIndex + 1]);
        startVoiceInput(fields[currentIndex + 1]);
      }
    }, 1000);
  };

  // Smart form helpers
  const addSmartIngredient = (ingredient: string) => {
    if (!form.ingredients.includes(ingredient)) {
      setForm(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient]
      }));
    }
  };

  const addSmartMethodStep = (step: string) => {
    setForm(prev => ({
      ...prev,
      method: [...prev.method, step]
    }));
  };

  const removeIngredient = (index: number) => {
    setForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const removeMethodStep = (index: number) => {
    setForm(prev => ({
      ...prev,
      method: prev.method.filter((_, i) => i !== index)
    }));
  };

  const updateMethodStep = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      method: prev.method.map((step, i) => i === index ? value : step)
    }));
  };

  const addCustomIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addCustomMethodStep = () => {
    setForm(prev => ({
      ...prev,
      method: [...prev.method, '']
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Recipe created successfully! 🎉');
    setIsSubmitting(false);
    onBackToFeed();
  };

  const isFormValid = form.title && form.category && form.ingredients.length > 0 && form.method.length > 0;

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={onBackToFeed}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Feed</span>
          </button>
          

        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600">Step {activeStep} of 4</span>
            <span className="text-xs sm:text-sm text-slate-500">{Math.round((activeStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${(activeStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Step 1: Basic Info */}
          {activeStep === 1 && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center space-x-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">1</span>
                <span>Basic Recipe Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Recipe Title with Voice Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recipe Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-16 sm:pr-20 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="e.g., Creamy Mac and Cheese"
                    />
                    <button
                      type="button"
                      onClick={() => startVoiceInput('title')}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isListening && currentVoiceField === 'title'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isListening && currentVoiceField === 'title' ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  {isListening && currentVoiceField === 'title' && (
                    <p className="text-xs sm:text-sm text-orange-600 mt-2">🎤 Listening... Speak now!</p>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Cuisine Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cuisine
                  </label>
                  <select
                    value={form.cuisine}
                    onChange={(e) => setForm(prev => ({ ...prev, cuisine: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select cuisine</option>
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, difficulty: diff as 'Easy' | 'Medium' | 'Hard' }))}
                        className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                          form.difficulty === diff
                            ? 'bg-orange-500 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Servings */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Servings
                  </label>
                  <select
                    value={form.servings}
                    onChange={(e) => setForm(prev => ({ ...prev, servings: Number(e.target.value) }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {servingsOptions.map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
              </div>

                             {/* Navigation */}
               <div className="flex justify-end mt-4 sm:mt-6">
                 <button
                   type="button"
                   onClick={nextStep}
                   disabled={!form.title || !form.category}
                   className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                 >
                   Next: Timing
                 </button>
               </div>
            </div>
          )}

          {/* Step 2: Timing */}
          {activeStep === 2 && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center space-x-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">2</span>
                <span>Cooking Times</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Prep Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preparation Time
                  </label>
                  <select
                    value={form.prepTime}
                    onChange={(e) => setForm(prev => ({ ...prev, prepTime: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {prepTimeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Cook Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cooking Time
                  </label>
                  <select
                    value={form.cookTime}
                    onChange={(e) => setForm(prev => ({ ...prev, cookTime: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  >
                    {cookTimeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Total Time (Auto-calculated) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Time
                  </label>
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-slate-600 text-sm sm:text-base">
                    {(() => {
                      const prep = parseInt(form.prepTime);
                      const cook = parseInt(form.cookTime);
                      const total = prep + cook;
                      return `${total} min`;
                    })()}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base"
                >
                  Next: Ingredients
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Ingredients */}
          {activeStep === 3 && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center space-x-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">3</span>
                <span>Ingredients</span>
              </h2>

              {/* Smart Ingredient Suggestions */}
              {form.category && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl">
                  <h3 className="font-semibold text-orange-800 mb-2 sm:mb-3 text-sm sm:text-base">💡 Smart Suggestions for {form.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {getIngredientSuggestions(form.category).map((ingredient) => (
                      <button
                        key={ingredient}
                        type="button"
                        onClick={() => addSmartIngredient(ingredient)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-xs sm:text-sm"
                      >
                        + {ingredient}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Ingredients */}
              <div className="space-y-2 sm:space-y-3 mb-4">
                {form.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></div>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 text-red-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Ingredient */}
              <button
                type="button"
                onClick={addCustomIngredient}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-dashed border-slate-300 rounded-lg sm:rounded-xl text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Custom Ingredient</span>
              </button>

              {/* Navigation */}
              <div className="flex justify-between mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={form.ingredients.length === 0}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Next: Method
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Method */}
          {activeStep === 4 && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center space-x-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">4</span>
                <span>Cooking Method</span>
              </h2>

              {/* Smart Method Suggestions */}
              {form.category && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-2 sm:mb-3 text-sm sm:text-base">💡 Common Steps for {form.category}</h3>
                  <div className="space-y-2">
                    {getMethodSuggestions(form.category).map((step, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addSmartMethodStep(step)}
                        className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm"
                      >
                        + {step}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Method Steps */}
              <div className="space-y-3 sm:space-y-4 mb-4">
                {form.method.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {index + 1}
                    </span>
                    <textarea
                      value={step}
                      onChange={(e) => updateMethodStep(index, e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm sm:text-base"
                      rows={2}
                      placeholder={`Step ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeMethodStep(index)}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 text-red-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Method Step */}
              <button
                type="button"
                onClick={addCustomMethodStep}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-dashed border-slate-300 rounded-lg sm:rounded-xl text-slate-500 hover:border-green-400 hover:text-green-500 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Custom Step</span>
              </button>

              {/* Navigation */}
              <div className="flex justify-between mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create Recipe</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SimpleRecipeCreate;
