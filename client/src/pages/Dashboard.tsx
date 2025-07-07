
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/SummaryCards';
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import RecentTransactions from "../components/RecentTransactions";
import CategoryBreakdownChart from '../components/CategoryBreakdownChart';
import TopUsersCard from '../components/TopUsersCard';
import { transactionAPI } from '../api';

const Dashboard = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => transactionAPI.getAnalytics(),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  return (
    <div className="flex h-screen bg-[#3d414e]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto ">
          <div className="p-6">
            {/* Summary Cards */}
            <SummaryCards />
            
            {/* Charts and Top Users Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 mt-6">
              {/* Income/Expense Chart */}
              <div className="lg:col-span-3">
                <IncomeExpenseChart />
              </div>
              
              {/* Top Users Card - takes 2/5 of the width */}
              <div className="lg:col-span-2">
                <TopUsersCard 
                  users={analyticsData?.topUsers || []}
                  isLoading={isLoading}
                />
              </div>
            </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions - takes 50% width */}
              <div>
                <RecentTransactions />
              </div>
              
              {/* Category Breakdown Chart - takes 50% width */}
              <div>
                <CategoryBreakdownChart />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
