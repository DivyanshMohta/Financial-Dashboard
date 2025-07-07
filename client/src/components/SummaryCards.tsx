/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

// Helper to map month number to name
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthlyTrend {
  _id: { year: number; month: number };
  revenue: number;
  expenses: number;
}

const SummaryCards: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/transactions/analytics", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        const trends: MonthlyTrend[] = result.monthlyTrends || [];

        // Find all years present in the data
        const years = Array.from(new Set(trends.map(item => item._id.year))).sort((a, b) => b - a);
        const displayYear = years[0] || new Date().getFullYear();

        // Creates a map for quick lookup by month for the displayYear
        const trendMap = new Map(
          trends
            .filter(item => item._id.year === displayYear)
            .map(item => [item._id.month, item])
        );

        const formatted = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const trend = trendMap.get(month);
          return {
            name: `${MONTHS[i]} ${displayYear}`,
            Income: trend ? trend.revenue : 0,
            Expenses: trend ? trend.expenses : 0,
          };
        });
        setData(formatted);
      } catch (err: unknown) {
        let message = "Failed to load financial data.";
        if (err instanceof Error) message = err.message;
        setError(message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Calculate summary statistics
  const totalIncome = data.reduce((sum, item) => sum + item.Income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.Expenses, 0);
  const netBalance = totalIncome - totalExpenses;
  const avgIncome = data.length > 0 ? totalIncome / 12 : 0;
  const avgExpenses = data.length > 0 ? totalExpenses / 12 : 0;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-center h-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <p className="text-slate-300 text-sm">Loading financial summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Financial Summary
          </h2>
        </div>
        <p className="text-slate-400 text-sm">Your financial overview at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-sm font-medium">Total Income</p>
              <p className="text-white text-xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-sm font-medium">Total Expenses</p>
              <p className="text-white text-xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        
        <div className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20' : 'from-red-500/10 to-red-600/10 border-red-500/20'} border rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'} text-sm font-medium`}>Net Balance</p>
              <p className="text-white text-xl font-bold">${netBalance.toLocaleString()}</p>
            </div>
            {netBalance >= 0 ? 
              <TrendingUp className="w-8 h-8 text-emerald-400" /> : 
              <TrendingDown className="w-8 h-8 text-red-400" />
            }
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div>
            <p className="text-blue-400 text-sm font-medium">Avg Monthly</p>
            <div className="flex flex-col space-y-1 mt-1">
              <span className="text-white text-sm">Income: ${avgIncome.toLocaleString()}</span>
              <span className="text-white text-sm">Expenses: ${avgExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;