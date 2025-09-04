import db from '../models/index.js';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { saveBase64AsFile, deleteUploadedFile } from '../middleware/upload.js';
import { sendEmail, sendApprovalEmail, sendRejectionEmail } from '../utils/nodemailer.js';

/**
 * Parse recommendation string into separate fields
 */
function parseRecommendation(recommendationStr) {
  if (!recommendationStr) return {};
  
  // Expected format: "John (mentor, from Graceland Church, contact: alvindr20@gmail.com)"
  const match = recommendationStr.match(/^([^(]+)\s*\(([^,]+),\s*from\s+([^,]+),\s*contact:\s*([^)]+)\)/);
  
  if (match) {
    return {
      recommendationName: match[1].trim(),
      recommendationRelationship: match[2].trim(),
      recommendationChurch: match[3].trim(),
      recommendationContact: match[4].trim()
    };
  }
  
  // Fallback: use the whole string as name
  return {
    recommendationName: recommendationStr.trim(),
    recommendationRelationship: '',
    recommendationChurch: '',
    recommendationContact: ''
  };
}

/**
 * Parse authorization string into separate fields
 */
function parseAuthorization(authStr) {
  if (!authStr) return {};
  
  // Expected format: "Pst Peter Flourish & Peter Williams"
  const parts = authStr.split('&').map(part => part.trim());
  
  return {
    signedBy: parts[0] || '',
    approvedBy: parts[1] || '',
    attestedBy: parts[2] || ''
  };
}

/**
 * Create a new registration
 */
export const createRegistration = async (req, res) => {
  console.log('creating registration... ', req.body);
  
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Validation failed' + errors.array().map(err => err.msg) ,
    //     errors: errors.array().map(err => err.msg)
    //   });
    // }

    // Prepare registration data
    const registrationData = { ...req.body };

    // Handle photo upload - either from multer file upload or base64 fallback
    if (req.file) {
      // Photo uploaded via multer
      registrationData.photo = req.file.path;
    } else if (registrationData.photo && registrationData.photo.startsWith('data:')) {
      // Photo sent as base64 data - save as file
      try {
        const photoPath = saveBase64AsFile(registrationData.photo);
        if (photoPath) {
          registrationData.photo = photoPath;
        }
      } catch (photoError) {
        console.error('Photo upload error:', photoError);
        return res.status(400).json({
          success: false,
          message: 'Failed to save photo',
          errors: ['Photo processing failed']
        });
      }
    }

    // Parse recommendation field if it comes as a single string
    if (registrationData.Recommendation) {
      const recommendationFields = parseRecommendation(registrationData.Recommendation);
      Object.assign(registrationData, recommendationFields);
      delete registrationData.Recommendation;
    }

    // Parse authorization field if it comes as a single string
    if (registrationData['Signed/Approved/Attested By']) {
      const authFields = parseAuthorization(registrationData['Signed/Approved/Attested By']);
      Object.assign(registrationData, authFields);
      delete registrationData['Signed/Approved/Attested By'];
    }

    console.log("Now saving registration data: ", registrationData);
    
    const registration = await db.Registration.create(registrationData);


    
    // Send confirmation email
    try {
      await sendEmail(registration);
      console.log('Registration confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the registration if email fails, just log the error
    }
    
    res.status(201).json({
      success: true,
      data: registration,
      message: 'Registration created successfully'
    });
  } catch (error) {
    console.error('Create registration error:', error);
    
    // Clean up uploaded photo file if database operation fails
    if (req.photoPath) {
      deleteUploadedFile(req.photoPath);
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Registration with this email or phone already exists',
        errors: ['Duplicate entry detected']
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create registration',
      errors: [error.message]
    });
  }
};

/**
 * Get paginated list of registrations with filtering
 */
export const getRegistrations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      country,
      status,
      search,
      startDate,
      endDate
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = {};

    // Apply filters
    if (country) whereClause.country = country;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await db.Registration.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        registrations: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      errors: [error.message]
    });
  }
};

/**
 * Get a single registration by ID
 */
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await db.Registration.findByPk(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Get registration by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration',
      errors: [error.message]
    });
  }
};

/**
 * Update registration status and details
 */
export const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // expects { status?: 'approved'|'declined'|'pending'|'under_review', statusMessage?: string, ... }

    const registration = await db.Registration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Capture previous status to detect transitions (educational: avoids duplicate emails)
    const previousStatus = registration.status;

    // Persist updates
    await registration.update(updateData);

    // If status changed, optionally notify the user via email
    const newStatus = registration.status;
    const message = updateData.statusMessage || '';
    try {
      if (previousStatus !== newStatus && newStatus === 'approved') {
        await sendApprovalEmail(registration, message);
      }
      if (previousStatus !== newStatus && newStatus === 'declined') {
        await sendRejectionEmail(registration, message);
      }
    } catch (emailErr) {
      // Don't fail the API because of email issues; log for observability
      console.error('Status change email failed:', emailErr);
    }

    res.json({
      success: true,
      data: registration,
      message: 'Registration updated successfully'
    });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration',
      errors: [error.message]
    });
  }
};

/**
 * Delete a registration
 */
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await db.Registration.findByPk(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    await registration.destroy();

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete registration',
      errors: [error.message]
    });
  }
};

/**
 * Get registration statistics
 */
