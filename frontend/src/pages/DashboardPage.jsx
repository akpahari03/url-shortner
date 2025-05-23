import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UrlForm from '../components/UrlForm';
import UserUrl from '../components/UserUrl';
import { useQuery } from '@tanstack/react-query';
import { getAllUserUrls } from '../api/user.api';

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { user } = useSelector((state) => state.auth);
  
  // Get user's URLs for statistics
  const { data: urlsData } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate statistics
  const stats = {
    totalLinks: urlsData?.urls?.length || 0,
    totalClicks: urlsData?.urls?.reduce((sum, url) => sum + (url.clicks || 0), 0) || 0,
    activeLinks: urlsData?.urls?.filter(url => (url.clicks || 0) > 0).length || 0,
    avgClicksPerLink: urlsData?.urls?.length > 0 
      ? Math.round((urlsData.urls.reduce((sum, url) => sum + (url.clicks || 0), 0) / urlsData.urls.length) * 10) / 10 
      : 0
  };

  const statsCards = [
    { 
      label: 'Total Links', 
      value: stats.totalLinks.toLocaleString(), 
      change: '+12%', 
      color: 'blue', 
      icon: '🔗',
      description: 'URLs created'
    },
    { 
      label: 'Total Clicks', 
      value: stats.totalClicks.toLocaleString(), 
      change: '+24%', 
      color: 'green', 
      icon: '👆',
      description: 'Clicks received'
    },
    { 
      label: 'Active Links', 
      value: stats.activeLinks.toLocaleString(), 
      change: '+8%', 
      color: 'purple', 
      icon: '⚡',
      description: 'Links with clicks'
    },
    { 
      label: 'Avg. Clicks', 
      value: stats.avgClicksPerLink.toString(), 
      change: '+5.2%', 
      color: 'orange', 
      icon: '📊',
      description: 'Per link'
    }
  ];

  // Get recent activity
  const recentActivity = urlsData?.urls?.slice(0, 5).map(url => ({
    action: 'Link created',
    url: `localhost:3000/${url.short_url}`,
    time: 'Recently',
    clicks: url.clicks || 0
  })) || [];

  // Get top performing links
  const topPerforming = urlsData?.urls?.sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation Spacer */}
        <div className="h-16"></div>

        {/* Dashboard Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {user?.name || 'User'}! 👋
                  </h1>
                  <p className="text-lg text-gray-600">Here's what's happening with your links today.</p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-lg hover:bg-white/80 transition-all duration-300 border border-white/20"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        Overview
                      </span>
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Link
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{stat.icon}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        stat.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        stat.color === 'green' ? 'bg-green-100 text-green-700' :
                        stat.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 inline-flex">
                {[
                  { id: 'overview', label: 'Overview', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
                  { id: 'links', label: 'My Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
                  { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* URL Form Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Create Short Link</h2>
                        <p className="text-gray-600">Transform your long URLs into powerful short links</p>
                      </div>
                    </div>
                    
                    <UrlForm />
                  </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                  {/* Recent Activity */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                            <p className="text-xs text-gray-500 truncate">{activity.url}</p>
                          </div>
                          <span className="text-xs text-gray-400">{activity.clicks} clicks</span>
                        </div>
                      )) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Performing Links */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Top Performing
                    </h3>
                    <div className="space-y-3">
                      {topPerforming.length > 0 ? topPerforming.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">localhost:3000/{link.short_url}</p>
                            <p className="text-xs text-gray-500 truncate">{link.full_url}</p>
                          </div>
                          <span className="text-sm font-bold text-green-600 ml-2">{link.clicks} clicks</span>
                        </div>
                      )) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">No data yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <UserUrl />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Click Analytics Chart */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Click Analytics
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-8 text-center border">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-600 font-medium">Chart visualization</p>
                    <p className="text-gray-500 text-sm">Click trends over time</p>
                  </div>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Geographic Distribution
                  </h3>
                  <div className="space-y-3">
                    {[
                      { country: '🇺🇸 United States', percentage: 45, color: 'blue' },
                      { country: '🇬🇧 United Kingdom', percentage: 22, color: 'green' },
                      { country: '🇨🇦 Canada', percentage: 18, color: 'purple' },
                      { country: '🇦🇺 Australia', percentage: 15, color: 'orange' }
                    ].map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{country.country}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                country.color === 'blue' ? 'bg-blue-500' :
                                country.color === 'green' ? 'bg-green-500' :
                                country.color === 'purple' ? 'bg-purple-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${country.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{country.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Analytics */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Device Breakdown
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { device: 'Desktop', percentage: 52, icon: '💻' },
                      { device: 'Mobile', percentage: 38, icon: '📱' },
                      { device: 'Tablet', percentage: 10, icon: '📱' }
                    ].map((device, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-xl border">
                        <div className="text-2xl mb-2">{device.icon}</div>
                        <div className="text-2xl font-bold text-gray-800">{device.percentage}%</div>
                        <div className="text-sm text-gray-600">{device.device}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referral Sources */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Top Referrers
                  </h3>
                  <div className="space-y-3">
                    {[
                      { source: 'Direct/None', visits: stats.totalClicks > 0 ? Math.floor(stats.totalClicks * 0.67) : 0, color: 'gray' },
                      { source: 'Twitter', visits: stats.totalClicks > 0 ? Math.floor(stats.totalClicks * 0.18) : 0, color: 'blue' },
                      { source: 'Facebook', visits: stats.totalClicks > 0 ? Math.floor(stats.totalClicks * 0.15) : 0, color: 'indigo' }
                    ].map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm font-medium text-gray-700">{source.source}</span>
                        <span className="text-sm font-bold text-gray-800">{source.visits} visits</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;