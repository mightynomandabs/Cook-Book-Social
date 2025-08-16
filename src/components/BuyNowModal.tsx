import React, { useState } from 'react';
import { X, ShoppingCart, Clock, Check } from 'lucide-react';
import { Ingredient, Supplier } from '../types';

interface BuyNowModalProps {
  ingredient: Ingredient;
  onClose: () => void;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ ingredient, onClose }) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(ingredient.suppliers[0]);
  const [quantity, setQuantity] = useState(ingredient.amount);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const totalPrice = selectedSupplier ? selectedSupplier.price * quantity : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-cookbook-black">Buy {ingredient.name}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-cookbook-orange transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Ingredient Info */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-cookbook-orange/20 to-cookbook-yellow/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-cookbook-black mb-1">
              {ingredient.name}
            </h3>
            <p className="text-gray-600">
              {ingredient.amount} {ingredient.unit} needed for recipe
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quantity to buy
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 text-cookbook-orange rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <div className="text-2xl font-bold text-cookbook-black min-w-[3rem] text-center">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-100 text-cookbook-orange rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {ingredient.unit} • {ingredient.amount} needed for recipe
            </p>
          </div>

          {/* Supplier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose supplier
            </label>
            <div className="space-y-3">
              {ingredient.suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedSupplier?.id === supplier.id
                      ? 'border-cookbook-orange bg-cookbook-orange/5'
                      : 'border-gray-200 hover:border-cookbook-orange/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {supplier.logo}
                      </div>
                      <div>
                        <h4 className="font-medium text-cookbook-black">{supplier.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{supplier.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cookbook-orange">
                        ₹{supplier.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        per {ingredient.unit}
                      </div>
                    </div>
                  </div>
                  
                  {selectedSupplier?.id === supplier.id && (
                    <div className="mt-3 flex items-center justify-center text-cookbook-orange">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-cookbook-yellow/10 border border-cookbook-yellow/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-cookbook-black">Total Price:</span>
              <span className="text-2xl font-bold text-cookbook-orange">₹{totalPrice}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Delivery:</span>
              <span>{selectedSupplier?.deliveryTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSupplier}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                selectedSupplier
                  ? 'bg-gradient-to-r from-cookbook-orange to-cookbook-yellow text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{addedToCart ? 'Added to Cart!' : 'Add to Smart Cart'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 px-6 text-gray-600 hover:text-cookbook-black transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Smart Cart Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-cookbook-black mb-2">Smart Cart Features</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Consolidate ingredients from multiple recipes</li>
              <li>• Get bulk discounts on larger orders</li>
              <li>• Track delivery across all suppliers</li>
              <li>• Save favorite suppliers for quick reordering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
