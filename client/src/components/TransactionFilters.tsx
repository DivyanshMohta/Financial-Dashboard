import React from 'react';
import { X, User, Tag, CheckCircle, DollarSign } from 'lucide-react';

interface Filters {
  category: string;
  status: string;
  user_id: string;
  minAmount: string;
  maxAmount: string;
  search: string;
}

interface FilterOptions {
  categories: string[];
  statuses: string[];
  users: string[];
}

interface TransactionFiltersProps {
  filters: Filters;
  filterOptions: FilterOptions;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="mb-6 bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-blue-400" />
          <span>Advanced Filters</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
            <CheckCircle className="w-4 h-4" />
            <span>Status</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {filterOptions.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
            <User className="w-4 h-4" />
            <span>User</span>
          </label>
          <select
            value={filters.user_id}
            onChange={(e) => onFilterChange('user_id', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Users</option>
            {filterOptions.users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
            <DollarSign className="w-4 h-4" />
            <span>Amount Range</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) => onFilterChange('minAmount', e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) => onFilterChange('maxAmount', e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === '') return null;
              
              let displayValue = value;
              let icon = null;
              
              switch (key) {
                case 'category':
                  icon = <Tag className="w-3 h-3" />;
                  break;
                case 'status':
                  icon = <CheckCircle className="w-3 h-3" />;
                  break;
                case 'user_id':
                  icon = <User className="w-3 h-3" />;
                  break;
                case 'minAmount':
                  icon = <DollarSign className="w-3 h-3" />;
                  displayValue = `Min: $${parseFloat(value).toLocaleString()}`;
                  break;
                case 'maxAmount':
                  icon = <DollarSign className="w-3 h-3" />;
                  displayValue = `Max: $${parseFloat(value).toLocaleString()}`;
                  break;
                case 'search':
                  icon = <span className="text-xs">🔍</span>;
                  displayValue = `"${value}"`;
                  break;
              }
              
              return (
                <div
                  key={key}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm"
                >
                  {icon}
                  <span>{displayValue}</span>
                  <button
                    onClick={() => onFilterChange(key, '')}
                    className="ml-1 hover:text-blue-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;