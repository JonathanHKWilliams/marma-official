
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute'
import TestRegistrationFlow from './components/tests/TestRegistrationFlow';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/test-registration" element={<TestRegistrationFlow />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;