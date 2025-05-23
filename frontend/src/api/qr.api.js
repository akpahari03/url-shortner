import axiosInstance from "../utils/axiosInstance";

// Generate basic QR code (returns image URL or JSON)
export const generateQRCode = async (shortCode, options = {}) => {
    const { 
        size = 300, 
        format = 'json',
        errorCorrectionLevel = 'M',
        margin = 4,
        color = '#000000',
        background = '#FFFFFF'
    } = options;

    const params = new URLSearchParams({
        size: size.toString(),
        format,
        errorCorrectionLevel,
        margin: margin.toString(),
        color,
        background
    });

    const { data } = await axiosInstance.get(`/api/qr/${shortCode}?${params}`);
    return data;
};

// Generate custom QR code with advanced options (authenticated users only)
export const generateCustomQRCode = async (shortCode, customOptions = {}) => {
    const { data } = await axiosInstance.post(`/api/qr/${shortCode}/custom`, customOptions);
    return data;
};

// Get QR code information
export const getQRCodeInfo = async (shortCode) => {
    const { data } = await axiosInstance.get(`/api/qr/${shortCode}/info`);
    return data;
};

// Download QR code as file
export const downloadQRCodeFile = async (shortCode, size = 300) => {
    try {
        const response = await axiosInstance.get(`/api/qr/${shortCode}/download?size=${size}`, {
            responseType: 'blob'
        });
        
        // Create download link
        const blob = new Blob([response.data], { type: 'image/png' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `qr-code-${shortCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        return { success: true, message: 'QR code downloaded successfully' };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to download QR code');
    }
};

// Get direct QR code image URL (for displaying in img tags)
export const getQRCodeImageUrl = (shortCode, options = {}) => {
    const { 
        size = 300,
        errorCorrectionLevel = 'M',
        margin = 4,
        color = '#000000',
        background = '#FFFFFF'
    } = options;

    const params = new URLSearchParams({
        size: size.toString(),
        errorCorrectionLevel,
        margin: margin.toString(),
        color,
        background
    });

    return `${axiosInstance.defaults.baseURL}/api/qr/${shortCode}?${params}`;
};