import React, { useState } from 'react';
import { createRegistration, getRegistrations } from '../../services/registrationService';

// Test component to verify registration form to dashboard connection
const TestRegistrationFlow: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Create a test registration
  const createTestRegistration = async () => {
    setIsRunning(true);
    setTestResults(prev => [...prev, "Starting test..."]);

    try {
      // Step 1: Get current registrations count
      const initialRegistrations = await getRegistrations();
      setTestResults(prev => [...prev, `Initial registrations count: ${initialRegistrations.length}`]);

      // Step 2: Create a test registration
      const testData = {
        fullName: `Test User ${Date.now()}`,
        age: '30',
        email: `test${Date.now()}@example.com`,
        phone: '+1234567890',
        country: 'Liberia',
        address: 'Test Address',
        educationLevel: "Bachelor's Degree",
        churchOrganization: 'Test Church',
        position: 'Pastor',
        recommendationName: 'Test Recommender',
        recommendationContact: 'recommender@example.com',
        recommendationRelationship: 'Senior Pastor',
        recommendationChurch: 'Recommender Church',
        membershipPurpose: 'Testing the registration flow',
        maritalStatus: 'Single',
        gender: 'Male',
        photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', // Tiny base64 image
        signedBy: 'Test Signer',
        approvedBy: 'Test Approver',
        attestedBy: 'Test Attester',
      };

      await createRegistration(testData);
      setTestResults(prev => [...prev, "Test registration created successfully"]);

      // Step 3: Verify the registration was added
      const updatedRegistrations = await getRegistrations();
      setTestResults(prev => [...prev, `Updated registrations count: ${updatedRegistrations.length}`]);

      // Step 4: Verify the new registration details
      const newRegistration = updatedRegistrations[updatedRegistrations.length - 1];
      setTestResults(prev => [
        ...prev, 
        "New registration details:",
        `- Name: ${newRegistration.fullName}`,
        `- Email: ${newRegistration.email}`,
        `- Status: ${newRegistration.status}`,
        `- Regional Code: ${newRegistration.regionalCode}`,
        `- ID Number: ${newRegistration.identificationNumber}`
      ]);

      setTestResults(prev => [...prev, "Test completed successfully!"]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => [...prev, `Error: ${errorMessage}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Registration Flow Test</h1>
      
      <button
        onClick={createTestRegistration}
        disabled={isRunning}
        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
      >
        {isRunning ? 'Running Test...' : 'Run Test'}
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">
              {testResults.join('\n')}
            </pre>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Click "Run Test" to create a test registration</li>
          <li>The test will create a new registration with test data</li>
          <li>Check the test results to verify the registration was created successfully</li>
          <li>Navigate to the Admin Dashboard to verify the new registration appears</li>
          <li>Check both the Registrations tab and Dashboard Overview to ensure the registration is visible</li>
        </ol>
      </div>
    </div>
  );
};

export default TestRegistrationFlow;
