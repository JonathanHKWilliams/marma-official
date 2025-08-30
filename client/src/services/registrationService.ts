interface RegistrationData {
  fullName: string;
  age: string;
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

// Mock data for development - replace with actual Database calls
let mockRegistrations: any[] = [
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
const generateRegionalCode = (): string => {
  // ML = Mano River
  const prefix = 'ML';
  
  // Count existing registrations to determine the next number
  const existingCount = mockRegistrations.length;
  // Format with leading zeros (001, 002, etc.)
  const formattedNumber = String(existingCount + 1).padStart(3, '0');
  
  return `${prefix}${formattedNumber}`;
};

// Generate country-specific identification number (LIB001, SLE001, etc.)
const generateIdentificationNumber = (country: string): string => {
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
  const countryRegistrations = mockRegistrations.filter(reg => reg.country === country);
  const countryCount = countryRegistrations.length;
  
  // Format with leading zeros (001, 002, etc.)
  const formattedNumber = String(countryCount + 1).padStart(3, '0');
  
  return `${countryCode}${formattedNumber}`;
};

export const createRegistration = async (data: RegistrationData): Promise<void> => {
  // Check for duplicate email
  const existingRegistration = mockRegistrations.find(reg => reg.email === data.email);
  if (existingRegistration) {
    throw new Error('A registration with this email already exists');
  }

  // Generate codes
  const regionalCode = generateRegionalCode();
  const identificationNumber = generateIdentificationNumber(data.country);

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

  mockRegistrations.push(newRegistration);
  
  // Mock email sending
  await sendConfirmationEmail(data.email, data.fullName);
};

export const getRegistrations = async (): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRegistrations;
};

export const updateRegistrationStatus = async (
  id: string, 
  status: 'approved' | 'declined', 
  message: string
): Promise<void> => {
  const registration = mockRegistrations.find(reg => reg.id === id);
  if (registration) {
    registration.status = status;
    registration.statusMessage = message;
    registration.statusUpdatedAt = new Date().toISOString();
    
    // Mock email sending
    await sendStatusEmail(registration.email, registration.fullName, status, message);
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

const sendConfirmationEmail = async (email: string, fullName: string): Promise<void> => {
  // Mock email sending - replace with actual email service
  console.log(`Sending confirmation email to ${email} for ${fullName}`);
  
  // In a real implementation, you would include a template with registration details
  const emailTemplate = `
    Dear ${fullName},
    
    Thank you for registering with Marma. Your registration has been received and is pending review.
    
    You will receive another email once your registration has been processed.
    
    Best regards,
    The Marma Team
  `;
  
  console.log('Email content:', emailTemplate);
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const sendStatusEmail = async (
  email: string, 
  fullName: string, 
  status: string, 
  message: string
): Promise<void> => {
  // Mock email sending - replace with actual email service
  console.log(`Sending ${status} email to ${email} for ${fullName}: ${message}`);
  
  // In a real implementation, you would include a template with registration details
  const statusText = status === 'approved' ? 'approved' : 'declined';
  const nextStepsText = status === 'approved' 
    ? 'You will receive your official membership details shortly.'
    : 'Please review the feedback below and consider reapplying if appropriate.';
  
  const emailTemplate = `
    Dear ${fullName},
    
    Your Marma registration has been ${statusText}.
    
    ${nextStepsText}
    
    Message from the admin:
    ${message}
    
    Best regards,
    The Marma Team
  `;
  
  console.log('Email content:', emailTemplate);
  await new Promise(resolve => setTimeout(resolve, 1000));
};