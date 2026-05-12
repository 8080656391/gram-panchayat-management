import { Request, Response } from 'express';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateCertificateFileName, saveCertificateFile } from '../utils/certificateGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuthRequest extends Request {
  user?: any;
  files?: any;
  file?: any;
}

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private (Staff, Admin)
export const getCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query: any = {};

    // If staff, show ALL certificates (staff can review any certificate)
    if (req.user.role === 'staff') {
      // No additional filter - staff sees all certificates
    }
    // If admin, show all certificates (admin can see everything)
    else if (req.user.role === 'admin') {
      // Admin sees all certificates - no additional filter
    }
    // For other roles, show all certificates

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by certificate type
    if (req.query.certificateType) {
      query.certificateType = req.query.certificateType;
    }

    // Filter by applicant
    if (req.query.applicantId) {
      query.applicantId = req.query.applicantId;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.applicationDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }

    // Search by applicant name or certificate number
    if (req.query.search) {
      query.$or = [
        { applicantName: { $regex: req.query.search, $options: 'i' } },
        { certificateNumber: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query with population
    const certificates = await Certificate.find(query)
      .populate('applicantId', 'name email phone village')
      .populate('reviewedBy', 'name')
      .populate('approvedBy', 'name')
      .sort({ applicationDate: -1 })
      .limit(limit)
      .skip(startIndex);

    // Get total count for pagination
    const total = await Certificate.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCertificates: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        certificates,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private (Staff, Admin)
export const getCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('applicantId', 'name email phone village aadharNumber')
      .populate('reviewedBy', 'name')
      .populate('approvedBy', 'name');

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { certificate }
    });
  } catch (error: any) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new certificate application
// @route   POST /api/certificates
// @access  Private (Citizen)
export const createCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      certificateType,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge
    } = req.body;

    // Get user details from database
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Process uploaded documents
    let documents: any[] = [];
    if (req.files && Array.isArray(req.files)) {
      documents = req.files.map((file: any) => ({
        type: file.fieldname,
        fileName: file.originalname,
        filePath: file.path,
        uploadDate: new Date(),
        fileSize: file.size,
        mimeType: file.mimetype
      }));
    }

    // Auto-fetch user data from database and store in certificate
    // This ensures certificate always has complete user profile data
    const userProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      village: user.village || '',
      aadharNumber: user.aadharNumber || '',
      dateOfBirth: user.dateOfBirth || null,
      address: user.address || '',
      gender: (user as any).gender || '',
      occupation: (user as any).occupation || '',
      fatherName: (user as any).fatherName || '',
      motherName: (user as any).motherName || '',
      yearsInVillage: (user as any).yearsInVillage || 0,
      spouseName: (user as any).spouseName || '',
      marriageDate: (user as any).marriageDate || null,
      marriagePlace: (user as any).marriagePlace || '',
      dateOfDeath: (user as any).dateOfDeath || null,
      placeOfDeath: (user as any).placeOfDeath || '',
    };

    // Create certificate with auto-fetched user data from database
    const certificate = await Certificate.create({
      applicantId: req.user._id,
      // Use database user data as primary source
      applicantName: user.name, // Always use database name
      applicantEmail: user.email, // Always use database email
      applicantPhone: user.phone || applicantPhone || '',
      applicantAge: user.age || applicantAge || 0,
      certificateType,
      documents,
      status: 'pending',
      // Store complete user profile for certificate generation
      userProfile: userProfile
    });

    // Find an available staff member to assign the certificate for review
    const staffMember = await User.findOne({ role: 'staff' }).sort({ createdAt: 1 });
    
    if (staffMember) {
      // Update certificate status to 'under-review' and assign to staff
      certificate.status = 'under-review';
      certificate.reviewedBy = staffMember._id;
      certificate.reviewDate = new Date();
      certificate.partialApproved = false; // Flag for partial approval workflow
      await certificate.save();
    }

    // Populate reviewedBy field for response
    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('reviewedBy', 'name email phone')
      .populate('applicantId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Certificate application submitted successfully and sent to staff for review',
      data: { certificate: populatedCertificate }
    });
  } catch (error: any) {
    console.error('Create certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private (Staff, Admin)
export const updateCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      rejectionReason,
      remarks,
      partialApproved
    } = req.body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;

      if (status === 'under-review') {
        updateData.reviewedBy = req.user._id;
        updateData.reviewDate = new Date();
      } else if (status === 'approved') {
        updateData.approvedBy = req.user._id;
        updateData.approvalDate = new Date();
        updateData.issuanceDate = new Date();
      } else if (status === 'rejected') {
        updateData.rejectionReason = rejectionReason;
      }
    }

    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    if (partialApproved !== undefined) {
      updateData.partialApproved = partialApproved;
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('applicantId', 'name email phone village')
     .populate('reviewedBy', 'name')
     .populate('approvedBy', 'name');

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: { certificate }
    });
  } catch (error: any) {
    console.error('Update certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Admin)
export const deleteCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    // Delete associated files
    if (certificate.documents && certificate.documents.length > 0) {
      certificate.documents.forEach((doc: any) => {
        if (fs.existsSync(doc.filePath)) {
          fs.unlinkSync(doc.filePath);
        }
      });
    }

    await Certificate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload additional document to certificate
// @route   POST /api/certificates/:id/upload
// @access  Private (Staff, Admin)
export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    const newDocument = {
      type: req.body.documentType || 'additional',
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadDate: new Date(),
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    };

    certificate.documents.push(newDocument);
    await certificate.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document: newDocument }
    });
  } catch (error: any) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's own certificates
