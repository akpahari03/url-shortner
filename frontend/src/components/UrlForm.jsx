import React, { useState } from 'react';
import axios from 'axios';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simple URL validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle button click
  const handleSubmit = async () => {
    if (!url || !isValidUrl(url)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/api/create', {
        url: url
      });

      setShortUrl(response.data.shortUrl || response.data.shortened_url || response.data.short_url);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative function for button click (if not using form)
  const shortenUrl = async () => {
    if (!url || !isValidUrl(url)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/api/create', {
        url: url
      });

      setShortUrl(response.data.shortUrl || response.data.shortened_url || response.data.short_url);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleReset = () => {
    setUrl('');
    setShortUrl('');
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your URL
        </label>
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Shortening...
          </div>
        ) : (
          'Shorten URL'
        )}
      </button>

      {shortUrl && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your shortened URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 text-sm"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-gray-600">📋</span>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>
      )}

      {shortUrl && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Shorten Another URL
        </button>
      )}
    </div>
  );
};

export default UrlForm;