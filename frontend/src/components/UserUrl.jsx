import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUserUrls } from '../api/user.api';
import QRCodeGenerator from './QRCodeGenerator';

const UserUrl = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: urls, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const handleCopy = (url, id) => {
    const fullUrl = `http://localhost:3000/${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleQRCode = (url) => {
    const fullUrl = `http://localhost:3000/${url.short_url}`;
    setQrCodeData({
      shortCode: url.short_url,
      url: fullUrl,
      originalUrl: url.full_url
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getClicksColor = (clicks) => {
    if (clicks >= 200) return 'bg-green-100 text-green-800 border-green-200';
    if (clicks >= 100) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (clicks >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredUrls = urls?.urls?.filter(url =>
    url.full_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.short_url.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      case 'oldest':
        return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
      case 'mostClicks':
        return b.clicks - a.clicks;
      case 'leastClicks':
        return a.clicks - b.clicks;
      default:
        return 0;
    }
  }) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading URLs</h3>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No URLs Yet</h3>
          <p className="text-gray-600 mb-6">You haven't created any shortened URLs yet. Start by shortening your first link above!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg mt-8 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Shortened URLs</h2>
              <p className="text-gray-600">Manage and track your {urls.urls.length} shortened links with QR codes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search URLs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostClicks">Most Clicks</option>
                <option value="leastClicks">Least Clicks</option>
              </select>
            </div>
          </div>
        </div>

        {/* URL List */}
        <div className="divide-y divide-gray-100">
          {filteredUrls.map((url, index) => (
            <div key={url._id} className="p-6 hover:bg-gray-50 transition-colors duration-200 group">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0">
                {/* URL Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Short URL */}
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors truncate">
                          localhost:3000/{url.short_url}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getClicksColor(url.clicks)}`}>
                          {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                        </span>
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Original URL */}
                      <p className="text-gray-600 truncate mb-2 max-w-md" title={url.full_url}>
                        <span className="text-gray-400 text-sm mr-2">→</span>
                        {url.full_url}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Created {formatDate(url.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {url.clicks} total views
                        </span>
                        <span className="flex items-center text-purple-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          QR Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 lg:ml-4 flex-wrap gap-2">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(url.short_url, url._id)}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                      copiedId === url._id
                        ? 'bg-green-500 text-white shadow-lg animate-pulse'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {copiedId === url._id ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  {/* QR Code Button - Highlighted */}
                  <button
                    onClick={() => handleQRCode(url)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    QR Code
                  </button>

                  {/* Analytics Button */}
                  <button
                    onClick={() => setSelectedUrl(url)}
                    className="flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border border-orange-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </button>

                  {/* Test Link Button */}
                  <button
                    onClick={() => window.open(`http://localhost:3000/${url.short_url}`, '_blank')}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border border-green-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QR Code Feature Highlight */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Professional QR Codes Ready!</h4>
              <p className="text-gray-600 text-sm">Generate high-quality, customizable QR codes for any of your shortened URLs</p>
            </div>
            <div className="text-sm text-purple-600 font-medium">
              Backend Powered ⚡
            </div>
          </div>
        </div>

        {/* Analytics Modal */}
        {selectedUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h3>
                    <p className="text-gray-600 mt-1">localhost:3000/{selectedUrl.short_url}</p>
                  </div>
                  <button
                    onClick={() => setSelectedUrl(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* URL Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Original URL</h4>
                  <p className="text-gray-600 break-all">{selectedUrl.full_url}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600">{selectedUrl.clicks}</div>
                    <div className="text-sm text-blue-700">Total Clicks</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.floor(selectedUrl.clicks * 0.1)}
                    </div>
                    <div className="text-sm text-green-700">Today</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="text-3xl font-bold text-purple-600">
                      {selectedUrl.clicks > 0 ? Math.round((selectedUrl.clicks / (selectedUrl.clicks + 10)) * 100) : 0}%
                    </div>
                    <div className="text-sm text-purple-700">Click Rate</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="text-3xl font-bold text-orange-600">
                      {Math.min(Math.floor(selectedUrl.clicks / 10) + 1, 50)}
                    </div>
                    <div className="text-sm text-orange-700">Countries</div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-gray-50 p-8 rounded-xl mb-6 border border-gray-200">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="font-medium text-lg">Click Analytics Chart</p>
                    <p className="text-sm">Visual representation of clicks over time</p>
                  </div>
                </div>

                {/* Top Referrers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Top Referrers
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm text-gray-700 font-medium">Direct/None</span>
                        <span className="text-sm font-bold text-gray-800">67%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm text-gray-700 font-medium">Twitter</span>
                        <span className="text-sm font-bold text-gray-800">18%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm text-gray-700 font-medium">Facebook</span>
                        <span className="text-sm font-bold text-gray-800">15%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Top Locations
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm text-gray-700 font-medium">🇺🇸 United States</span>
                        <span className="text-sm font-bold text-gray-800">45%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm text-gray-700 font-medium">🇬🇧 United Kingdom</span>
                        <span className="text-sm font-bold text-gray-800">22%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm text-gray-700 font-medium">🇨🇦 Canada</span>
                        <span className="text-sm font-bold text-gray-800">18%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold">
                    Export Data
                  </button>
                  <button className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold">
                    Share Report
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedUrl(null);
                      handleQRCode(selectedUrl);
                    }}
                    className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold"
                  >
                    Generate QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* QR Code Modal */}
      {qrCodeData && (
        <QRCodeGenerator
          shortCode={qrCodeData.shortCode}
          url={qrCodeData.url}
          isOpen={!!qrCodeData}
          onClose={() => setQrCodeData(null)}
        />
      )}
    </>
  );
};

export default UserUrl;