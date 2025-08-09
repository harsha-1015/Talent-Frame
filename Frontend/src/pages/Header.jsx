import { Link, useLocation } from 'react-router-dom';
import { Home, User, Heart, Clapperboard, Users, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    {
      path: "/",
      name: "Home",
      icon: <Home className="w-5 h-5" />
    },
    {
      path: "/character",
      name: "Character",
      icon: <User className="w-5 h-5" />
    },
    {
      path: "/match",
      name: "Match",
      icon: <Heart className="w-5 h-5" />
    },
    {
      path: "/connections",
      name: "Connections",
      icon: <Users className="w-5 h-5" />
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <Clapperboard className="w-5 h-5" />
    }
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="text-xl font-bold text-white flex items-center">
              <Clapperboard className="w-6 h-6 mr-2 text-amber-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                TalentFrame
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-amber-400'
                    : 'text-gray-400 hover:text-amber-300'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="header-underline"
                    className="absolute left-0 top-full block h-0.5 w-full bg-amber-400"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="flex items-center space-x-2 group">
                  <div className={`transition-colors duration-300 ${
                    location.pathname === item.path ? 'text-amber-400' : 'text-gray-400 group-hover:text-amber-300'
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-amber-400 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-amber-400/10 text-amber-400'
                      : 'text-gray-400 hover:bg-amber-400/10 hover:text-amber-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${
                      location.pathname === item.path ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;