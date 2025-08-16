import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Phone, Globe, Truck, Filter, Heart } from 'lucide-react';

const RestaurantHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const sampleRestaurants = [
    {
      id: '1',
      name: 'Spice Garden',
      logo: '🌶️',
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop',
      address: '123 Food Street, Bandra West, Mumbai',
      coordinates: { lat: 19.076, lng: 72.8777 },
      phone: '+91 98765 43210',
      website: 'www.spicegarden.com',
      cuisine: ['North Indian', 'Mughlai', 'Tandoori'],
      priceRange: 'Mid-range',
      rating: 4.6,
      reviews: 1240,
      featuredDishes: [
        {
          id: '1',
          name: 'Butter Chicken',
          description: 'Creamy, rich butter chicken with tender pieces of chicken in a tomato-based gravy.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop',
          price: 450,
          isVegetarian: false,
          spiceLevel: 2,
          allergens: ['Dairy', 'Nuts'],
          orderLink: 'https://swiggy.com/spicegarden/butter-chicken'
        },
        {
          id: '2',
          name: 'Paneer Tikka',
          description: 'Marinated cottage cheese grilled to perfection with aromatic spices.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
          price: 380,
          isVegetarian: true,
          spiceLevel: 3,
          allergens: ['Dairy'],
          orderLink: 'https://swiggy.com/spicegarden/paneer-tikka'
        }
      ],
      openingHours: {
        monday: '11:00 AM - 11:00 PM',
        tuesday: '11:00 AM - 11:00 PM',
        wednesday: '11:00 AM - 11:00 PM',
        thursday: '11:00 AM - 11:00 PM',
        friday: '11:00 AM - 12:00 AM',
        saturday: '11:00 AM - 12:00 AM',
        sunday: '11:00 AM - 11:00 PM'
      },
      deliveryAvailable: true,
      deliveryPartners: ['Swiggy', 'Zomato', 'Dunzo']
    },
    {
      id: '2',
      name: 'Pizza Palace',
      logo: '🍕',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
      address: '456 Italian Lane, Andheri West, Mumbai',
      coordinates: { lat: 19.1197, lng: 72.8464 },
      phone: '+91 98765 43211',
      website: 'www.pizzapalace.com',
      cuisine: ['Italian', 'Pizza', 'Pasta'],
      priceRange: 'Budget',
      rating: 4.3,
      reviews: 890,
      featuredDishes: [
        {
          id: '3',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.',
          image: 'https://images.unsplash.com/photo-1563379091339-3b21d0c1d146?w=200&h=150&fit=crop',
          price: 299,
          isVegetarian: true,
          spiceLevel: 1,
          allergens: ['Gluten', 'Dairy'],
          orderLink: 'https://zomato.com/pizzapalace/margherita'
        }
      ],
      openingHours: {
        monday: '12:00 PM - 10:00 PM',
        tuesday: '12:00 PM - 10:00 PM',
        wednesday: '12:00 PM - 10:00 PM',
        thursday: '12:00 PM - 10:00 PM',
        friday: '12:00 PM - 11:00 PM',
        saturday: '12:00 PM - 11:00 PM',
        sunday: '12:00 PM - 10:00 PM'
      },
      deliveryAvailable: true,
      deliveryPartners: ['Swiggy', 'Zomato']
    }
  ];

  const filters = [
    { id: 'all', label: 'All', count: sampleRestaurants.length },
    { id: 'north-indian', label: 'North Indian', count: 12 },
    { id: 'south-indian', label: 'South Indian', count: 8 },
    { id: 'chinese', label: 'Chinese', count: 15 },
    { id: 'italian', label: 'Italian', count: 6 },
    { id: 'street-food', label: 'Street Food', count: 20 }
  ];

  const filteredRestaurants = sampleRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriceRangeColor = (range: string) => {
    switch (range) {
      case 'Budget': return 'text-green-600 bg-green-100';
      case 'Mid-range': return 'text-yellow-600 bg-yellow-100';
      case 'Premium': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-cookbook-black mb-4">Restaurant Hub</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cookbook-orange focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-cookbook-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        <div className="space-y-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Cover Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {restaurant.logo}
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-cookbook-black">
                    <Star className="w-4 h-4 inline mr-1 text-cookbook-yellow" />
                    {restaurant.rating}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceRangeColor(restaurant.priceRange)}`}>
                    {restaurant.priceRange}
                  </span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-cookbook-black mb-1">{restaurant.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.address}</span>
                    </div>
                  </div>
                  <button className="bg-cookbook-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-orange/90 transition-colors">
                    View Profile
                  </button>
                </div>

                {/* Cuisine Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {restaurant.cuisine.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="px-3 py-1 bg-cookbook-orange/10 text-cookbook-orange rounded-full text-sm font-medium"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>
                      <Star className="w-4 h-4 inline mr-1 text-cookbook-yellow" />
                      {restaurant.rating} ({restaurant.reviews} reviews)
                    </span>
                    <span>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {restaurant.openingHours.monday}
                    </span>
                  </div>
                  <span>
                    <Truck className="w-4 h-4 inline mr-1" />
                    Delivery Available
                  </span>
                </div>

                {/* Featured Dishes */}
                <div className="mb-4">
                  <h4 className="font-semibold text-cookbook-black mb-3">Featured Dishes</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {restaurant.featuredDishes.map((dish) => (
                      <div key={dish.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="relative mb-2">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          {dish.isVegetarian && (
                            <div className="absolute top-1 right-1 bg-cookbook-green text-white text-xs px-1 py-0.5 rounded">
                              🥬 Veg
                            </div>
                          )}
                        </div>
                        <h5 className="font-medium text-cookbook-black text-sm mb-1">{dish.name}</h5>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{dish.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cookbook-orange">₹{dish.price}</span>
                          <button className="bg-cookbook-green text-white px-2 py-1 rounded text-xs font-medium hover:bg-cookbook-green/90 transition-colors">
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-cookbook-orange transition-colors">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Call</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-cookbook-orange transition-colors">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Website</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {restaurant.deliveryPartners.map((partner) => (
                      <span
                        key={partner}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Restaurant Promotion CTA */}
        <div className="mt-8 bg-gradient-to-r from-cookbook-orange/10 to-cookbook-yellow/10 border border-cookbook-orange/20 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-cookbook-black mb-2">Are you a restaurant owner?</h3>
          <p className="text-gray-600 mb-4">
            Join CookBook's restaurant hub to reach millions of food lovers and grow your business!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-cookbook-orange text-white px-6 py-3 rounded-xl font-medium hover:bg-cookbook-orange/90 transition-colors">
              List Your Restaurant
            </button>
            <button className="bg-white text-cookbook-orange border border-cookbook-orange px-6 py-3 rounded-xl font-medium hover:bg-cookbook-orange hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHub;
