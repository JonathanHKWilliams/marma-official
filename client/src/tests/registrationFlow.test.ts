import { createRegistration, updateRegistrationStatus, getRegistrations } from '../services/registrationService';

// Mock test data
const testRegistrationData = {
  fullName: 'Test User',
  dateOfBirth: '1990-01-01',
  email: 'test@example.com',
  phone: '+1234567890',
  country: 'United States',
  address: '123 Test St, Test City, TS 12345',
  educationLevel: 'Bachelor\'s Degree',
  churchOrganization: 'Test Church',
  position: 'Pastor',
  recommendationName: 'John Doe',
  recommendationContact: 'john@example.com',
  recommendationRelationship: 'Senior Pastor',
  recommendationChurch: 'Example Church',
  membershipPurpose: 'To serve the community',
  maritalStatus: 'Married',
  gender: 'Male'
};

// Test registration flow
async function testRegistrationFlow() {
  let testRegistrationId = '';
  console.log('--- Starting Registration Flow Test ---');
  
  try {
    // Step 1: Create a new registration
    console.log('Step 1: Creating a new registration...');
    await createRegistration(testRegistrationData);
    console.log('✅ Registration created successfully');
    console.log('✅ Confirmation email should be sent to the user');
    console.log('✅ Notification email should be sent to the admin');
    
    // Get the latest registration to find our test registration
    console.log('Getting registration ID...');
    const registrations = await getRegistrations();
    const foundRegistration = registrations.find(reg => reg.email === 'test@example.com');
    
    if (!foundRegistration) {
      throw new Error('Test registration not found! The creation may have failed.');
    }
    
    testRegistrationId = foundRegistration.id;
    console.log(`Found test registration with ID: ${testRegistrationId}`);
    
    // Step 2: Test approval flow
    console.log('\nStep 2: Testing approval flow...');
    try {
      await updateRegistrationStatus(
        testRegistrationId, 
        'approved', 
        'Congratulations! Your membership has been approved.'
      );
      console.log('✅ Registration status updated to approved');
      console.log('✅ Approval email should be sent to the user');
    } catch (error) {
      console.error('❌ Error updating registration status to approved:', error);
    }
    
    // Step 3: Test decline flow
    console.log('\nStep 3: Testing decline flow...');
    try {
      await updateRegistrationStatus(
        testRegistrationId, 
        'declined', 
        'We regret to inform you that your application does not meet our current requirements.'
      );
      console.log('✅ Registration status updated to declined');
      console.log('✅ Decline email should be sent to the user');
    } catch (error) {
      console.error('❌ Error updating registration status to declined:', error);
    }
    
    console.log('\n--- Registration Flow Test Completed Successfully ---');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRegistrationFlow();

// Export for potential use in other tests
export { testRegistrationFlow };
