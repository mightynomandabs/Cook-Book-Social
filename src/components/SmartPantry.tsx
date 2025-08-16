import React, { useState } from 'react';
import { Search, Plus, Check, X, ShoppingCart, AlertTriangle, Package } from 'lucide-react';

const SmartPantry: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pantry' | 'shopping' | 'expiry'>('pantry');

  const samplePantryItems = [
    {
      id: '1',
      name: 'Basmati Rice',
      category: 'Grains',
      quantity: 2,
      unit: 'kg',
      expiryDate: new Date('2024-06-15'),
      addedAt: new Date('2024-01-01'),
      isLow: false
    },
    {
      id: '2',
      name: 'Onions',
      category: 'Vegetables',
      quantity: 0.5,
      unit: 'kg',
      expiryDate: new Date('2024-01-25'),
      addedAt: new Date('2024-01-15'),
      isLow: true
    },
    {
      id: '3',
      name: 'Garam Masala',
      category: 'Spices',
      quantity: 100,
      unit: 'g',
      expiryDate: new Date('2025-01-01'),
      addedAt: new Date('2024-01-01'),
      isLow: false
    },
    {
      id: '4',
      name: 'Tomatoes',
      category: 'Vegetables',
      quantity: 0,
      unit: 'kg',
      expiryDate: new Date('2024-01-20'),
      addedAt: new Date('2024-01-10'),
      isLow: true
    }
  ];

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Pantry', 'Frozen'];

  const filteredItems = samplePantryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = samplePantryItems.filter(item => item.isLow);
  const expiringItems = samplePantryItems.filter(item => {
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  });

  const formatExpiryDate = (date: Date) => {
    const daysUntilExpiry = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days`;
    return `Expires in ${daysUntilExpiry} days`;
  };

  const getExpiryColor = (date: Date) => {
    const daysUntilExpiry = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'text-red-600 bg-red-100';
    if (daysUntilExpiry <= 3) return 'text-orange-600 bg-orange-100';
    if (daysUntilExpiry <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-cookbook-black mb-4">Smart Pantry</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search pantry items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cookbook-orange focus:border-transparent focus:outline-none"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-cookbook-orange/10 border border-cookbook-orange/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-cookbook-orange">{samplePantryItems.length}</div>
            <div className="text-xs text-cookbook-orange">Total Items</div>
          </div>
          <div className="bg-cookbook-yellow/10 border border-cookbook-yellow/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-cookbook-yellow">{lowStockItems.length}</div>
            <div className="text-xs text-cookbook-yellow">Low Stock</div>
          </div>
          <div className="bg-cookbook-green/10 border border-cookbook-green/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-cookbook-green">{expiringItems.length}</div>
            <div className="text-xs text-cookbook-green">Expiring Soon</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('pantry')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pantry'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Pantry</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'shopping'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Shopping</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('expiry')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'expiry'
                ? 'bg-white text-cookbook-orange shadow-sm'
                : 'text-gray-600 hover:text-cookbook-orange'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Expiry</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        {activeTab === 'pantry' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-cookbook-black">Your Pantry</h2>
              <button className="bg-cookbook-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-orange/90 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-cookbook-orange hover:text-white transition-colors whitespace-nowrap"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Pantry Items */}
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-cookbook-black">{item.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-cookbook-orange transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpiryColor(item.expiryDate)}`}>
                      {formatExpiryDate(item.expiryDate)}
                    </span>
                    {item.isLow && (
                      <span className="px-2 py-1 bg-cookbook-yellow/20 text-cookbook-yellow rounded-full text-xs font-medium">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    Added {item.addedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-cookbook-black">Shopping List</h2>
            
            {/* Low Stock Items */}
            <div className="bg-cookbook-yellow/10 border border-cookbook-yellow/20 rounded-xl p-4">
              <h3 className="font-semibold text-cookbook-black mb-3">Items to Restock</h3>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-cookbook-orange rounded" />
                      <div>
                        <h4 className="font-medium text-cookbook-black">{item.name}</h4>
                        <p className="text-sm text-gray-600">Need: {item.quantity} {item.unit}</p>
                      </div>
                    </div>
                    <button className="bg-cookbook-orange text-white px-3 py-1 rounded text-sm font-medium hover:bg-cookbook-orange/90 transition-colors">
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="bg-cookbook-green/10 border border-cookbook-green/20 rounded-xl p-4">
              <h3 className="font-semibold text-cookbook-black mb-3">Smart Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="w-5 h-5 text-cookbook-green rounded" />
                    <div>
                      <h4 className="font-medium text-cookbook-black">Fresh Coriander</h4>
                      <p className="text-sm text-gray-600">Perfect with your rice recipes</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">₹20</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="w-5 h-5 text-cookbook-green rounded" />
                    <div>
                      <h4 className="font-medium text-cookbook-black">Ginger</h4>
                      <p className="text-sm text-gray-600">Essential for Indian cooking</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">₹30</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-cookbook-orange text-white py-3 px-4 rounded-xl font-medium hover:bg-cookbook-orange/90 transition-colors">
                Add All to Cart
              </button>
              <button className="bg-white text-cookbook-orange border border-cookbook-orange py-3 px-4 rounded-xl font-medium hover:bg-cookbook-orange hover:text-white transition-colors">
                Share List
              </button>
            </div>
          </div>
        )}

        {activeTab === 'expiry' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-cookbook-black">Expiry Management</h2>
            
            {/* Expiring Soon */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-3">⚠️ Expiring This Week</h3>
              <div className="space-y-3">
                {expiringItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <h4 className="font-medium text-cookbook-black">{item.name}</h4>
                        <p className="text-sm text-red-600">{formatExpiryDate(item.expiryDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 transition-colors">
                        Use Now
                      </button>
                      <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-600 transition-colors">
                        Discard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expired Items */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Expired Items</h3>
              <div className="text-center py-6">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No expired items in your pantry!</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-cookbook-green/10 border border-cookbook-green/20 rounded-xl p-4">
              <h3 className="font-semibold text-cookbook-black mb-3">💡 Pantry Tips</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Store grains in airtight containers to extend shelf life</li>
                <li>• Keep onions and potatoes separate to prevent spoilage</li>
                <li>• Freeze herbs in ice cube trays with oil for longer storage</li>
                <li>• Use the FIFO method: First In, First Out</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPantry;
