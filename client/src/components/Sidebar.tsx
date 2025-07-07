import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ListOrdered,
  LogOut,
  User,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Transactions', path: '/transactions', icon: <ListOrdered className="w-5 h-5" /> },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[213.16px] bg-[#1A1C22] text-white flex flex-col ">
      {/* Logo and Name */}
      <div className="flex items-center gap-1 m-6 px-6 py-6 flex-shrink-0">
        <div>
          <svg width="27" height="29" viewBox="0 0 27 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M21.6016 5.17785H10.0906V0.294373L26.4851 0.294373V16.6889H21.6016V5.17785Z" fill="#FFC01E"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12.6101 14.8951C11.8643 14.3968 10.9876 14.1309 10.0907 14.1309V9.24741C11.9535 9.24741 13.7744 9.79977 15.3232 10.8346C16.872 11.8695 18.0791 13.3404 18.792 15.0614C19.5048 16.7823 19.6913 18.676 19.3279 20.5029C18.9645 22.3299 18.0675 24.008 16.7504 25.3252C15.4332 26.6423 13.7551 27.5393 11.9281 27.9027C10.1012 28.2661 8.20751 28.0796 6.48657 27.3668C4.76563 26.6539 3.29472 25.4468 2.25984 23.898C1.22496 22.3492 0.672604 20.5283 0.672607 18.6655L5.55609 18.6655C5.55608 19.5624 5.82204 20.4391 6.32031 21.1849C6.81858 21.9306 7.5268 22.5118 8.3554 22.855C9.184 23.1982 10.0958 23.288 10.9754 23.1131C11.855 22.9381 12.663 22.5062 13.2972 21.872C13.9314 21.2379 14.3633 20.4299 14.5383 19.5502C14.7132 18.6706 14.6234 17.7588 14.2802 16.9302C13.937 16.1016 13.3558 15.3934 12.6101 14.8951Z" fill="#1FCB4F"/>
          </svg>
        </div>
        <span className="text-[33px] font-bold-600">Penta</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-teal-500/20 text-teal-400 border-l-4 border-teal-400 shadow-lg shadow-teal-500/20'
                : 'hover:bg-blue-700 hover:text-white text-gray-300'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Section - Bottom of Sidebar */}
      <div className="px-2 pb-4 space-y-2 flex-shrink-0">
        {/* Divider */}
        <div className="border-t border-gray-700 my-2"></div>
        
        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-2 text-gray-300">
          <User className="w-5 h-5" />
          <span className="text-sm truncate">{user?.username}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-300 hover:bg-red-600/20 hover:text-red-400 hover:border-l-4 hover:border-red-400"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;