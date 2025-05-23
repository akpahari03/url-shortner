import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import { logoutUser } from '../api/user.api';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      dispatch(logout());
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg' 
        : 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center group">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                  scrolled ? '' : 'text-white'
                } transition-colors duration-300`}>
                  LinkShrink
                </h1>
                <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-blue-100'} transition-colors duration-300`}>
                  Smart URL Shortener
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Profile */}
                <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className={`text-sm font-semibold ${scrolled ? 'text-white' : 'text-white'}`}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'} transition-colors duration-300`}>
                    Welcome, {user?.name || 'User'}
                  </span>
                </div>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  } font-medium`}
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="group relative px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Logging out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Get Started</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
        }`}>
          <div className="pt-4 space-y-3 border-t border-white/20">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name || 'User'}</p>
                    <p className="text-blue-100 text-sm">Authenticated User</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-4 py-3 text-white hover:bg-red-500/20 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;