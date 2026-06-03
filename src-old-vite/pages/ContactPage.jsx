import { useState, useEffect } from 'react';
import { leadService, courseService } from '../services/db';
import { toast } from 'react-hot-toast';
import { Mail, PhoneCall, MapPin, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    courseService.getCourses().then(data => setCourses(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Please enter your name');
    if (!formData.email.trim()) return toast.error('Please enter your email');
    if (!formData.phone.trim()) return toast.error('Please enter your phone number');
    if (!formData.course) return toast.error('Please select a course');

    setLoading(true);
    try {
      await leadService.submitLead(formData);
      toast.success('Message sent! Our support team will respond within 4 hours.');
      setFormData({ name: '', email: '', phone: '', course: '', message: '' });
    } catch (err) {
      toast.error('Failed to submit message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-soft-radial font-sans text-appleDark min-h-screen pt-24 pb-28 relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -left-30 w-[380px] h-[380px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />

      {/* 1. HEADER SECTION */}
      <section className="py-20 relative z-10 border-b border-black/[0.03]">
        <div className="mx-auto max-w-[1200px] px-6 text-center space-y-5 animate-fade-up">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-applePurple bg-applePurple/5 px-3.5 py-1.5 rounded-full border border-applePurple/10">Support Hub</span>
          <h1 className="text-[clamp(2.4rem,4.5vw,4.5rem)] font-black leading-[1.08] text-appleDark tracking-tight">
            Get in touch <span className="bg-apple-gradient bg-clip-text text-transparent">with our team</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-base font-semibold leading-relaxed text-neutral-400">
            Have a question about enrollment payments, course batches, or placement referred audits? Contact us.
          </p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM */}
      <div className="mx-auto max-w-[1200px] px-6 mt-16 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] animate-fade-up">
          
          {/* Support Contacts */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-appleDark tracking-tight">Contact Details</h2>
              <p className="text-sm font-semibold text-neutral-400">Feel free to call, email, or chat with our admissions directors.</p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
                  <PhoneCall size={18} />
                </span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Telephone Enquiries</h4>
                  <p className="text-[15px] font-bold text-appleDark mt-1">
                    <a href="tel:+917013057827" className="hover:text-applePurple transition duration-300">+91 70130 57827</a> (India)
                  </p>
                  <p className="text-[15px] font-bold text-appleDark mt-1">
                    <a href="tel:+447417585004" className="hover:text-applePurple transition duration-300">+44 7417 585004</a> (UK)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
                  <Mail size={18} />
                </span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Email Support</h4>
                  <p className="text-[15px] font-bold text-appleDark mt-1">
                    <a href="mailto:info@aurenzaacademy.com" className="hover:text-applePurple transition duration-300">info@aurenzaacademy.com</a>
                  </p>
                  <p className="text-[15px] font-bold text-appleDark mt-1">
                    <a href="mailto:support@aurenzaacademy.com" className="hover:text-applePurple transition duration-300">support@aurenzaacademy.com</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
                  <MapPin size={18} />
                </span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Headquarters Office</h4>
                  <p className="text-[15px] font-bold text-appleDark mt-1">Bengaluru, India</p>
                  <p className="text-[11px] font-semibold text-neutral-400 mt-1">Hours: Mon-Sat, 9:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="rounded-3xl border border-black/5 bg-white/50 backdrop-blur-md p-6 space-y-4 shadow-soft">
              <h4 className="text-[15px] font-black text-appleDark tracking-tight flex items-center gap-2">
                <MessageCircle size={20} className="text-emerald-500 fill-emerald-500" /> WhatsApp Live Chat
              </h4>
              <p className="text-xs font-semibold text-neutral-400 leading-relaxed">
                Need instantaneous admissions help? Launch WhatsApp chat directly to coordinate with a counselor.
              </p>
              <a
                href="https://wa.me/917013057827"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition duration-300 shadow-soft"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="glass-panel p-8 sm:p-10 rounded-[36px] shadow-premium space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-appleDark tracking-tight">Send a Message</h2>
              <p className="text-xs font-semibold text-neutral-400">Fill out details and we will coordinate placement counseling.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Phone Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-course" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Target Course</label>
                  <select
                    id="contact-course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300"
                  >
                    <option value="">Select a Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Inquiry Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Share details about your education background, career goals, or specific batch enquiries..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
