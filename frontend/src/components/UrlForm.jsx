import React, { useState } from 'react';
import { createShortUrl } from '../api/shortUrl.api';
import { useSelector } from 'react-redux';
import { queryClient } from '../main';
import QRCodeGenerator from './QRCodeGenerator';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL format');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await createShortUrl(url, customSlug);
      setShortUrl(response);
      queryClient.invalidateQueries({ queryKey: ['userUrls'] });
      
      // Reset form
      setUrl('');
      setCustomSlug('');
    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleQRCode = () => {
    setShowQRCode(true);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSlugChange = (value) => {
    // Only allow letters, numbers, and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setCustomSlug(sanitized);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Main URL Input */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Enter your long URL
            </span>
          </label>
          
          <div className="relative">
            {/* Animated border */}
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transition-opacity duration-300 ${
              focusedField === 'url' ? 'opacity-100' : 'opacity-0'
            }`}></div>
            
            <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
              focusedField === 'url' 
                ? 'border-transparent transform scale-[1.02] shadow-2xl' 
                : url && !isValidUrl(url)
                ? 'border-red-300 shadow-lg'
                : url && isValidUrl(url)
                ? 'border-green-300 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 shadow-lg'
            }`}>
              <div className="flex items-center">
                <div className="pl-6">
                  <svg className={`w-6 h-6 transition-colors duration-300 ${
                    focusedField === 'url' ? 'text-blue-600' : 
                    url && !isValidUrl(url) ? 'text-red-500' :
                    url && isValidUrl(url) ? 'text-green-500' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setFocusedField('url')}
                  onBlur={() => setFocusedField('')}
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  className="w-full pl-6 pr-16 py-5 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-lg"
                  required
                />
                {url && (
                  <div className="pr-6">
                    {isValidUrl(url) ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Slug for Authenticated Users */}
        {isAuthenticated && (
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Custom URL (Optional)
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">PRO</span>
              </span>
            </label>
            
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl transition-opacity duration-300 ${
                focusedField === 'customSlug' ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
                focusedField === 'customSlug' 
                  ? 'border-transparent transform scale-[1.02] shadow-2xl' 
                  : customSlug && customSlug.length < 3
                  ? 'border-yellow-300 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 shadow-lg'
              }`}>
                <div className="flex items-center">
                  <div className="pl-6 text-gray-500 text-lg font-medium">
                    localhost:3000/
                  </div>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    onFocus={() => setFocusedField('customSlug')}
                    onBlur={() => setFocusedField('')}
                    placeholder="my-custom-link"
                    className="w-full pr-6 py-5 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-lg"
                  />
                  {customSlug && (
                    <div className="pr-6">
                      {customSlug.length >= 3 ? (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Create a memorable custom link (minimum 3 characters, letters, numbers, and hyphens only)
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !url || !isValidUrl(url) || (customSlug && customSlug.length < 3)}
          className="group relative w-full py-5 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <svg className="w-6 h-6 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Shortening URL...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Shorten URL Now
                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>

        {/* Result Section */}
        {shortUrl && (
          <div className="relative animate-fadeIn">
            {/* Success Animation Background */}
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            
            <div className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl">
              {/* Success Header */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                URL Shortened Successfully!
              </h3>
              <p className="text-center text-gray-600 mb-6">Your new short link is ready to share</p>

              {/* URL Display */}
              <div className="space-y-4">
                {/* Short URL */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Short URL</label>
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <input
                      type="text"
                      readOnly
                      value={shortUrl}
                      className="flex-1 p-4 bg-transparent text-blue-700 font-mono text-lg focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className={`m-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        copied 
                          ? 'bg-green-500 text-white shadow-lg animate-pulse' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <span className="flex items-center">
                        {copied ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy URL
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <button
                  onClick={() => window.open(shortUrl, '_blank')}
                  className="flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Test Link
                </button>

                {/* QR Code Button - Only for authenticated users */}
                {isAuthenticated && (
                  <button
                    onClick={handleQRCode}
                    className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    QR Code
                  </button>
                )}

                <button
                  onClick={() => {
                    setShortUrl('');
                    setUrl('');
                    setCustomSlug('');
                    setError(null);
                  }}
                  className="flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Shorten Another
                </button>
              </div>

              {/* QR Code Feature Highlight for Authenticated Users */}
              {isAuthenticated && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="text-purple-700 font-medium">Generate QR code for easy sharing</span>
                    </div>
                    <button
                      onClick={handleQRCode}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm underline transition-colors duration-200"
                    >
                      Generate Now
                    </button>
                  </div>
                </div>
              )}

              {/* Analytics Preview for Authenticated Users */}
              {isAuthenticated && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-blue-700 font-medium">Track clicks and analytics in your dashboard</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        {!shortUrl && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Shorten URLs in milliseconds</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">QR Codes</h4>
              <p className="text-sm text-gray-600">{isAuthenticated ? 'Generate QR codes automatically' : 'Sign up for QR codes'}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Smart Analytics</h4>
              <p className="text-sm text-gray-600">{isAuthenticated ? 'Track clicks and performance' : 'Sign up for analytics'}</p>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>

      {/* QR Code Modal */}
      <QRCodeGenerator
        url={shortUrl}
        shortUrl={shortUrl?.split('/').pop()}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
      />
    </>
  );
};

export default UrlForm;