import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface SimpleRecipeForm {
  title: string;
  creator: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  ingredients: string[];
  method: string[];
}

interface SimpleRecipeCreateProps {
  onBackToFeed: () => void;
}

const SimpleRecipeCreate: React.FC<SimpleRecipeCreateProps> = ({ onBackToFeed }) => {
  const [form, setForm] = useState<SimpleRecipeForm>({
    title: '',
    creator: '',
    difficulty: 'Easy',
    time: '',
    ingredients: [''],
    method: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    if (form.ingredients.length > 1) {
      setForm(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const updateIngredient = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addMethodStep = () => {
    setForm(prev => ({
      ...prev,
      method: [...prev.method, '']
    }));
  };

  const removeMethodStep = (index: number) => {
    if (form.method.length > 1) {
      setForm(prev => ({
        ...prev,
        method: prev.method.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMethodStep = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      method: prev.method.map((step, i) => i === index ? value : step)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out empty ingredients and method steps
    const cleanForm = {
      ...form,
      ingredients: form.ingredients.filter(ing => ing.trim() !== ''),
      method: form.method.filter(step => step.trim() !== '')
    };

    // For MVP, just log the recipe (you can add local storage or simple DB later)
    console.log('New Recipe:', cleanForm);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Recipe created successfully! 🎉');
      // Reset form
      setForm({
        title: '',
        creator: '',
        difficulty: 'Easy',
        time: '',
        ingredients: [''],
        method: ['']
      });
      // Go back to feed
      onBackToFeed();
    }, 1000);
  };

  const isFormValid = form.title.trim() !== '' && 
                     form.creator.trim() !== '' && 
                     form.time.trim() !== '' &&
                     form.ingredients.some(ing => ing.trim() !== '') &&
                     form.method.some(step => step.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={onBackToFeed}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create Recipe</h1>
            <p className="text-slate-600">Share your culinary creation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Butter Chicken"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={form.creator}
                  onChange={(e) => setForm(prev => ({ ...prev, creator: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Chef Priya"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm(prev => ({ ...prev, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cooking Time *
                </label>
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 45 mins"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {form.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {form.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Method Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Method Steps</h2>
              <button
                type="button"
                onClick={addMethodStep}
                className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {form.method.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-3">
                    {index + 1}
                  </span>
                  <div className="flex-1 flex items-center space-x-3">
                    <textarea
                      value={step}
                      onChange={(e) => updateMethodStep(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder={`Step ${index + 1}`}
                      rows={2}
                    />
                    {form.method.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMethodStep(index)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-1'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleRecipeCreate;
