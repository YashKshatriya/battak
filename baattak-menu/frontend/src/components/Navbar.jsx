import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaHeart, FaPlusCircle, FaUtensils, FaLayerGroup, FaCandyCane, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useCart } from './CartContext'; // Assuming useCart is from your CartContext

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart(); // Access the cart from the CartContext
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
    console.log(cart);
}, [cart]);         

  const navItems = [
    { to: "/favorites", icon: FaHeart, label: "Favorites" },
    { to: "/new", icon: FaPlusCircle, label: "New" },
    { to: "/lunch", icon: FaUtensils, label: "Lunch" },
    { to: "/combo", icon: FaLayerGroup, label: "Combo" },
    { to: "/sweet", icon: FaCandyCane, label: "Sweet" },
    { to: "/accepted-orders", icon: FaShoppingCart, label: "My Orders" }, // Renamed link
  ];

  const handleLogoClick = () => {
    setIsOpen(false); // Close the hamburger menu
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <nav className="bg-gradient-to-r from-[#F4E1D2] via-[#E1D4C1] to-[#F4E1D2] shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo for both mobile and desktop */}
          <div className="flex items-center ml-3">
            <Link 
              to="/" 
              className="transition-all duration-300"
              onClick={handleLogoClick}
            >
              <img src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center">
            {isAuthenticated && (
              <div className="flex space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#987284]/10 rounded-lg"
                    onClick={() => setIsOpen(false)} // Close the menu when clicking a link
                  >
                    <div className="relative flex items-center space-x-2">
                      <item.icon className="w-5 h-5 text-[#6E493A] transition-all duration-300 ease-in-out group-hover:text-[#987284] group-hover:scale-110" />
                      <span className="text-[#6E493A] group-hover:text-[#987284] transition-all duration-300">
                        {item.label}
                      </span>
                      <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#987284] transition-all duration-300 group-hover:w-full" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Only show Logout if authenticated, nothing if not */}
            <div className="flex space-x-4 ml-8">
              {isAuthenticated && (
                <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-[#6E493A] hover:text-[#987284] transition-all duration-300">Logout</button>
              )}
            </div>
          </div>

          {/* Cart icon only if authenticated */}
          {isAuthenticated && (
            <div className="flex items-center">
              <Link to="/AddToCart" className="relative">
                <FaShoppingCart className="w-6 h-6 text-[#6E493A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div
          className={`${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } md:hidden fixed inset-y-0 left-0 w-64 bg-[#F4E1D2] transform transition-all duration-300 ease-in-out z-50`}
        >
          {/* Logo in mobile menu aligned to the left */}
          <div className="flex items-center pt-4 px-4 ml-3">
            <Link 
              to="/" 
              className="transition-all duration-300"
              onClick={handleLogoClick}
            >
              <img src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
            </Link>
          </div>

          {/* Mobile navigation items */}
          {isAuthenticated && (
            <div className="pt-6 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center space-x-3 px-4 py-3 text-sm font-medium text-[#6E493A] hover:bg-[#987284]/10 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)} // Close the menu when clicking a link
                >
                  <item.icon className="w-5 h-5 text-[#6E493A] group-hover:text-[#987284] transition-colors duration-300" />
                  <span className="group-hover:text-[#987284] transition-colors duration-300">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {/* Only show Logout if authenticated, nothing if not */}
          <div className="pt-6 px-4">
            {isAuthenticated && (
              <button onClick={() => { setIsOpen(false); handleLogout(); }} className="block px-4 py-3 text-sm font-medium text-[#6E493A] hover:bg-[#987284]/10 rounded-lg transition-all duration-300">Logout</button>
            )}
          </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-[#2B1C10]/20 md:hidden z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
