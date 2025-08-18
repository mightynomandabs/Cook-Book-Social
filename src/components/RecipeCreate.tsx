import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Video, 
  Image, 
  X, 
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Save
} from 'lucide-react';
import { supabase, TABLES } from '../lib/supabase';

interface UploadedMedia {
  type: 'video' | 'image';
  file: File;
  url: string;
}

interface RecipeFormData {
  title: string;
  description: string;
  tags: string[];
  cuisine: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  method: string[];
}

type Step = 'details' | 'ingredients' | 'steps';

const RecipeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    tags: [],
    cuisine: '',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [],
    method: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newMethodStep, setNewMethodStep] = useState('');
  
  const mediaRef = useRef<HTMLInputElement>(null);

  const cuisineOptions = [
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'American',
    'French', 'Thai', 'Japanese', 'Chinese', 'Korean', 'Greek', 'Spanish'
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const suggestedTags = [
    'Quick', 'Healthy', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'
  ];

  const commonIngredients = [
    'Salt', 'Black Pepper', 'Olive Oil', 'Garlic', 'Onion', 'Butter',
    'Flour', 'Eggs', 'Milk', 'Cheese', 'Tomatoes', 'Basil', 'Lemon',
    'Chicken Breast', 'Ground Beef', 'Rice', 'Pasta', 'Bell Peppers'
  ];

  const steps: { key: Step; title: string; description: string }[] = [
    { key: 'details', title: 'Details', description: 'Basic recipe information' },
    { key: 'ingredients', title: 'Ingredients', description: 'What you need' },
    { key: 'steps', title: 'Steps & Media', description: 'How to make it' }
  ];

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Please select a valid image or video file');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedMedia({
      type: isVideo ? 'video' : 'image',
      file,
      url
    });
  };

  const updateFormField = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormField('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addIngredient = (ingredient?: string) => {
    const ingredientToAdd = ingredient || newIngredient;
    if (ingredientToAdd.trim() && !formData.ingredients.includes(ingredientToAdd.trim())) {
      updateFormField('ingredients', [...formData.ingredients, ingredientToAdd.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    updateFormField('ingredients', formData.ingredients.filter((_, i) => i !== index));
  };

  const addMethodStep = (step?: string) => {
    const stepToAdd = step || newMethodStep;
    if (stepToAdd.trim() && !formData.method.includes(stepToAdd.trim())) {
      updateFormField('method', [...formData.method, stepToAdd.trim()]);
      setNewMethodStep('');
    }
  };

  const removeMethodStep = (index: number) => {
    updateFormField('method', formData.method.filter((_, i) => i !== index));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'details':
        return formData.title.trim() && formData.cuisine && formData.difficulty;
      case 'ingredients':
        return formData.ingredients.length > 0;
      case 'steps':
        return formData.method.length > 0 && uploadedMedia;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 'details') setCurrentStep('ingredients');
    else if (currentStep === 'ingredients') setCurrentStep('steps');
  };

  const prevStep = () => {
    if (currentStep === 'ingredients') setCurrentStep('details');
    else if (currentStep === 'steps') setCurrentStep('ingredients');
  };

  const createRecipeInSupabase = async () => {
    if (!uploadedMedia) return;

    try {
      // Upload media to Supabase storage
      const fileExt = uploadedMedia.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${uploadedMedia.type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('recipe-media')
        .upload(filePath, uploadedMedia.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl: mediaUrl } } = supabase.storage
        .from('recipe-media')
        .getPublicUrl(filePath);

      // Create recipe in database
      const { data: recipe, error: recipeError } = await supabase
        .from(TABLES.RECIPES)
        .insert({
          title: formData.title,
          description: formData.description,
          creator_id: '11111111-1111-1111-1111-111111111111', // Test user from essential tables setup
          image_url: uploadedMedia.type === 'image' ? mediaUrl : null,
          video_url: uploadedMedia.type === 'video' ? mediaUrl : null,
          cuisine: formData.cuisine,
          prep_time: formData.prepTime,
          cook_time: formData.cookTime,
          servings: formData.servings,
          difficulty: formData.difficulty,
          language: 'English',
          tags: formData.tags,
          dietary_tags: formData.tags.filter(tag => ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].includes(tag)),
          is_published: true,
          likes_count: 0,
          comments_count: 0,
          saves_count: 0,
          views_count: 0
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Create ingredients
      if (formData.ingredients.length > 0) {
        const ingredientsData = formData.ingredients.map((ingredient, index) => ({
          recipe_id: recipe.id,
          name: ingredient,
          amount: '',
          unit: '',
          step_number: index + 1,
          price: 0,
          is_available: true
        }));

        const { error: ingredientsError } = await supabase
          .from(TABLES.INGREDIENTS)
          .insert(ingredientsData);

        if (ingredientsError) throw ingredientsError;
      }

      // Create method steps
      if (formData.method.length > 0) {
        const methodData = formData.method.map((step, index) => ({
          recipe_id: recipe.id,
          step_number: index + 1,
          description: step,
          time: 0,
          tips: ''
        }));

        const { error: methodError } = await supabase
          .from(TABLES.METHOD_STEPS)
          .insert(methodData);

        if (methodError) throw methodError;
      }

      alert('Recipe published successfully!');
      navigate('/feed');
    } catch (error: any) {
      console.error('Error publishing recipe:', error);
      alert(`Error publishing recipe: ${error.message}`);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await createRecipeInSupabase();
    } finally {
      setIsPublishing(false);
    }
  };

  const totalTime = formData.prepTime + formData.cookTime;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Create Recipe</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    currentStep === step.key
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : steps.findIndex(s => s.key === currentStep) > index
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {steps.findIndex(s => s.key === currentStep) > index ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      currentStep === step.key ? 'text-orange-500' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    steps.findIndex(s => s.key === currentStep) > index ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Step 1: Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Recipe Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    placeholder="Enter recipe title..."
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Cuisine */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine *
                  </label>
                  <select
                    value={formData.cuisine}
                    onChange={(e) => updateFormField('cuisine', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select cuisine</option>
                    {cuisineOptions.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => updateFormField('difficulty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    {difficultyOptions.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                {/* Prep Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => updateFormField('prepTime', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Cook Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) => updateFormField('cookTime', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Total Time Display */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Total Time:</span>
                      <span className="text-lg font-bold text-orange-600">
                        {totalTime} minutes
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Serves {formData.servings} {formData.servings === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  placeholder="Describe your recipe, cooking tips, or story behind it..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-orange-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add custom tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => !formData.tags.includes(tag) && updateFormField('tags', [...formData.tags, tag])}
                          disabled={formData.tags.includes(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            formData.tags.includes(tag)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Ingredients */}
          {currentStep === 'ingredients' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
              
              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-gray-700 font-medium">
                      {ingredient}
                    </span>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {formData.ingredients.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No ingredients added yet. Add ingredients to continue.
                  </p>
                )}

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    placeholder="Type ingredient name (e.g., 'Oni' for 'Onion')"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                  <button
                    onClick={() => addIngredient()}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>

                {/* Common Ingredients Suggestions */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Common ingredients:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonIngredients.map((ingredient) => (
                      <button
                        key={ingredient}
                        onClick={() => !formData.ingredients.includes(ingredient) && addIngredient(ingredient)}
                        disabled={formData.ingredients.includes(ingredient)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.ingredients.includes(ingredient)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Steps & Media */}
          {currentStep === 'steps' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Steps & Media</h2>
              
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Recipe Media *
                </label>
                
                {!uploadedMedia ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <input
                      ref={mediaRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => mediaRef.current?.click()}
                      className="flex flex-col items-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Upload Photo or Video</p>
                        <p className="text-sm text-gray-500">Show your recipe in action</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {uploadedMedia.type === 'image' ? (
                      <img
                        src={uploadedMedia.url}
                        alt="Recipe"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    ) : (
                      <video
                        src={uploadedMedia.url}
                        controls
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    )}
                    <button
                      onClick={() => setUploadedMedia(null)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Method Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Method Steps *
                </label>
                
                <div className="space-y-4">
                  {formData.method.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {step}
                      </span>
                      <button
                        onClick={() => removeMethodStep(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {formData.method.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No method steps added yet. Add steps to continue.
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <textarea
                      value={newMethodStep}
                      onChange={(e) => setNewMethodStep(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addMethodStep())}
                      placeholder="Describe this step..."
                      rows={3}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                    />
                    <button
                      onClick={() => addMethodStep()}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 'details'}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep !== 'steps' ? (
              <button
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={!canProceedToNext() || isPublishing}
                className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Publish Recipe</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCreate;
