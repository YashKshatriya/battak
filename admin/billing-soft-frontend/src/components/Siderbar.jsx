import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Coffee, ClipboardList, ShoppingCart, ChevronRight, Menu, X } from 'lucide-react';
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BsCardList } from "react-icons/bs"; // For RealTimeOrders icon

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <Home size={20} />, text: 'Dashboard', path: '/dashboard' },
    { icon: <BsCardList size={20} />, text: 'Real-Time Orders', path: '/real-time-orders' }, // Added RealTimeOrders below Dashboard
    { icon: <Users size={20} />, text: 'Customers', path: '/customers' },
    { icon: <Coffee size={20} />, text: 'Menu Editor', path: '/menu-editor' },
    { icon: <ClipboardList size={20} />, text: 'Order History', path: '/order-history' },
    { icon: <ShoppingCart size={20} />, text: 'Orders', path: '/orders' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    }; 

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="block md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg hover:bg-blue-900 transition-colors"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className={`p-5 ${isExpanded ? 'px-6' : 'px-4'}`}>
        <div className="flex items-center space-x-3 ml-2">
          {/* Icon (Always visible when collapsed or in mobile view) */}
          <MdOutlineRestaurantMenu 
            className={`text-white text-3xl transition-transform duration-300 ${isExpanded ? 'scale-100' : 'scale-100'}`}
          />
          {/* Sidebar Title (Hidden when collapsed and not in mobile view) */}
          <span
            className={`text-white ml-1 font-bold text-xl overflow-hidden transition-all duration-300 ${
              isExpanded || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            }`}
          >
            BaatTak
          </span>
        </div>
      </div>

      <nav className={`mt-8 ${isExpanded ? 'px-4' : 'px-2'} flex-grow`}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleMobileLinkClick}
                className={`
                  flex items-center px-3 py-3 text-white rounded-lg
                  hover:bg-blue-900/30 transition-all duration-300 ease-in-out
                  group/item relative
                  ${isExpanded || isMobile ? 'space-x-3' : 'justify-center'}
                `}
              >
                <div className="flex-shrink-0 w-5 h-5">{item.icon}</div>
                <span 
                  className={`whitespace-nowrap transition-all duration-300
                    ${isExpanded || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}
                  `}
                >
                  {item.text}
                </span>
                {!isExpanded && !isMobile && (
                  <div className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {item.text}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-4 ${isExpanded ? 'px-6' : 'px-4'} mt-auto`}>
        <div className={`py-2 px-3 bg-blue-900/30 rounded-lg text-white text-sm transition-all duration-300 ${isExpanded || isMobile ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-medium">Pro Version</p>
          {(isExpanded || isMobile) && <p className="text-xs text-white/80 mt-1">Access all features</p>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileMenuButton />

      {/* Sidebar for larger screens */}
      <div 
        className={`hidden md:block
          ${isExpanded ? 'w-64' : 'w-20'} 
          h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900
          shadow-xl transition-all duration-300 ease-in-out relative group
          flex flex-col justify-between
        `}
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-8 bg-white p-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ChevronRight 
            size={16} 
            className={`text-blue-900 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`
            w-64 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900
            transform transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          onClick={e => e.stopPropagation()}
        >
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
