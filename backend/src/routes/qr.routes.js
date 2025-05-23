import express from 'express';
import { 
    generateQRCode, 
    generateCustomQRCode, 
    downloadQRCode, 
    getQRCodeInfo 
} from '../controller/qr.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { attachUser } from '../utils/attachUser.js';

const router = express.Router();

// Public routes - can be accessed without authentication
// GET /api/qr/:shortCode - Generate basic QR code (image response)
router.get('/:shortCode', attachUser, generateQRCode);

// GET /api/qr/:shortCode/info - Get QR code information
router.get('/:shortCode/info', attachUser, getQRCodeInfo);

// GET /api/qr/:shortCode/download - Download QR code as file
router.get('/:shortCode/download', attachUser, downloadQRCode);

// Protected routes - require authentication
// POST /api/qr/:shortCode/custom - Generate custom QR code with advanced options
router.post('/:shortCode/custom', authMiddleware, generateCustomQRCode);

export default router;