// @route   GET /api/certificates/my-certificates
// @access  Private (Citizen)
export const getMyCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const query: any = { applicantId: req.user._id };

    // Filter by status if specified
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by certificate type if specified
    if (req.query.certificateType) {
      query.certificateType = req.query.certificateType;
    }

    const certificates = await Certificate.find(query)
      .sort({ applicationDate: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Certificate.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCertificates: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        certificates,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get my certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Partial approval/rejection of documents by staff
// @route   PUT /api/certificates/:id/partial-review
// @access  Private (Staff, Admin)
export const partialReviewCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentApprovals, overallStatus, remarks } = req.body;
    // documentApprovals format: [{ documentType: 'aadhaar', status: 'approved', reason?: 'optional rejection reason' }]

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    // Update individual document statuses
    if (documentApprovals && Array.isArray(documentApprovals)) {
      documentApprovals.forEach((approval: any) => {
        const docIndex = certificate.documents?.findIndex(doc => doc.type === approval.documentType) ?? -1;
        const doc = certificate.documents?.[docIndex];
        if (doc) {
          doc.status = approval.status; // 'approved' or 'rejected'
          if (approval.status === 'rejected' && approval.reason) {
            doc.rejectionReason = approval.reason;
          }
        }
      });
    }

    // Check if any documents are approved and any are rejected for partial approval
    const hasApproved = certificate.documents?.some((doc: any) => doc.status === 'approved') ?? false;
    const hasRejected = certificate.documents?.some((doc: any) => doc.status === 'rejected') ?? false;

    // Update certificate status and flags
    if (overallStatus) {
      certificate.status = overallStatus;
      certificate.reviewedBy = req.user._id;
      certificate.reviewDate = new Date();

      if (hasApproved && hasRejected) {
        certificate.partialApproved = true;
      }
    }

    if (remarks) {
      certificate.staffRemarks = remarks;
    }

    // If staff approves with partial/full approval, move to admin review
    if (overallStatus === 'admin-review' || (overallStatus === 'under-review' && hasApproved)) {
      certificate.status = 'admin-review';
    }

    await certificate.save();

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('applicantId', 'name email phone')
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Documents reviewed and sent to admin for approval',
      data: { certificate: populatedCertificate }
    });
  } catch (error: any) {
    console.error('Partial review certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Admin final approval of certificate
// @route   PUT /api/certificates/:id/admin-approve
// @access  Private (Admin)
export const adminApproveCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, adminRemarks, rejectReason } = req.body;
    // status can be 'approved' or 'rejected'

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    // Only admin can approve/reject at this stage
    if (status === 'approved') {
      certificate.status = 'approved';
      certificate.approvedBy = req.user._id;
      certificate.approvalDate = new Date();
      certificate.issuanceDate = new Date();
      certificate.partialApproved = false;

      if (adminRemarks) {
        certificate.adminRemarks = adminRemarks;
      }

      // Save once so the pre-save hook can assign a certificate number
      await certificate.save();

      // Re-fetch the certificate to get the generated certificate number from pre-save hook
      const updatedCertificate = await Certificate.findById(certificate._id);

      // Generate certificate file after the number has been created
      try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadDir = path.resolve(__dirname, '../../../uploads/certificates');
        console.log(`Generating certificate in directory: ${uploadDir}`);
        
        const fileName = generateCertificateFileName(
          updatedCertificate?.certificateNumber || 'CERT',
          certificate.certificateType
        );
        console.log(`Generated file name: ${fileName}`);

        // Fetch complete user data for the certificate - ALWAYS use current data from User collection
        const user = await User.findById(certificate.applicantId);
        const storedProfile = (certificate as any).userProfile;
        
        // Use current user data from User collection as primary source
        const profileData = user ? {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          village: user.village || '',
          aadharNumber: user.aadharNumber || '',
          dateOfBirth: user.dateOfBirth || null,
          address: user.address || '',
          gender: (user as any)?.gender || '',
          occupation: (user as any)?.occupation || '',
          fatherName: (user as any)?.fatherName || '',
          motherName: (user as any)?.motherName || '',
          yearsInVillage: (user as any)?.yearsInVillage || 0,
          spouseName: (user as any)?.spouseName || '',
          marriageDate: (user as any)?.marriageDate || null,
          marriagePlace: (user as any)?.marriagePlace || '',
          dateOfDeath: (user as any)?.dateOfDeath || null,
          placeOfDeath: (user as any)?.placeOfDeath || '',
        } : (storedProfile || {
          name: '',
          email: '',
          phone: '',
          village: '',
          aadharNumber: '',
          dateOfBirth: null,
          address: '',
          gender: '',
          occupation: '',
          fatherName: '',
          motherName: '',
          yearsInVillage: 0,
          spouseName: '',
          marriageDate: null,
          marriagePlace: '',
          dateOfDeath: null,
          placeOfDeath: '',
        });
        
        // Build comprehensive certificate data based on certificate type - ALWAYS use current user name
        const certificateData: any = {
          certificateNumber: updatedCertificate?.certificateNumber || 'CERT',
          certificateType: certificate.certificateType,
          applicantName: profileData.name || certificate.applicantName || 'Unknown', // Always use current user name
          applicationDate: certificate.applicationDate,
          issuanceDate: certificate.issuanceDate,
          language: (certificate as any).language || 'en',
          // Include complete user data from stored profile
          applicantEmail: profileData.email || certificate.applicantEmail,
          applicantPhone: profileData.phone || certificate.applicantPhone,
          applicantAge: certificate.applicantAge,
          // Additional user details from stored profile
          userVillage: profileData.village || 'N/A',
          userAadharNumber: profileData.aadharNumber || 'N/A',
          userDateOfBirth: profileData.dateOfBirth || null,
          userAddress: profileData.address || 'N/A',
        };

        // Add certificate-type-specific fields from stored profile
        if (updatedCertificate?.certificateType === 'birth' && profileData.dateOfBirth) {
          certificateData.dateOfBirth = profileData.dateOfBirth;
          certificateData.placeOfBirth = profileData.address || 'N/A';
          certificateData.fatherName = profileData.fatherName || 'N/A';
          certificateData.motherName = profileData.motherName || 'N/A';
        } else if (updatedCertificate?.certificateType === 'death' && profileData.dateOfDeath) {
          certificateData.dateOfDeath = profileData.dateOfDeath;
          certificateData.placeOfDeath = profileData.placeOfDeath || 'N/A';
          certificateData.deceasedName = certificate.applicantName;
        } else if (updatedCertificate?.certificateType === 'residence') {
          certificateData.residenceAddress = profileData.address || 'N/A';
          certificateData.residenceVillage = profileData.village || 'N/A';
          certificateData.residenceYears = profileData.yearsInVillage?.toString() || 'N/A';
        } else if (updatedCertificate?.certificateType === 'marriage') {
          certificateData.marriageDate = profileData.marriageDate || null;
          certificateData.spouseName = profileData.spouseName || 'N/A';
          certificateData.marriagePlace = profileData.marriagePlace || 'N/A';
        }

        const filePath = saveCertificateFile(certificateData, fileName, uploadDir);
        console.log(`Certificate file saved at: ${filePath}`);
        console.log(`File exists: ${fs.existsSync(filePath)}`);

        // Store download URL and save the certificate again
        updatedCertificate!.downloadUrl = `/api/certificates/${updatedCertificate!._id}/download`;
        await updatedCertificate!.save();

        console.log('Certificate generation completed successfully');
      } catch (genError: any) {
        console.error('Error generating certificate:', genError);
        // Continue even if generation fails, but log it
      }
    } else if (status === 'rejected') {
      certificate.status = 'rejected';
      certificate.rejectionReason = rejectReason;

      if (adminRemarks) {
        certificate.adminRemarks = adminRemarks;
      }

      await certificate.save();
    } else {
      if (adminRemarks) {
        certificate.adminRemarks = adminRemarks;
      }

      await certificate.save();
    }

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('applicantId', 'name email phone')
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Certificate ${status} by admin successfully${status === 'approved' ? ' and generated for download' : ''}`,
      data: { certificate: populatedCertificate }
    });
  } catch (error: any) {
    console.error('Admin approve certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Download certificate
// @route   GET /api/certificates/:id/download
// @access  Private (Citizen, Staff, Admin)
export const downloadCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    // Check if certificate is approved
    if (certificate.status !== 'approved') {
      res.status(403).json({
        success: false,
        message: 'Certificate is not approved yet. Download will be available once approved.'
      });
      return;
    }

    // Check authorization: only owner, staff, or admin can download
    const isOwner = certificate.applicantId.toString() === req.user._id.toString();
    const isStaffOrAdmin = req.user.role === 'staff' || req.user.role === 'admin';

    if (!isOwner && !isStaffOrAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to download this certificate'
      });
      return;
    }

    // Fetch current user data from User collection
    const user = await User.findById(certificate.applicantId);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User data not found'
      });
      return;
    }

    // Get template file based on certificate type
    const uploadDir = path.resolve(__dirname, '../../../uploads/certificates');
    const templateMap: Record<string, string> = {
      'birth': 'template-birth.html',
      'death': 'template-death.html',
      'residence': 'template-residence.html',
      'marriage': 'template-marriage.html'
    };
    
    const templateFile = templateMap[certificate.certificateType];
    const templatePath = path.join(uploadDir, templateFile);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`Template file not found: ${templatePath}`);
      res.status(404).json({
        success: false,
        message: 'Certificate template not found'
      });
      return;
    }

    // Read template
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Format dates
    const formatDate = (date: Date | string | null | undefined): string => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-IN');
    };

    // Prepare user data for template
    const certData = {
      '{{CERTIFICATE_NUMBER}}': certificate.certificateNumber || 'N/A',
      '{{APPLICATION_DATE}}': formatDate(certificate.applicationDate),
      '{{ISSUANCE_DATE}}': formatDate(certificate.issuanceDate),
      '{{APPLICANT_NAME}}': user.name || 'N/A',
      '{{APPLICANT_EMAIL}}': user.email || 'N/A',
      '{{APPLICANT_PHONE}}': user.phone || 'N/A',
      '{{VILLAGE}}': user.village || 'N/A',
      '{{AADHAR_NUMBER}}': user.aadharNumber || 'N/A',
      '{{DATE_OF_BIRTH}}': formatDate(user.dateOfBirth),
      '{{ADDRESS}}': user.address || 'N/A',
      '{{GENDER}}': (user as any).gender || 'N/A',
      '{{FATHER_NAME}}': (user as any).fatherName || 'N/A',
      '{{MOTHER_NAME}}': (user as any).motherName || 'N/A',
      '{{PLACE_OF_BIRTH}}': user.address || 'N/A',
      '{{AGE}}': String(user.age || 0),
      '{{OCCUPATION}}': (user as any).occupation || 'N/A',
      '{{YEARS_IN_VILLAGE}}': String((user as any).yearsInVillage || 0),
      '{{SPOUSE_NAME}}': (user as any).spouseName || 'N/A',
      '{{MARRIAGE_DATE}}': formatDate((user as any).marriageDate),
      '{{MARRIAGE_PLACE}}': (user as any).marriagePlace || 'N/A',
      '{{DATE_OF_DEATH}}': formatDate((user as any).dateOfDeath),
      '{{PLACE_OF_DEATH}}': (user as any).placeOfDeath || 'N/A',
    };

    // Replace all placeholders in template
    for (const [placeholder, value] of Object.entries(certData)) {
      template = template.replace(new RegExp(placeholder, 'g'), value);
    }

    console.log(`Dynamically generated certificate for user: ${user.name}`);
    
    // Set response headers for download
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="Certificate-${certificate.certificateNumber}.html"`
    );

    // Send dynamically generated certificate
    res.send(template);
  } catch (error: any) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Download uploaded document for a certificate
// @route   GET /api/certificates/:id/documents/:docType
// @access  Private (Staff, Admin)
export const downloadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
      return;
    }

    const document = certificate.documents.find((doc: any) => doc.type === req.params.docType);
    if (!document) {
      res.status(404).json({
        success: false,
        message: 'Document not found'
      });
      return;
    }

    const filePath = path.resolve(document.filePath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'Document file not found'
      });
      return;
    }

    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);

    res.sendFile(filePath);
  } catch (error: any) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};