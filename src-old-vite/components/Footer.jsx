import { useState } from 'react';
import { useLeadModal } from '../context/ModalContext';
import { siteService } from '../services/db';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, MapPin, PhoneCall } from 'lucide-react';

export default function Footer() {
  const { openModal } = useLeadModal();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    
    setLoading(true);
    try {
      await siteService.submitNewsletter(email);
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (err) {
      toast.error('Newsletter subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com' },
    { icon: Instagram, href: 'https://instagram.com' },
    { icon: Twitter, href: 'https://twitter.com' },
    { icon: Linkedin, href: 'https://linkedin.com' },
    { icon: Youtube, href: 'https://youtube.com' }
  ];

  return (
    <footer className="border-t border-neutral-100 bg-appleGray">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 lg:grid-cols-[1.15fr_1fr_1fr_1.35fr]">
        {/* Branding Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/aurenza-logo.jpeg" alt="Aurenza Academy logo" className="h-10 w-10 rounded-full object-cover" />
            <p className="text-xl font-black tracking-tight text-appleDark">
              Aurenza <span className="text-applePurple">Academy</span>
            </p>
          </div>
          <p className="max-w-[300px] text-[15px] font-medium leading-[1.55] text-neutral-500">
            Democratizing professional tech roles through elite engineering bootcamps and 1-on-1 advisor referral support.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <a
                href={social.href}
                key={index}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 border border-black/5 shadow-soft transition hover:-translate-y-0.5 hover:text-applePurple"
                aria-label="Aurenza Social Link"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-[14px] font-black uppercase tracking-[0.05em] text-appleDark">Quick Links</h3>
          <div className="mt-5 grid gap-3">
            <Link to="/about" className="text-[14.5px] font-medium text-neutral-500 hover:text-applePurple transition">About Us</Link>
            <Link to="/courses" className="text-[14.5px] font-medium text-neutral-500 hover:text-applePurple transition">Courses Catalog</Link>
            <Link to="/placements" className="text-[14.5px] font-medium text-neutral-500 hover:text-applePurple transition">Placements</Link>
            <Link to="/career-guidance" className="text-[14.5px] font-medium text-neutral-500 hover:text-applePurple transition">Guidance Portal</Link>
            <Link to="/contact" className="text-[14.5px] font-medium text-neutral-500 hover:text-applePurple transition">Contact Us</Link>
          </div>
        </div>

        {/* Popular Courses Column */}
        <div>
          <h3 className="text-lg font-black uppercase tracking-[0.05em] text-[#070019]">Core Courses</h3>
          <div className="mt-6 grid gap-3.5">
            <Link to="/courses/java-full-stack-development" className="text-[17px] font-medium text-[#5f5071] transition hover:text-[#8c00bd]">Java Full Stack</Link>
            <Link to="/courses/frontend-development-react-nextjs" className="text-[17px] font-medium text-[#5f5071] transition hover:text-[#8c00bd]">React Frontend Dev</Link>
            <Link to="/courses/data-science-analytics" className="text-[17px] font-medium text-[#5f5071] transition hover:text-[#8c00bd]">Data Science</Link>
            <Link to="/courses/ai-machine-learning-engineering" className="text-[17px] font-medium text-[#5f5071] transition hover:text-[#8c00bd]">AI & ML Engineer</Link>
            <Link to="/courses/aptitude-interview-bootcamp" className="text-[17px] font-medium text-[#5f5071] transition hover:text-[#8c00bd]">Aptitude Training</Link>
          </div>
        </div>

        {/* Newsletter & Contacts */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-[0.05em] text-[#070019]">Newsletter</h3>
            <p className="mt-3 text-[16px] font-medium text-[#5f5071]">
              Get placement tips & course updates monthly.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex max-w-[345px] overflow-hidden rounded-[26px] bg-white border border-[#eadcf0] shadow-[0_16px_36px_rgba(139,0,184,0.08)]">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="min-w-0 flex-1 px-5 text-[15px] font-semibold text-[#170923] outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#9700ba] px-6 text-base font-extrabold text-white transition hover:bg-[#8300a3]"
              >
                {loading ? '...' : 'Join'}
              </button>
            </form>
          </div>

          <div className="grid gap-3 text-[17px] font-medium text-[#5f5071]">
            <p className="flex items-center gap-3">
              <PhoneCall size={18} className="text-[#8c00bd]" />
              <a href="tel:+917013057827" className="hover:text-[#8c00bd]">+91 70130 57827</a>
            </p>
            <p className="flex items-center gap-3">
              <PhoneCall size={18} className="text-[#8c00bd]" />
              <a href="tel:+447417585004" className="hover:text-[#8c00bd]">+44 7417 585004</a>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-[#8c00bd]" />
              <a href="mailto:info@aurenzaacademy.com" className="hover:text-[#8c00bd]">info@aurenzaacademy.com</a>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-[#8c00bd]" />
              <a href="mailto:support@aurenzaacademy.com" className="hover:text-[#8c00bd]">support@aurenzaacademy.com</a>
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={18} className="text-[#8c00bd]" />
              <span>Bengaluru, India</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom Bar */}
      <div className="mx-auto max-w-[1600px] border-t border-[#e8d8ee] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold text-[#5f5071]">
        <p>© 2026 Aurenza Academy. All rights reserved.</p>
        <button
          type="button"
          onClick={() => openModal()}
          className="text-[#8c00bd] hover:underline"
        >
          Book Counseling Session Now
        </button>
      </div>
    </footer>
  );
}