export const getRegistrationStats = async (req, res) => {
  try {
    const total = await db.Registration.count();
    const pending = await db.Registration.count({ where: { status: 'pending' } });
    const approved = await db.Registration.count({ where: { status: 'approved' } });
    const declined = await db.Registration.count({ where: { status: 'declined' } });
    const underReview = await db.Registration.count({ where: { status: 'under_review' } });

    // Get stats by country
    const countryStats = await db.Registration.findAll({
      attributes: ['country', [db.sequelize.fn('COUNT', db.sequelize.col('country')), 'count']],
      group: ['country'],
      raw: true
    });

    const byCountry = {};
    countryStats.forEach(stat => {
      byCountry[stat.country] = parseInt(stat.count);
    });

    // Get stats by month (last 12 months)
    const monthlyStats = await db.Registration.findAll({
      attributes: [
        [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('createdAt')), 'month'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      group: [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    const byMonth = {};
    monthlyStats.forEach(stat => {
      const month = new Date(stat.month).toISOString().slice(0, 7);
      byMonth[month] = parseInt(stat.count);
    });

    // Get recent registrations
    const recentRegistrations = await db.Registration.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        declined,
        underReview,
        byCountry,
        byMonth,
        recentRegistrations
      }
    });
  } catch (error) {
    console.error('Get registration stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration statistics',
      errors: [error.message]
    });
  }
};

/**
 * Bulk update multiple registrations
 */
export const bulkUpdateRegistrations = async (req, res) => {
  try {
    const { ids, updates } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing registration IDs'
      });
    }

    const [updatedCount] = await db.Registration.update(updates, {
      where: { id: { [Op.in]: ids } }
    });

    const updatedRegistrations = await db.Registration.findAll({
      where: { id: { [Op.in]: ids } }
    });

    res.json({
      success: true,
      data: updatedRegistrations,
      message: `${updatedCount} registrations updated successfully`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registrations',
      errors: [error.message]
    });
  }
};

/**
 * Export registrations to various formats
 */
export const exportRegistrations = async (req, res) => {
  try {
    const { format = 'csv', filters = {}, fields = [], includePhotos = false } = req.body;

    const whereClause = {};
    if (filters.country) whereClause.country = filters.country;
    if (filters.status) whereClause.status = filters.status;
    if (filters.dateRange) {
      whereClause.createdAt = {};
      if (filters.dateRange.start) whereClause.createdAt[Op.gte] = new Date(filters.dateRange.start);
      if (filters.dateRange.end) whereClause.createdAt[Op.lte] = new Date(filters.dateRange.end);
    }

    const registrations = await db.Registration.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    // Generate export file (simplified - in production, use proper export libraries)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `registrations-export-${timestamp}.${format}`;
    const downloadUrl = `/exports/${filename}`;

    // In a real implementation, you would:
    // 1. Generate the actual file based on format
    // 2. Save it to a temporary location
    // 3. Return the download URL

    res.json({
      success: true,
      data: {
        downloadUrl,
        filename,
        size: registrations.length * 1024, // Approximate size
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      },
      message: 'Export generated successfully'
    });
  } catch (error) {
    console.error('Export registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export registrations',
      errors: [error.message]
    });
  }
};

/**
 * Get registrations by country
 */
export const getRegistrationsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const registrations = await db.Registration.findAll({
      where: { country: decodeURIComponent(country) },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Get registrations by country error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations by country',
      errors: [error.message]
    });
  }
};

/**
 * Get recent registrations
 */
export const getRecentRegistrations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const registrations = await Registration.findAll({
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Get recent registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent registrations',
      errors: [error.message]
    });
  }
};

/**
 * Search registrations with advanced criteria
 */
export const searchRegistrations = async (req, res) => {
  try {
    const { q: query, country, status } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const whereClause = {
      [Op.or]: [
        { fullName: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
        { phone: { [Op.iLike]: `%${query}%` } },
        { churchOrganization: { [Op.iLike]: `%${query}%` } },
        { position: { [Op.iLike]: `%${query}%` } }
      ]
    };

    if (country) whereClause.country = country;
    if (status) whereClause.status = status;

    const registrations = await db.Registration.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Search registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search registrations',
      errors: [error.message]
    });
  }
};

/**
 * Validate registration data before submission
 */
export const validateRegistration = async (req, res) => {
  try {
    const registrationData = req.body;
    const errors = [];
    const warnings = [];

    // Basic validation
    if (!registrationData.fullName || registrationData.fullName.length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    if (!registrationData.email || !/\S+@\S+\.\S+/.test(registrationData.email)) {
      errors.push('Valid email address is required');
    }

    if (!registrationData.phone) {
      errors.push('Phone number is required');
    }

    // Check for existing email/phone
    if (registrationData.email) {
      const existingEmail = await db.Registration.findOne({
        where: { email: registrationData.email }
      });
      if (existingEmail) {
        errors.push('Email address already registered');
      }
    }

    if (registrationData.phone) {
      const existingPhone = await db.Registration.findOne({
        where: { phone: registrationData.phone }
      });
      if (existingPhone) {
        warnings.push('Phone number already registered');
      }
    }

    res.json({
      success: true,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    });
  } catch (error) {
    console.error('Validate registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate registration',
      errors: [error.message]
    });
  }
};

/**
 * Check for duplicate registrations
 */
export const checkDuplicate = async (req, res) => {
  console.log('Checking for duplicates... ', req.query)
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    const whereClause = {
      [Op.or]: []
    };

    if (email) whereClause[Op.or].push({ email });
    if (phone) whereClause[Op.or].push({ phone });

    const existingRegistrations = await db.Registration.findAll({
      where: whereClause
    });

    const duplicateFields = [];
    if (email && existingRegistrations.some(reg => reg.email === email)) {
      duplicateFields.push('email');
    }
    if (phone && existingRegistrations.some(reg => reg.phone === phone)) {
      duplicateFields.push('phone');
    }

    res.json({
      success: true,
      data: {
        hasDuplicates: existingRegistrations.length > 0,
        duplicateFields,
        existingRegistrations
      }
    });
  } catch (error) {
    console.error('Check duplicates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check for duplicates',
      errors: [error.message]
    });
  }
};
