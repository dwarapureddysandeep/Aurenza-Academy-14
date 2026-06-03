import { useState, useEffect } from 'react';
import { useLeadModal } from '../context/ModalContext';
import { leadService, courseService } from '../services/db';
import { toast } from 'react-hot-toast';
import { X, Send, Award, Star } from 'lucide-react';

export default function LeadModal() {
  const { isOpen, prefillCourse, closeModal } = useLeadModal();
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

  useEffect(() => {
    if (prefillCourse) {
      setFormData(prev => ({ ...prev, course: prefillCourse }));
    }
  }, [prefillCourse]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Please enter your name');
    if (!formData.email.trim()) return toast.error('Please enter your email');
    if (!formData.phone.trim()) return toast.error('Please enter your phone number');
    if (!formData.course) return toast.error('Please select an interested course');

    setLoading(true);
    try {
      await leadService.submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        message: formData.message
      });
      toast.success('Counseling request submitted successfully! Our expert will call you back.');
      setFormData({ name: '', email: '', phone: '', course: '', message: '' });
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-md">
      {/* Modal Card */}
      <div className="relative w-full max-w-[550px] rounded-[32px] border border-white/50 bg-white/80 p-6 shadow-premium sm:p-10 backdrop-blur-xl animate-fade-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-appleGray text-neutral-500 hover:bg-neutral-200 transition"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-appleGray text-applePurple">
            <Award size={20} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-appleDark">
            Start Your <span className="text-applePurple">Future Career</span>
          </h2>
          <p className="text-sm font-semibold text-neutral-500">
            Submit details below for high-priority placement counseling.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-xs font-bold text-appleDark">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="modal-name">Full Name</label>
              <input
                id="modal-name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-3.5 text-[14px] font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple"
              />
            </div>
            <div>
              <label htmlFor="modal-email">Email Address</label>
              <input
                id="modal-email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-3.5 text-[14px] font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="modal-phone">Phone Number</label>
              <input
                id="modal-phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-3.5 text-[14px] font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple"
              />
            </div>
            <div>
              <label htmlFor="modal-course">Interested Course</label>
              <select
                id="modal-course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-3.5 text-[14px] font-semibold text-appleDark outline-none focus:border-applePurple"
              >
                <option value="">Select a Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="modal-message">Message (Optional)</label>
            <textarea
              id="modal-message"
              name="message"
              rows={3}
              placeholder="Tell us about your background..."
              value={formData.message}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-3.5 text-[14px] font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-applePurple py-4 text-base font-extrabold text-white shadow-soft hover:bg-appleGlow transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Counseling Request'}
            <Send size={15} />
          </button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-bold text-applePurple">
          <Star size={14} fill="currentColor" />
          <span>Includes free placement guide & mock exam papers.</span>
        </div>
      </div>
    </div>
  );
}
