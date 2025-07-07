const Header = () => {
  return (
    <header className="w-full bg-[#1A1C22] shadow flex items-center justify-between px-6 py-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-[19.98px] font-bold text-white ">Dashboard</span>
      </div>
      {/* Search Bar */}
      
      <div className="flex items-center gap-4 ">
      <form className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none 
            focus:ring-2 focus:ring-blue-200 bg-[#282C35] text-[#9E9E9E]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="25" y1="25" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </form>

        {/* Notification bell */}
        <button className="relative">
          <span className="sr-only">Notifications</span>
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        {/* User avatar */}
        <div className="w-[33.31px] h-[33.31px] rounded-[8.83px] bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
          <img className=" rounded-[8.83px]" src="/05ee48aade7b6e9524212508334e50ea61c70030.jpg" alt="Profile" />
        </div>
      </div>
    </header>
  );

};

export default Header;