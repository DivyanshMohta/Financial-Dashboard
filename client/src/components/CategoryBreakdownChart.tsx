/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon, TrendingUp, TrendingDown } from "lucide-react";

const COLORS = ["#22c55e", "#facc15"];

interface RevenueExpense {
  _id: string;
  total: number;
}

const CategoryBreakdownChart: React.FC = () => {
  const [data, setData] = useState<RevenueExpense[]>([]);
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
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const result = await res.json();
        setData(result.revenueExpenses || []);
      } catch (err) {
        setError("Failed to load category breakdown.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);

  if (loading) return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50 mt-6">
      <div className="flex items-center justify-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent"></div>
        <div className="text-slate-300 font-medium">Loading breakdown...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gradient-to-br from-red-900/20 to-slate-800 rounded-2xl p-8 shadow-2xl border border-red-500/30 mt-6">
      <div className="flex items-center space-x-3 text-red-400">
        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        </div>
        <div className="font-medium">{error}</div>
      </div>
    </div>
  );

  if (!data.length) return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50 mt-6">
      <div className="text-center">
        <PieIcon className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
        <div className="text-slate-400 font-medium">No data for breakdown.</div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-3 shadow-2xl">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            ></div>
            <span className="text-slate-200 font-medium">{data.name}</span>
          </div>
          <div className="text-white font-bold text-lg mt-1">
            ${data.value.toLocaleString()}
          </div>
          <div className="text-slate-400 text-sm">
            {((data.value / totalAmount) * 100).toFixed(1)}% of total
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center space-x-6 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {entry.value === "Revenue" ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-yellow-400" />
              )}
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
            </div>
            <span className={`font-semibold ${
              entry.value === "Revenue" ? "text-green-400" : "text-yellow-400"
            }`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700/50 mt-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <PieIcon className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Category Breakdown</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Amount</div>
          <div className="text-lg font-bold text-white">
            ${totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <Pie
              data={data}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={45}
              paddingAngle={3}
              label={({percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
              style={{ filter: "url(#glow)" }}
            >
              {data.map((_entry, idx) => (
                <Cell 
                  key={`cell-${idx}`} 
                  fill={COLORS[idx % COLORS.length]}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom gradient accent */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
    </div>
  );
};

export default CategoryBreakdownChart;