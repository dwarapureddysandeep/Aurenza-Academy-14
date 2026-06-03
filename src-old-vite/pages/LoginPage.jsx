import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Phone, LogIn, UserPlus, HelpCircle } from 'lucide-react';

export default function LoginPage() {
  const { user, login, signup, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  // Redirect to dashboards if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin-dashboard', { replace: true });
      else navigate('/student-dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return toast.error('Please enter your email');
    
    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return toast.error('Please enter a valid email address');
    }

    if (!formData.password.trim()) return toast.error('Please enter your password');
    if (formData.password.trim().length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    try {
      if (isSignUp) {
        if (!formData.name.trim()) return toast.error('Please enter your full name');
        if (formData.name.trim().length < 3) {
          return toast.error('Name must be at least 3 characters long');
        }
        if (!formData.phone.trim()) return toast.error('Please enter your phone number');
        
        const phoneRegex = /^[0-9+\s-]{10,15}$/;
        if (!phoneRegex.test(formData.phone.trim())) {
          return toast.error('Please enter a valid phone number');
        }
        
        await signup(formData.email, formData.password, formData.name, formData.phone);
        toast.success('Registration successful! Redirecting to student dashboard...');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back! Login successful.');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="bg-white bg-soft-radial font-sans text-appleDark min-h-screen flex items-center justify-center pt-24 pb-20 px-6 relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -left-30 w-[380px] h-[380px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[460px] glass-panel rounded-[36px] p-8 sm:p-10 shadow-premium animate-fade-up space-y-8 relative z-10">
        
        {/* Title branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-black/5 shadow-soft">
              <img src="/aurenza-logo.jpeg" alt="Aurenza logo" className="h-7 w-7 rounded-full object-cover" />
            </span>
            <span className="text-lg font-black text-appleDark tracking-tight">
              Aurenza <span className="text-applePurple">Academy</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-appleDark tracking-tight">
            {isSignUp ? 'Create Student Account' : 'Sign In To Portal'}
          </h2>
          <p className="text-xs font-semibold text-neutral-400">
            {isSignUp ? 'Unlock course tracks & mock counseling tools' : 'Access progress, certificate downloads & roadmaps'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              {/* Full Name */}
              <div className="relative flex items-center bg-appleGray/45 border border-black/10 rounded-2xl px-4 focus-within:border-applePurple focus-within:bg-white transition-all duration-300">
                <User size={16} className="text-applePurple opacity-80" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none"
                />
              </div>

              {/* Phone */}
              <div className="relative flex items-center bg-appleGray/45 border border-black/10 rounded-2xl px-4 focus-within:border-applePurple focus-within:bg-white transition-all duration-300">
                <Phone size={16} className="text-applePurple opacity-80" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative flex items-center bg-appleGray/45 border border-black/10 rounded-2xl px-4 focus-within:border-applePurple focus-within:bg-white transition-all duration-300">
            <Mail size={16} className="text-applePurple opacity-80" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center bg-appleGray/45 border border-black/10 rounded-2xl px-4 focus-within:border-applePurple focus-within:bg-white transition-all duration-300">
            <Lock size={16} className="text-applePurple opacity-80" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              'Authenticating...'
            ) : isSignUp ? (
              <>
                Create Account <UserPlus size={16} />
              </>
            ) : (
              <>
                Sign In <LogIn size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center text-xs font-bold text-neutral-400">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(false)} className="text-applePurple hover:text-appleGlow transition duration-300 font-extrabold">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(true)} className="text-applePurple hover:text-appleGlow transition duration-300 font-extrabold">
                Register as Student
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
