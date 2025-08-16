import React, { useState } from 'react';
import { Calendar, Plus, ShoppingCart, Clock, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { sampleRecipes } from '../data/sampleRecipe';
import { Recipe } from '../types';

const MealPlanner: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  const getCurrentWeekDates = getWeekDates(currentWeek);

  type MealPlanDay = {
    breakfast: Recipe | null;
    lunch: Recipe | null;
    dinner: Recipe | null;
    snacks: Recipe[];
  };

  const sampleMealPlan: Record<string, MealPlanDay> = {
    '2024-01-15': {
      breakfast: sampleRecipes[0],
      lunch: sampleRecipes[1],
      dinner: sampleRecipes[2],
      snacks: []
    },
    '2024-01-16': {
      breakfast: sampleRecipes[1],
      lunch: null,
      dinner: sampleRecipes[0],
      snacks: [sampleRecipes[2]]
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMealForDate = (date: Date, mealType: string) => {
    const dateKey = formatDate(date);
    const dayPlan = sampleMealPlan[dateKey];
    if (!dayPlan) return null;
    
    switch (mealType.toLowerCase()) {
      case 'breakfast': return dayPlan.breakfast;
      case 'lunch': return dayPlan.lunch;
      case 'dinner': return dayPlan.dinner;
      case 'snacks': return dayPlan.snacks;
      default: return null;
    }
  };

  const generateShoppingList = () => {
    const allIngredients = new Map();
    
    Object.values(sampleMealPlan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(meal => {
        if (meal && Array.isArray(meal)) {
          // Snacks array
          meal.forEach(snack => {
            if (snack.ingredients) {
              snack.ingredients.forEach(ingredient => {
                const key = ingredient.name;
                if (allIngredients.has(key)) {
                  allIngredients.set(key, allIngredients.get(key) + ingredient.amount);
                } else {
                  allIngredients.set(key, ingredient.amount);
                }
              });
            }
          });
        } else if (meal && meal.ingredients) {
          // Single meal
          meal.ingredients.forEach(ingredient => {
            const key = ingredient.name;
            if (allIngredients.has(key)) {
              allIngredients.set(key, allIngredients.get(key) + ingredient.amount);
            } else {
              allIngredients.set(key, ingredient.amount);
            }
          });
        }
      });
    });
    
    return Array.from(allIngredients.entries()).map(([name, amount]) => ({
      name,
      amount,
      unit: 'g', // Simplified for demo
      price: Math.floor(Math.random() * 100) + 20
    }));
  };

  const shoppingList = generateShoppingList();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    if (direction === 'prev') {
      newWeek.setDate(newWeek.getDate() - 7);
    } else {
      newWeek.setDate(newWeek.getDate() + 7);
    }
    setCurrentWeek(newWeek);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-cookbook-black mb-4">Meal Planner</h1>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-gray-600 hover:text-cookbook-orange transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-cookbook-black">
              {getCurrentWeekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {getCurrentWeekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="text-sm text-gray-600">Week {Math.ceil((getCurrentWeekDates[0].getDate() + 1) / 7)}</p>
          </div>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-gray-600 hover:text-cookbook-orange transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <button className="bg-cookbook-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-orange/90 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Meal</span>
          </button>
          <button className="bg-cookbook-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-green/90 transition-colors flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>View Shopping List</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        {/* Weekly Calendar */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          {/* Header Row */}
          <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
            <div className="p-3 text-sm font-medium text-gray-600"></div>
            {weekDays.map((day, index) => (
              <div key={day} className="p-3 text-center">
                <div className="text-sm font-medium text-gray-600">{day.slice(0, 3)}</div>
                <div className={`text-lg font-bold ${
                  getCurrentWeekDates[index].toDateString() === new Date().toDateString()
                    ? 'text-cookbook-orange'
                    : 'text-cookbook-black'
                }`}>
                  {getCurrentWeekDates[index].getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Meal Rows */}
          {mealTypes.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
              <div className="p-3 bg-gray-50 border-r border-gray-100">
                <div className="text-sm font-medium text-cookbook-black">{mealType}</div>
                <div className="text-xs text-gray-500">Meal</div>
              </div>
              
              {getCurrentWeekDates.map((date, dayIndex) => {
                const meal = getMealForDate(date, mealType);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={dayIndex}
                    className={`p-2 border-r border-gray-100 last:border-r-0 min-h-[80px] ${
                      isToday ? 'bg-cookbook-orange/5' : ''
                    }`}
                  >
                    {meal ? (
                      <div className="bg-white rounded-lg p-2 border border-gray-200 hover:border-cookbook-orange transition-colors cursor-pointer">
                        {Array.isArray(meal) ? (
                          // Snacks array
                          <div className="space-y-1">
                            {meal.map((snack, index) => (
                              <div key={index} className="text-xs">
                                <div className="font-medium text-cookbook-black truncate">{snack.title}</div>
                                <div className="text-gray-500">{snack.prepTime}m</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Single meal
                          <div>
                            <div className="text-xs font-medium text-cookbook-black truncate mb-1">
                              {meal.title}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{meal.prepTime}m</span>
                              <span>{meal.servings}👥</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedDate(date);
                          setShowAddMeal(true);
                        }}
                        className="w-full h-full flex items-center justify-center text-gray-400 hover:text-cookbook-orange transition-colors border-2 border-dashed border-gray-200 hover:border-cookbook-orange rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Shopping List */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-cookbook-black">Shopping List</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {shoppingList.length} items
              </span>
              <button className="bg-cookbook-green text-white px-3 py-1 rounded text-sm font-medium hover:bg-cookbook-green/90 transition-colors">
                Add All to Cart
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {shoppingList.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 text-cookbook-orange rounded" />
                  <div>
                    <h4 className="font-medium text-cookbook-black">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.amount} {item.unit}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-cookbook-orange">₹{item.price}</span>
                  <button className="bg-cookbook-orange text-white px-3 py-1 rounded text-sm font-medium hover:bg-cookbook-orange/90 transition-colors">
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Planning Tips */}
        <div className="mt-6 bg-gradient-to-r from-cookbook-orange/10 to-cookbook-yellow/10 border border-cookbook-orange/20 rounded-xl p-4">
          <h3 className="font-semibold text-cookbook-black mb-3">💡 Meal Planning Tips</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Plan meals around ingredients you already have in your pantry</li>
            <li>• Cook larger portions and freeze leftovers for busy days</li>
            <li>• Include a variety of cuisines to keep meals interesting</li>
            <li>• Plan snacks to avoid unhealthy impulse eating</li>
            <li>• Consider seasonal produce for better prices and flavor</li>
          </ul>
        </div>
      </div>

      {/* Add Meal Modal Placeholder */}
      {showAddMeal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-cookbook-black mb-4">
              Add Meal for {selectedDate.toLocaleDateString()}
            </h3>
            <p className="text-gray-600 mb-4">
              This would open a modal to select recipes and add them to your meal plan.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddMeal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddMeal(false)}
                className="flex-1 bg-cookbook-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-cookbook-orange/90 transition-colors"
              >
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
