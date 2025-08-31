// Import services
import { sendRegistrationConfirmation, sendStatusNotification, notifyAdminOfNewRegistration } from './emailService';
import { loadData, saveData, updateItem, addItem, STORAGE_KEYS } from './storageService';

interface RegistrationData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  educationLevel: string;
  churchOrganization: string;
  position: string;
  recommendationName: string;
  recommendationContact: string;
  recommendationRelationship: string;
  recommendationChurch: string;
  membershipPurpose: string;
  // New fields
  regionalCode?: string; // Generated code like ML001
  identificationNumber?: string; // Country-specific ID like LIB001
  maritalStatus?: string;
  gender?: string;
  photo?: string; // Base64 encoded image or URL
  signedBy?: string;
  approvedBy?: string;
  attestedBy?: string;
}

// Initial sample data for development - will be replaced with actual data from storage
const initialRegistrations: any[] = [
  {
    id: '1',
    fullName: 'Rev. Peter Flourish',
    age: '45',
    email: 'peter.flourish@church.lr',
    phone: '+231-555-0123',
    country: 'Liberia',
    address: '123 Church Street, Monrovia',
    educationLevel: 'Theological Seminary',
    churchOrganization: 'First Baptist Church Monrovia',
    position: 'Senior Pastor',
    recommendationName: 'Bishop David Johnson',
    recommendationContact: 'bishop.johnson@email.com',
    recommendationRelationship: 'District Supervisor',
    recommendationChurch: 'Regional Baptist Convention',
    membershipPurpose: 'To strengthen inter-denominational cooperation and foster unity among Christian leaders in the Mano River region.',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    fullName: 'Pastor Sarah Kamara',
    age: '38',
    email: 'sarah.kamara@ministry.sl',
    phone: '+232-555-0456',
    country: 'Sierra Leone',
    address: '456 Faith Avenue, Freetown',
    educationLevel: "Master's Degree",
    churchOrganization: 'Grace Methodist Church',
    position: 'Lead Pastor',
    recommendationName: 'Rev. Michael Davis',
    recommendationContact: 'rev.davis@methodist.sl',
    recommendationRelationship: 'Senior Minister',
    recommendationChurch: 'Methodist Conference Sierra Leone',
    membershipPurpose: 'To participate in regional evangelism efforts and contribute to theological education initiatives.',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Generate a regional code (ML001, ML002, etc.)
const generateRegionalCode = async (): Promise<string> => {
  // ML = Mano River
  const prefix = 'ML';
  
  // Count existing registrations to determine the next number
  const registrations = await getRegistrations();
  const existingCount = registrations.length;
  // Format with leading zeros (001, 002, etc.)
  const formattedNumber = String(existingCount + 1).padStart(3, '0');
  
  return `${prefix}${formattedNumber}`;
};

// Generate country-specific identification number (LIB001, SLE001, etc.)
const generateIdentificationNumber = async (country: string): Promise<string> => {
  // Map of country to country code
  const countryCodes: Record<string, string> = {
    'Liberia': 'LIB',
    'Sierra Leone': 'SLE',
    'Guinea': 'GUI',
    'Ivory Coast': 'IVC',
    'Côte d\'Ivoire': 'IVC',
    // Add more countries as needed
  };
  
  // Get country code or use 'INT' (International) as default
  const countryCode = countryCodes[country] || 'INT';
  
  // Count existing registrations from this country
  const registrations = await getRegistrations();
  const countryRegistrations = registrations.filter(reg => reg.country === country);
  const countryCount = countryRegistrations.length;
  
  // Format with leading zeros (001, 002, etc.)
  const formattedNumber = String(countryCount + 1).padStart(3, '0');
  
  return `${countryCode}${formattedNumber}`;
};

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Validate phone number format
const validatePhone = (phone: string): boolean => {
  // Allow for international format with country code
  // Examples: +231-555-0123, +1 (555) 123-4567, etc.
  const phoneRegex = /^\+?[0-9]{1,4}[-.\s]?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const createRegistration = async (data: RegistrationData): Promise<void> => {
  // Validate email format
  if (!validateEmail(data.email)) {
    throw new Error('Please enter a valid email address');
  }

  // Validate phone format
  if (!validatePhone(data.phone)) {
    throw new Error('Please enter a valid phone number with country code (e.g., +231-555-0123)');
  }

  // Get existing registrations
  const registrations = await getRegistrations();

  // Check for duplicate email
  const existingEmailRegistration = registrations.find(reg => reg.email === data.email);
  if (existingEmailRegistration) {
    throw new Error('A registration with this email already exists');
  }

  // Check for duplicate phone number
  const existingPhoneRegistration = registrations.find(reg => reg.phone === data.phone);
  if (existingPhoneRegistration) {
    throw new Error('A registration with this phone number already exists');
  }

  // Generate codes
  const regionalCode = await generateRegionalCode();
  const identificationNumber = await generateIdentificationNumber(data.country);

  // Set default values for authorization fields if not provided
  const signedBy = data.signedBy || 'Pending';
  const approvedBy = data.approvedBy || 'Pending';
  const attestedBy = data.attestedBy || 'Pending';

  // Add new registration
  const newRegistration = {
    id: Date.now().toString(),
    ...data,
    regionalCode,
    identificationNumber,
    signedBy,
    approvedBy,
    attestedBy,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Add to storage
  await addItem(STORAGE_KEYS.REGISTRATIONS, newRegistration);
  
  // Update local storage with all registrations
  const updatedRegistrations = [...registrations, newRegistration];
  await saveData(STORAGE_KEYS.REGISTRATIONS, updatedRegistrations);
  
  try {
    // Send confirmation email to the registrant
    await sendConfirmationEmail(data.email, data.fullName, newRegistration);
    
    // Notify admin about the new registration
    await notifyAdminOfNewRegistration(newRegistration);
  } catch (error) {
    console.error('Error sending emails:', error);
    // Continue with registration process even if email sending fails
    // In a production environment, you might want to log this to a monitoring service
  }
};

export const getRegistrations = async (): Promise<any[]> => {
  // Load registrations from storage
  return await loadData(STORAGE_KEYS.REGISTRATIONS, initialRegistrations);
};

export const updateRegistrationStatus = async (
  id: string, 
  status: 'approved' | 'declined', 
  message: string
): Promise<void> => {
  // Get current registrations
  const registrations = await getRegistrations();
  const registration = registrations.find(reg => reg.id === id);
  
  if (registration) {
    // Update registration status
    const updates = {
      status,
      statusMessage: message,
      statusUpdatedAt: new Date().toISOString()
    };
    
    // Update in storage
    await updateItem<any>(STORAGE_KEYS.REGISTRATIONS, id, updates);
    
    // Update local object for email sending
    Object.assign(registration, updates);
    
    try {
      // Send status update email to the registrant
      await sendStatusEmail(registration.email, registration.fullName, status, message, registration);
    } catch (error) {
      console.error(`Error sending ${status} email:`, error);
      // Continue with status update even if email sending fails
      // In a production environment, you might want to log this to a monitoring service
    }
  } else {
    throw new Error(`Registration with ID ${id} not found`);
  }
};

export const exportRegistrations = async (registrations: any[]): Promise<void> => {
  const csvContent = [
    'Name,Email,Phone,Country,Gender,Marital Status,Church/Organization,Position,Education,Status,Regional Code,ID Number,Date Registered',
    ...registrations.map(reg => 
      `"${reg.fullName}","${reg.email}","${reg.phone}","${reg.country}","${reg.gender || ''}","${reg.maritalStatus || ''}","${reg.churchOrganization || ''}","${reg.position || ''}","${reg.educationLevel || ''}","${reg.status || 'pending'}","${reg.regionalCode || ''}","${reg.identificationNumber || ''}","${new Date(reg.createdAt).toLocaleDateString()}"`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `marma-registrations-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const sendConfirmationEmail = async (email: string, fullName: string, registrationData: any): Promise<void> => {
  try {
    await sendRegistrationConfirmation(email, fullName, registrationData);
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    throw error;
  }
};

const sendStatusEmail = async (
  email: string, 
  fullName: string, 
  status: 'approved' | 'declined', 
  message: string,
  registrationData: any
): Promise<void> => {
  try {
    await sendStatusNotification(email, fullName, status, message, registrationData);
  } catch (error) {
    console.error(`Error in sendStatusEmail:`, error);
    throw error;
  }
};