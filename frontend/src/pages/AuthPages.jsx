import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [mounted, setMounted] = useState(false);

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
                {[...Array(15)].map((_, i) => (
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

                {/* Auth Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* Tab Switcher */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 inline-flex">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        isLogin
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                    }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        !isLogin
                                            ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg transform scale-105'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* Form Container */}
                        <div className="relative">
                            <div className={`transition-all duration-500 ${
                                isLogin ? 'opacity-100 transform-none' : 'opacity-0 transform translate-x-full absolute inset-0'
                            }`}>
                                {isLogin && <LoginForm state={setIsLogin} />}
                            </div>
                            <div className={`transition-all duration-500 ${
                                !isLogin ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-x-full absolute inset-0'
                            }`}>
                                {!isLogin && <RegisterForm state={setIsLogin} />}
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="mt-12 max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                                    Why Choose LinkShrink?
                                </h3>
                                <p className="text-gray-600">Join thousands of users who trust us with their links</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="group">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Lightning Fast</h4>
                                        <p className="text-gray-600 text-sm">Generate short URLs in milliseconds with our optimized infrastructure</p>
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Smart Analytics</h4>
                                        <p className="text-gray-600 text-sm">Track clicks, locations, and performance with detailed insights</p>
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Secure & Reliable</h4>
                                        <p className="text-gray-600 text-sm">Enterprise-grade security with 99.9% uptime guarantee</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div className="mt-12 max-w-2xl mx-auto">
                            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <div className="flex justify-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 italic mb-4">
                                        "LinkShrink has transformed how we share content. The analytics are incredibly detailed and the interface is beautiful!"
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-white font-semibold text-sm">SJ</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Sarah Johnson</p>
                                            <p className="text-sm text-gray-600">Marketing Director, TechCorp</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-6 text-center text-gray-500 relative z-10">
                    <p className="text-sm">&copy; 2024 LinkShrink. All rights reserved.</p>
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

export default AuthPage;