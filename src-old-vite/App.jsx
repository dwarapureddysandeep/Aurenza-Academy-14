import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { Toaster } from 'react-hot-toast';

// Shared Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import AuriChatbot from './components/AuriChatbot';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import PlacementsPage from './pages/PlacementsPage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Layout wrapper to show/hide navigation globally
function AppLayout({ children }) {
  const location = useLocation();
  // Hide Navbar, Footer & floating chatbot on dashboards or login routes
  const isDashboard = location.pathname.includes('-dashboard') || location.pathname === '/login';

  return (
    <div className="min-h-screen premium-bg-container font-sans text-[#170923] relative z-0">
      {/* Subtle animated floating particles */}
      <div className="floating-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 18}s`
            }}
          />
        ))}
      </div>
      {!isDashboard && <Navbar />}
      <main className="relative z-10">{children}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <AuriChatbot />}
      <LeadModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 5000,
              style: {
                background: '#171223',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}
          />
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetailsPage />} />
              <Route path="/placements" element={<PlacementsPage />} />
              <Route path="/career-guidance" element={<CareerGuidancePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Secure Student Portal Route */}
              <Route 
                path="/student-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Secure Administrator Panel Route */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'counselor', 'placement_officer', 'staff']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}
