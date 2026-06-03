import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeadModal } from '../context/ModalContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { openModal } = useLeadModal();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Courses', to: '/courses' },
    { label: 'Placements', to: '/placements' },
    { label: 'Career Guidance', to: '/career-guidance' },
    { label: 'Contact', to: '/contact' }
  ];

  const handleCTA = () => {
    setIsOpen(false);
    openModal();
  };

  const isRouteActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-5">
      <nav
        className={`mx-auto flex h-[64px] max-w-[1200px] items-center justify-between rounded-full border border-white/30 bg-white/70 px-6 backdrop-blur-md transition-all duration-350 ${
          scrolled ? 'shadow-glass bg-white/80 border-white/50' : 'shadow-none'
        }`}
        aria-label="Primary"
      >
        {/* Brand Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-appleGray">
            <img src="/aurenza-logo.jpeg" alt="Aurenza Academy logo" className="h-6.5 w-6.5 rounded-full object-cover" />
          </span>
          <span className="truncate text-lg font-black tracking-tight text-[#111111] sm:text-xl">
            Aurenza <span className="text-applePurple font-black">Academy</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`text-[14.5px] font-semibold tracking-tight transition hover:text-applePurple ${
                isRouteActive(item.to) ? 'text-applePurple' : 'text-neutral-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-4.5 xl:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                className="flex items-center gap-1.5 rounded-full bg-appleGray border border-black/5 px-4.5 py-2 text-[14px] font-bold text-applePurple hover:bg-neutral-100"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-[14.5px] font-bold text-neutral-500 hover:text-applePurple transition"
              >
                <User size={15} />
                Login
              </Link>
              <button
                type="button"
                onClick={handleCTA}
                className="rounded-full bg-applePurple px-6 py-2.5 text-[14px] font-black text-white hover:bg-appleGlow transition"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-appleGray text-applePurple xl:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mx-auto mt-2 max-w-[1200px] rounded-3xl border border-white/40 bg-white/95 p-4 shadow-glass backdrop-blur-lg xl:hidden animate-fade-up">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`block rounded-2xl px-4 py-2.5 text-[15px] font-bold ${
                isRouteActive(item.to) ? 'bg-appleGray text-applePurple' : 'text-neutral-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-red-50 py-3 font-extrabold text-red-600"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-purple-100 py-3 font-extrabold text-[#625270]"
                >
                  <User size={18} />
                  Login to Portal
                </Link>
                <button
                  type="button"
                  onClick={handleCTA}
                  className="flex justify-center rounded-full bg-[linear-gradient(135deg,#8a00b8,#d829ef)] py-3.5 font-extrabold text-white"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
