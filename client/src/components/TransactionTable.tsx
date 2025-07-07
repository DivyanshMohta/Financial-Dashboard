import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface Transaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Sorting {
  sortBy: string;
  order: 'asc' | 'desc';
}

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  pagination: PaginationInfo;
  sorting: Sorting;
  onPageChange: (page: number) => void;
  onSort: (sortBy: string) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  pagination,
  sorting,
  onPageChange,
  onSort,
  onPageSizeChange
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Revenue':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'Expense':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Revenue':
        return 'text-green-400';
      case 'Expense':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-700/50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sorting.sortBy === field ? (
          sorting.order === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : (
          <div className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            <div className="text-slate-300 font-medium">Loading transactions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-8 text-center">
          <DollarSign className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No transactions found</h3>
          <p className="text-slate-400">Try adjusting your filters or search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <SortableHeader field="id">ID</SortableHeader>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="user_id">User ID</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                User Profile
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                  #{transaction.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={getCategoryColor(transaction.category)}>
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(transaction.category)}
                    <span className={getCategoryColor(transaction.category)}>
                      {transaction.category}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                  {transaction.user_id}
                </td>
                <td className="px-4 py-4 text-sm text-slate-300 max-w-xs truncate">
                  {transaction.user_profile}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Page Size - Always show this section */}
      <div className="px-6 py-4 bg-slate-700/30 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            {/* Page Size Selector - Always show this */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Show:</span>
              <select
                value={pagination.limit}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-slate-400">per page</span>
            </div>
          </div>
          
          {/* Pagination Controls - Only show if multiple pages */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;