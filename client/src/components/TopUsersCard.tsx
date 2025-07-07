import { Users, TrendingUp, Award, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopUser {
  _id: string;
  total: number;
  count: number;
}

interface TopUsersCardProps {
  users: TopUser[];
  isLoading?: boolean;
}

const TopUsersCard = ({ users, isLoading }: TopUsersCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700/50 animate-pulse">
        <div className="h-6 bg-slate-700/50 rounded-lg w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-700/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Award className="w-5 h-5 text-yellow-400 drop-shadow-lg" />;
      case 1: return <Award className="w-5 h-5 text-slate-300 drop-shadow-lg" />;
      case 2: return <Award className="w-5 h-5 text-orange-400 drop-shadow-lg" />;
      default: return <span className="text-sm font-bold text-slate-300 bg-slate-700/50 rounded-full w-6 h-6 flex items-center justify-center border border-slate-600/50">#{rank + 1}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0: return 'bg-gradient-to-br from-yellow-900/20 via-amber-900/15 to-yellow-800/20 border-yellow-500/30';
      case 1: return 'bg-gradient-to-br from-slate-700/30 via-slate-600/20 to-slate-700/30 border-slate-500/30';
      case 2: return 'bg-gradient-to-br from-orange-900/20 via-amber-900/15 to-orange-800/20 border-orange-500/30';
      default: return 'bg-gradient-to-br from-slate-800/30 via-slate-700/20 to-slate-800/30 border-slate-600/30';
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 0: return 'shadow-lg shadow-yellow-500/10';
      case 1: return 'shadow-lg shadow-slate-400/10';
      case 2: return 'shadow-lg shadow-orange-500/10';
      default: return 'shadow-md shadow-slate-500/5';
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700/50 h-full"
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">
            Top Users
          </h3>
          <p className="text-sm text-slate-400 font-medium">Transaction Leaders</p>
        </div>
        <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold text-green-300">Live</span>
        </div>
      </div>
      
      {/* User List */}
      <div className="space-y-4">
        {users.slice(0, 5).map((user, index) => (
          <motion.div 
            key={user._id} 
            className={`relative flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm ${getRankColor(index)} ${getRankGlow(index)} hover:shadow-lg hover:border-slate-500/40 transition-all duration-300`}
            whileHover={{ scale: 1.02, x: 4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            {/* Rank Badge */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-8 h-8">
                {index < 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-sm"></div>
                )}
                <div className="relative">
                  {getRankIcon(index)}
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-100 text-base truncate max-w-32">
                    {user._id}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity className="w-3 h-3" />
                  <p className="text-sm font-medium">{user.count} transactions</p>
                </div>
              </div>
            </div>
            
            {/* Amount */}
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <p className="font-bold text-slate-100 text-lg">
                  {user.total.toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-slate-500 font-medium">Total Value</p>
            </div>

            {/* Decorative gradient line for top 3 */}
            {index < 3 && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Empty State */}
      {users.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-slate-600/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6 rounded-full shadow-lg mx-auto w-20 h-20 flex items-center justify-center border border-slate-600/30">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          <h4 className="font-bold text-slate-300 mb-2">No Data Available</h4>
          <p className="text-sm text-slate-500">User transaction data will appear here</p>
        </motion.div>
      )}

      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-b-2xl"></div>
    </motion.div>
  );
};

export default TopUsersCard;