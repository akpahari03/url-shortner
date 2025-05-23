import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
    generateQRCode, 
    generateCustomQRCode, 
    downloadQRCodeFile, 
    getQRCodeImageUrl 
} from '../api/qr.api';

const QRCodeGenerator = ({ shortCode, url, isOpen, onClose }) => {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [error, setError] = useState(null);
    const [customOptions, setCustomOptions] = useState({
        size: 300,
        colorPrimary: '#000000',
        colorSecondary: '#FFFFFF',
        style: 'square'
    });

    const modalRef = useRef(null);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isOpen && shortCode) {
            generateQR();
        }
        
        // Handle modal opening/closing
        if (isOpen) {
            // Focus on modal for accessibility
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }
        
        // Handle Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        
        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, shortCode, onClose]);

    const generateQR = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await generateQRCode(shortCode, {
                size: customOptions.size,
                format: 'json',
                color: customOptions.colorPrimary,
                background: customOptions.colorSecondary
            });
            setQrData(result);
        } catch (err) {
            setError(err.message || 'Failed to generate QR code');
        } finally {
            setLoading(false);
        }
    };

    const generateCustomQR = async () => {
        if (!isAuthenticated) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await generateCustomQRCode(shortCode, customOptions);
            setQrData(result);
        } catch (err) {
            setError(err.message || 'Failed to generate custom QR code');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            await downloadQRCodeFile(shortCode, customOptions.size);
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 2000);
        } catch (err) {
            setError(err.message || 'Failed to download QR code');
        }
    };

    const copyQRCodeLink = () => {
        if (qrData?.qrCode) {
            navigator.clipboard.writeText(qrData.qrCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const shareQRCode = async () => {
        if (navigator.share && qrData?.qrCode) {
            try {
                await navigator.share({
                    title: 'QR Code for Link',
                    text: `QR Code for: ${url}`,
                    url: qrData.url,
                });
            } catch (error) {
                copyQRCodeLink();
            }
        } else {
            copyQRCodeLink();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-black bg-opacity-50 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className="flex min-h-full items-center justify-center p-4">
                <div 
                    ref={modalRef}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="qr-modal-title"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-t-2xl border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 id="qr-modal-title" className="text-lg font-bold text-gray-800">QR Code Generator</h3>
                                    <p className="text-sm text-gray-600">Generate and download QR code</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="px-6 py-4 space-y-4">
                        {/* URL Info */}
                        <div className="p-3 bg-gray-50 rounded-xl border">
                            <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className="font-semibold text-gray-800 text-sm">Short URL</span>
                            </div>
                            <div className="text-gray-600 break-all font-mono text-xs bg-white p-2 rounded border">
                                {url}
                            </div>
                        </div>

                        {/* Customization Options for Authenticated Users */}
                        {isAuthenticated && (
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="flex items-center mb-3">
                                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                                    </svg>
                                    <span className="font-semibold text-purple-800 text-sm">Customize QR Code</span>
                                    <span className="ml-2 px-2 py-0.5 bg-purple-200 text-purple-700 text-xs rounded-full font-medium">PRO</span>
                                </div>
                                
                                <div className="space-y-3">
                                    {/* Size Selection */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                                        <select
                                            value={customOptions.size}
                                            onChange={(e) => setCustomOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value={150}>150x150 (Small)</option>
                                            <option value={200}>200x200 (Medium)</option>
                                            <option value={300}>300x300 (Large)</option>
                                            <option value={400}>400x400 (Extra Large)</option>
                                            <option value={500}>500x500 (Maximum)</option>
                                        </select>
                                    </div>

                                    {/* Color Selection */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">QR Color</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="color"
                                                    value={customOptions.colorPrimary}
                                                    onChange={(e) => setCustomOptions(prev => ({ ...prev, colorPrimary: e.target.value }))}
                                                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                                                    title="Select QR code color"
                                                />
                                                <input
                                                    type="text"
                                                    value={customOptions.colorPrimary}
                                                    onChange={(e) => setCustomOptions(prev => ({ ...prev, colorPrimary: e.target.value }))}
                                                    className="flex-1 p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 font-mono"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="color"
                                                    value={customOptions.colorSecondary}
                                                    onChange={(e) => setCustomOptions(prev => ({ ...prev, colorSecondary: e.target.value }))}
                                                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                                                    title="Select background color"
                                                />
                                                <input
                                                    type="text"
                                                    value={customOptions.colorSecondary}
                                                    onChange={(e) => setCustomOptions(prev => ({ ...prev, colorSecondary: e.target.value }))}
                                                    className="flex-1 p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 font-mono"
                                                    placeholder="#FFFFFF"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={generateCustomQR}
                                        disabled={loading}
                                        className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Generating...
                                            </span>
                                        ) : (
                                            'Apply Custom Settings'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-red-700 text-sm">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* QR Code Display */}
                        <div className="text-center">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 font-medium">Generating QR Code...</p>
                                </div>
                            ) : qrData?.qrCode ? (
                                <div className="space-y-3">
                                    <div className="relative inline-block">
                                        <img
                                            src={qrData.qrCode}
                                            alt="QR Code"
                                            className="mx-auto border border-gray-200 rounded-xl shadow-lg"
                                            style={{ 
                                                maxWidth: `${Math.min(customOptions.size, 280)}px`, 
                                                width: '100%', 
                                                height: 'auto' 
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Scan with any QR code reader
                                    </p>
                                    {qrData.generatedAt && (
                                        <p className="text-xs text-gray-400">
                                            Generated: {new Date(qrData.generatedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    <p className="text-sm">Click below to generate your QR code</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {qrData?.qrCode ? (
                            <div className="space-y-3">
                                {/* Primary Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleDownload}
                                        className={`flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                            downloaded
                                                ? 'bg-green-500 text-white shadow-lg'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                        }`}
                                    >
                                        {downloaded ? (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Downloaded!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Download
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={shareQRCode}
                                        className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        Share
                                    </button>
                                </div>

                                {/* Copy Button */}
                                <button
                                    onClick={copyQRCodeLink}
                                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        copySuccess
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                                    }`}
                                >
                                    {copySuccess ? (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            QR Code Data Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy QR Code Data
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={generateQR}
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 715 0z" />
                                    </svg>
                                    Generate QR Code
                                </span>
                            </button>
                        )}

                        {/* Quick Tips */}
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-start">
                                <svg className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-blue-800 text-sm mb-1">Usage Tips</h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• Perfect for business cards and marketing materials</li>
                                        <li>• Share in presentations and digital content</li>
                                        <li>• Enable contactless link sharing</li>
                                        {isAuthenticated && <li>• Customize colors to match your brand</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Pro Features for Non-authenticated Users */}
                        {!isAuthenticated && (
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                <div className="flex items-center mb-3">
                                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    <span className="font-semibold text-purple-800">Unlock Pro Features</span>
                                    <span className="ml-2 px-2 py-1 bg-purple-200 text-purple-700 text-xs rounded-full font-medium">PRO</span>
                                </div>
                                <ul className="text-sm text-purple-700 space-y-1 mb-3">
                                    <li>• Custom colors and branding</li>
                                    <li>• Multiple sizes and formats</li>
                                    <li>• Advanced customization options</li>
                                    <li>• Bulk QR code generation</li>
                                </ul>
                                <button 
                                    onClick={onClose}
                                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    Sign Up for Free
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;