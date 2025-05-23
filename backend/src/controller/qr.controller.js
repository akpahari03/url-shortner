import QRCode from 'qrcode';
import wrapAsync from "../utils/tryCatchWrapper.js";
import { getShortUrl } from "../dao/short_url.js";
import { NotFoundError } from "../utils/errorHandler.js";

// Generate QR Code for a short URL
export const generateQRCode = wrapAsync(async (req, res) => {
    const { shortCode } = req.params;
    const { 
        size = 300, 
        format = 'png', 
        errorCorrectionLevel = 'M',
        margin = 4,
        color = '#000000',
        background = '#FFFFFF'
    } = req.query;

    // Validate short URL exists
    const urlData = await getShortUrl(shortCode);
    if (!urlData) {
        throw new NotFoundError("Short URL not found");
    }

    // Check if user owns this URL (for authenticated requests)
    if (req.user && urlData.user && urlData.user.toString() !== req.user._id.toString()) {
        throw new NotFoundError("Short URL not found");
    }

    const fullShortUrl = `${process.env.APP_URL}${shortCode}`;

    try {
        // QR Code generation options
        const options = {
            errorCorrectionLevel: errorCorrectionLevel,
            type: 'image/png',
            quality: 0.92,
            margin: parseInt(margin),
            color: {
                dark: color,
                light: background
            },
            width: parseInt(size)
        };

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(fullShortUrl, options);

        // For API response, send base64 data
        if (format === 'json') {
            return res.json({
                success: true,
                qrCode: qrCodeDataUrl,
                url: fullShortUrl,
                shortCode: shortCode,
                originalUrl: urlData.full_url,
                size: parseInt(size),
                generatedAt: new Date().toISOString()
            });
        }

        // For direct image response
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', imageBuffer.length);
        res.setHeader('Content-Disposition', `inline; filename="qr-${shortCode}.png"`);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        
        res.send(imageBuffer);

    } catch (error) {
        console.error('QR Code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
});

// Generate QR Code with custom options for authenticated users
export const generateCustomQRCode = wrapAsync(async (req, res) => {
    const { shortCode } = req.params;
    const { 
        size = 300,
        logo = null,
        style = 'square',
        gradient = false,
        colorPrimary = '#000000',
        colorSecondary = '#FFFFFF'
    } = req.body;

    // Validate short URL exists and user owns it
    const urlData = await getShortUrl(shortCode);
    if (!urlData) {
        throw new NotFoundError("Short URL not found");
    }

    if (!req.user || urlData.user.toString() !== req.user._id.toString()) {
        throw new NotFoundError("Short URL not found");
    }

    const fullShortUrl = `${process.env.APP_URL}${shortCode}`;

    try {
        // Enhanced options for authenticated users
        const options = {
            errorCorrectionLevel: 'H', // High error correction for custom designs
            type: 'image/png',
            quality: 0.95,
            margin: 4,
            color: {
                dark: colorPrimary,
                light: colorSecondary
            },
            width: parseInt(size)
        };

        const qrCodeDataUrl = await QRCode.toDataURL(fullShortUrl, options);

        res.json({
            success: true,
            qrCode: qrCodeDataUrl,
            url: fullShortUrl,
            shortCode: shortCode,
            originalUrl: urlData.full_url,
            customization: {
                size: parseInt(size),
                style,
                colorPrimary,
                colorSecondary,
                gradient
            },
            generatedAt: new Date().toISOString(),
            downloadUrl: `${process.env.APP_URL}api/qr/${shortCode}/download`
        });

    } catch (error) {
        console.error('Custom QR Code generation error:', error);
        throw new Error('Failed to generate custom QR code');
    }
});

// Download QR Code as file
export const downloadQRCode = wrapAsync(async (req, res) => {
    const { shortCode } = req.params;
    const { size = 300 } = req.query;

    // Validate short URL exists
    const urlData = await getShortUrl(shortCode);
    if (!urlData) {
        throw new NotFoundError("Short URL not found");
    }

    // Check if user owns this URL (for authenticated requests)
    if (req.user && urlData.user && urlData.user.toString() !== req.user._id.toString()) {
        throw new NotFoundError("Short URL not found");
    }

    const fullShortUrl = `${process.env.APP_URL}${shortCode}`;

    try {
        const options = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 4,
            width: parseInt(size)
        };

        const qrCodeDataUrl = await QRCode.toDataURL(fullShortUrl, options);
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Set headers for file download
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="qr-code-${shortCode}.png"`);
        res.setHeader('Content-Length', imageBuffer.length);
        
        res.send(imageBuffer);

    } catch (error) {
        console.error('QR Code download error:', error);
        throw new Error('Failed to download QR code');
    }
});

// Get QR Code info without generating
export const getQRCodeInfo = wrapAsync(async (req, res) => {
    const { shortCode } = req.params;

    // Validate short URL exists
    const urlData = await getShortUrl(shortCode);
    if (!urlData) {
        throw new NotFoundError("Short URL not found");
    }

    // Check if user owns this URL (for authenticated requests)
    if (req.user && urlData.user && urlData.user.toString() !== req.user._id.toString()) {
        throw new NotFoundError("Short URL not found");
    }

    const fullShortUrl = `${process.env.APP_URL}${shortCode}`;

    res.json({
        success: true,
        shortCode: shortCode,
        url: fullShortUrl,
        originalUrl: urlData.full_url,
        clicks: urlData.clicks,
        createdAt: urlData.createdAt || new Date(),
        qrEndpoints: {
            generate: `${process.env.APP_URL}api/qr/${shortCode}`,
            download: `${process.env.APP_URL}api/qr/${shortCode}/download`,
            custom: req.user ? `${process.env.APP_URL}api/qr/${shortCode}/custom` : null
        },
        availableSizes: [150, 200, 300, 400, 500],
        availableFormats: ['png', 'json']
    });
});