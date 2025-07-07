/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { TrendingDown, BarChart3 } from "lucide-react";

// Helper to map month number to name
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthlyTrend {
  _id: { year: number; month: number };
  revenue: number;
  expenses: number;
}

const IncomeExpenseChart: React.FC = () => {
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
        let message = "Failed to load chart data.";
        if (err instanceof Error) message = err.message;
        setError(message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            <p className="text-slate-300 text-lg">Loading trend analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg font-medium">{error}</p>
            <p className="text-slate-400 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Financial Trends
          </h2>
        </div>
        <p className="text-slate-400 text-sm">Track your income and expenses over time</p>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          Monthly Trend Analysis
        </h3>
        
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ 
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", 
                border: "1px solid #475569", 
                borderRadius: "12px", 
                color: "#fff",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`, 
                name
              ]}
              labelStyle={{ color: "#e2e8f0", fontWeight: "600" }}
            />
            <Legend
              verticalAlign="top"
              iconType="circle"
              wrapperStyle={{ 
                color: "#fff", 
                paddingBottom: "20px",
                fontSize: "14px",
                fontWeight: "500"
              }}
            />
            <Line
              type="monotone"
              dataKey="Income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ 
                r: 8, 
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 3,
                filter: "drop-shadow(0 0 6px #10b981)"
              }}
              fill="url(#incomeGradient)"
            />
            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 6, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ 
                r: 8, 
                fill: "#f59e0b",
                stroke: "#fff",
                strokeWidth: 3,
                filter: "drop-shadow(0 0 6px #f59e0b)"
              }}
              fill="url(#expenseGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;