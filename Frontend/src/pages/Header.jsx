import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Heart, Clapperboard, Users, X, Menu, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const navItems = [
    {
      path: "/",
      name: "Home",
      icon: <Home className="w-5 h-5" />
    },
    {
      path: "/character",
      name: "Character",
      icon: <User className="w-5 h-5" />,
      authRequired: true
    },
    {
      path: "/match",
      name: "Match",
      icon: <Heart className="w-5 h-5" />,
      authRequired: true
    },
    {
      path: "/connections",
      name: "Connections",
      icon: <Users className="w-5 h-5" />,
      authRequired: true
    },
    {
      path: currentUser ? "/profile" : "/login",
      name: currentUser ? "Profile" : "Login",
      icon: currentUser ? <Clapperboard className="w-5 h-5" /> : <LogIn className="w-5 h-5" />
    }
  ];

  // Filter nav items based on authentication
  const filteredNavItems = navItems.filter(item => !item.authRequired || currentUser);

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
            {filteredNavItems.map((item) => (
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
            {currentUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-amber-300 transition-colors duration-300"
              >
                Logout
              </button>
            )}
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-gray-800 text-amber-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
              {currentUser && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;