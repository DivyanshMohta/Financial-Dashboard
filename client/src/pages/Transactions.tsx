/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Download, RefreshCw, Search, Filter } from 'lucide-react';
import { transactionAPI } from '../api';
import ExportModal from '../components/ExportModal';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFilters';
// import { useAuth } from '../contexts/AuthContext';

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

interface FilterOptions {
  categories: string[];
  statuses: string[];
  users: string[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const Transactions = () => {
  // const { token } = useAuth();
  
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    statuses: [],
    users: []
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    user_id: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  });
  
  // Pagination states
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Sorting states
  const [sorting, setSorting] = useState({
    sortBy: 'date',
    order: 'desc' as 'asc' | 'desc'
  });
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  // API functions
  const fetchFilterOptions = async () => {
    try {
      const data = await transactionAPI.getFilters();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sorting.sortBy,
        order: sorting.order,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };
      
      const data = await transactionAPI.getTransactions(params);
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async (columns: string[]) => {
    setExporting(true);
    try {
      const exportFilters = {
        columns,
        ...filters,
        sortBy: sorting.sortBy,
        order: sorting.order
      };
      
      const blob = await transactionAPI.exportCSV(exportFilters);
      
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowExportModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  // Event handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); 
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSort = (sortBy: string) => {
    setSorting(prev => ({
      sortBy,
      order: prev.sortBy === sortBy && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      user_id: '',
      minAmount: '',
      maxAmount: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: pageSize,
      page: 1 // Reset to first page when changing page size
    }));
  };

  // Effects
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.page, pagination.limit, sorting]);

  return (
    <div className="flex bg-[#3d414e] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 h-full">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <p className="text-slate-400">Manage and view all your financial transactions</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <button
                  onClick={fetchTransactions}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  disabled={transactions.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters Section - You'll create this component next */}
          {showFilters && (
            <TransactionFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Transactions Table - You'll create this component next */}
          <TransactionTable
            transactions={transactions}
            loading={loading}
            pagination={pagination}
            sorting={sorting}
            onPageChange={handlePageChange}
            onSort={handleSort}
            onPageSizeChange={handlePageSizeChange}
          />
        </main>
      </div>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={exportCSV}
        loading={exporting}
      />
    </div>
  );
};

export default Transactions;
