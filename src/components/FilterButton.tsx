import React from 'react';
import { Filter } from 'lucide-react';

interface FilterButtonProps {
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
    >
      <Filter size={18} />
      <span className="text-sm">Filter</span>
    </button>
  );
};

export default FilterButton;
