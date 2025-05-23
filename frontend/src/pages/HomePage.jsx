import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@tanstack/react-router';
import UrlForm from '../components/UrlForm';

const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-blue-400/30 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Spacer */}
        <div className="h-16"></div>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading */}
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Shorten
                </span>
                <br />
                <span className="text-gray-800">Any URL</span>
                <br />
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
                Transform your long, complex URLs into short, memorable links that are perfect for sharing across social media, emails, and more.
              </p>

              {/* Call to Action for Non-Authenticated Users */}
              {!isAuthenticated && (
                <div className="mb-8">
                  <Link
                    to="/auth"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="mr-2">Get Started Free</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <p className="text-gray-500 text-sm mt-3">No credit card required • Free forever</p>
                </div>
              )}
            </div>

            {/* URL Form Container */}
            <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Glowing Background */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                  
                  {/* Form Container */}
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Try It Now
                      </h2>
                      <p className="text-gray-600">
                        Paste your long URL below and see the magic happen
                      </p>
                    </div>
                    
                    <UrlForm />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mt-20">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose LinkShrink?</h3>
                <p className="text-gray-600 mb-12 text-lg">Everything you need to manage your links professionally</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="group">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">Lightning Fast</h4>
                      <p className="text-gray-600">Generate short URLs in milliseconds with our optimized infrastructure and global CDN</p>
                    </div>
                  </div>

                  <div className="group">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">Smart Analytics</h4>
                      <p className="text-gray-600">Track clicks, locations, devices, and performance with detailed insights and reports</p>
                    </div>
                  </div>

                  <div className="group">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">Secure & Reliable</h4>
                      <p className="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee and data protection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className={`transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mt-20">
                <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
                      <div className="text-gray-600">Links Created</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-purple-600 mb-2">500K+</div>
                      <div className="text-gray-600">Happy Users</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
                      <div className="text-gray-600">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mt-20">
                <h3 className="text-3xl font-bold text-gray-800 mb-12">Advanced Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Custom Slugs</h4>
                      <p className="text-gray-600 text-sm">Create branded, memorable short links with custom slugs</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Team Collaboration</h4>
                      <p className="text-gray-600 text-sm">Share and manage links with your team members</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">API Access</h4>
                      <p className="text-gray-600 text-sm">Integrate with your apps using our powerful REST API</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">QR Codes</h4>
                      <p className="text-gray-600 text-sm">Generate QR codes for your short links automatically</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mt-20 p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-3xl border border-blue-200/50">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
                <p className="text-lg text-gray-600 mb-6">Join thousands of users who trust LinkShrink for their URL shortening needs</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Go to Dashboard
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Start Free Trial
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <button className="px-8 py-4 bg-white/80 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        View Pricing
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500">
          <div className="max-w-6xl mx-auto px-4">
            <div className="border-t border-gray-200 pt-8">
              <p>&copy; 2024 LinkShrink. All rights reserved. Made with ❤️ for the web.</p>
              <div className="mt-4 flex justify-center space-x-6 text-sm">
                <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
                <a href="#" className="hover:text-gray-700 transition-colors">API Docs</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;