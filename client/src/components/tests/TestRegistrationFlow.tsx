import React, { useState } from 'react';
import { testRegistrationFlow } from '../../tests/registrationFlow.test';

const TestRegistrationFlow: React.FC = () => {
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    setTestOutput(['Starting test...']);

    // Override console.log to capture output
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setTestOutput(prev => [...prev, args.join(' ')]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setTestOutput(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalError(...args);
    };

    try {
      await testRegistrationFlow();
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      // Restore console functions
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Registration Flow Test</h2>
        <p className="text-gray-600 mb-6">
          This test will simulate the complete registration flow including email notifications.
          Check the console for detailed logs of the email content.
        </p>
        
        <button
          onClick={runTest}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Test...' : 'Run Registration Flow Test'}
        </button>
      </div>

      {testOutput.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm overflow-auto max-h-[500px]">
          {testOutput.map((line, index) => (
            <div key={index} className="mb-1">
              {line.startsWith('ERROR:') ? (
                <span className="text-red-400">{line}</span>
              ) : line.includes('✅') ? (
                <span className="text-green-400">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestRegistrationFlow;
