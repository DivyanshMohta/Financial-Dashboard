/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { TrendingUp, Calendar, Tag, DollarSign, CheckCircle, Clock } from "lucide-react";

interface Transaction { 
  _id: string; 
  date: string; 
  category: string; 
  amount: number; 
  status: string; 
}

const RecentTransactions: React.FC = () => { 
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    const fetchTransactions = async () => { 
      setLoading(true); 
      setError(null); 
      try { 
        const token = localStorage.getItem("token"); 
        const res = await fetch("/api/transactions?limit=5&sortBy=date&order=desc", { 
          headers: token ? { Authorization: `Bearer ${token}` } : {}, 
        }); 
        if (!res.ok) throw new Error("Failed to fetch transactions"); 
        const data = await res.json(); 
        setTransactions(data.data || []); 
      } catch (err) { 
        setError("Failed to load recent transactions."); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    fetchTransactions(); 
  }, []);

  if (loading) return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50 mt-6">
      <div className="flex items-center justify-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
        <div className="text-slate-300 font-medium">Loading recent transactions...</div>
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

  if (!transactions.length) return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50 mt-6">
      <div className="text-center">
        <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
        <div className="text-slate-400 font-medium">No recent transactions found.</div>
      </div>
    </div>
  );

  return ( 
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700/50 mt-6 backdrop-blur-sm"> 
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
      </div>
      
      <div className="space-y-3">
        {transactions.map((tx, index) => ( 
          <div 
            key={tx._id} 
            className="group relative bg-slate-800/60 hover:bg-slate-700/80 rounded-xl p-4 transition-all duration-25 hover:shadow-lg hover:shadow-blue-500/10 border border-slate-700/30 hover:border-slate-600/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center space-y-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(tx.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div className="h-8 w-px bg-slate-600"></div>
                
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-200 font-medium">{tx.category}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xl font-bold text-white">
                    ${tx.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {tx.status === "Paid" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.status === "Paid" 
                      ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                      : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Subtle hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {/* Bottom gradient accent */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
    </div> 
  ); 
};

export default RecentTransactions;