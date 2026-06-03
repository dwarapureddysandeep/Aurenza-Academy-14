"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enrollStudentAction, loginUser, registerUser } from '@/lib/actions';
import { ShieldCheck, IndianRupee, Sparkles, CreditCard, Wallet, Landmark, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutWidgetProps {
  course: any;
  initialUser: any;
}

export default function CheckoutWidget({ course, initialUser }: CheckoutWidgetProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(initialUser);
  const [loading, setLoading] = useState(false);
  
  // Auth Form State (for guests)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Payment states
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success' | 'failed'>('select');
  const [txnId, setTxnId] = useState('');

  // Invoice calculations
  const originalPrice = course.price;
  const gstAmount = Math.round(originalPrice * 0.18);
  const totalPrice = originalPrice + gstAmount;

  // Handle inline register
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading(authMode === 'register' ? "Creating your learner profile..." : "Authenticating session...", { id: "auth" });

    let res;
    if (authMode === 'register') {
      res = await registerUser({ name, email, password, phone });
    } else {
      res = await loginUser({ email, password });
    }

    setLoading(false);
    if (res.success) {
      toast.success(authMode === 'register' ? "Registration successful!" : "Logged in successfully!", { id: "auth" });
      setUser(res.user);
      router.refresh();
    } else {
      toast.error(res.error || "Authentication failed.", { id: "auth" });
    }
  };

  // Launch Razorpay Simulation
  const handleOpenRazorpay = () => {
    if (!user) {
      toast.error("Please sign in or register to complete purchase.");
      return;
    }
    setPaymentStep('select');
    setRazorpayOpen(true);
  };

  // Process Simulated Payment
  const handleSimulatePayment = async (status: 'Success' | 'Failed') => {
    setPaymentStep('processing');
    
    // Simulate gateway delay
    await new Promise(r => setTimeout(r, 2000));

    if (status === 'Failed') {
      setPaymentStep('failed');
      toast.error("Simulated transaction declined by bank.");
      return;
    }

    // Call server action to log payment & enrollment in database
    toast.loading("Verifying transaction credentials...", { id: "payment" });
    const res = await enrollStudentAction(user.id, course.id, totalPrice);
    
    if (res.success) {
      toast.success("Tuition invoice paid successfully!", { id: "payment" });
      setTxnId(res.payment?.txId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setPaymentStep('success');

      // Auto redirect to student dashboard after 3s
      setTimeout(() => {
        setRazorpayOpen(false);
        router.push('/student');
        router.refresh();
      }, 3000);
    } else {
      setPaymentStep('failed');
      toast.error(res.error || "Failed to log enrollment.", { id: "payment" });
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Left Column: Inline Auth (Guest) or User Billing summary */}
      <div className="lg:col-span-7 space-y-6">
        
        {!user ? (
          <div className="bg-white border border-borderLight p-6 sm:p-10 rounded-[32px] shadow-soft space-y-6">
            <div className="space-y-1.5 text-center lg:text-left">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Step 1: Learner Credentials
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0C182F] heading leading-none">
                Let's configure your <span className="text-gradient-purple-pink">learning profile</span>
              </h2>
              <p className="text-xs text-textSecondary">
                Register or log in to lock in your live cohort seats and certification verification records.
              </p>
            </div>

            {/* Toggle auth mode */}
            <div className="flex bg-[#F1F5F9] rounded-lg p-1 text-xs font-bold text-textSecondary max-w-xs mx-auto lg:mx-0">
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-center rounded-md transition ${authMode === 'register' ? 'bg-white text-primary shadow-sm' : ''}`}
              >
                Fast Signup (New Learner)
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-center rounded-md transition ${authMode === 'login' ? 'bg-white text-primary shadow-sm' : ''}`}
              >
                Sign In (Existing)
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4 text-xs font-semibold">
              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-textSecondary uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sandeep Kumar"
                    className="glass-input"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textSecondary uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sandeep@gmail.com"
                  className="glass-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textSecondary uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create session password"
                  className="glass-input"
                />
              </div>

              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-textSecondary uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="glass-input"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primaryHover text-white text-xs font-black uppercase tracking-wider rounded-xl transition"
              >
                {loading ? "Configuring Session..." : authMode === 'register' ? "Register Profile & Continue" : "Sign In & Continue"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-borderLight p-6 sm:p-10 rounded-[32px] shadow-soft space-y-6">
            <div className="flex justify-between items-center border-b border-borderLight pb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 1: Session Details</span>
                <h3 className="text-lg font-extrabold text-[#0C182F] mt-1 heading leading-none">Verified Learner Account</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-successGreen/5 border border-successGreen/10 text-successGreen text-[10px] font-bold uppercase tracking-wider">
                Active Session
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs text-textSecondary">
              <div>
                <span className="text-[9px] uppercase tracking-wide block font-bold">Learner Name</span>
                <strong className="text-textPrimary mt-0.5 block">{user.name}</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wide block font-bold">Corporate Contact</span>
                <strong className="text-textPrimary mt-0.5 block">{user.email}</strong>
                {user.phone && <span className="text-[10px] mt-0.5 block">{user.phone}</span>}
              </div>
            </div>
            
            <p className="text-[11px] text-textSecondary bg-sectionBg border border-borderLight rounded-xl p-3.5 leading-relaxed">
              ✓ All course completion credentials will be issued to this name. To update billing names, modify profile metrics in student settings.
            </p>
          </div>
        )}

      </div>

      {/* Right Column: Invoice and Checkout Button */}
      <div className="lg:col-span-5 bg-white border border-borderLight p-6 sm:p-8 rounded-[32px] shadow-premium relative space-y-6">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/5 rounded-full filter blur-[45px] pointer-events-none"></div>
        
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 2: Invoice Summary</span>
          <h3 className="text-lg font-extrabold text-textPrimary mt-1 heading leading-none">Program Billing</h3>
        </div>

        {/* Invoice breakdown table */}
        <div className="space-y-3.5 text-xs text-textSecondary">
          <div className="flex justify-between items-center">
            <span>{course.name} Certification</span>
            <strong className="text-textPrimary">₹{originalPrice.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between items-center text-green-500 font-bold">
            <span>Special Promotional Coupon</span>
            <span>- ₹0</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Taxes & GST (18%)</span>
            <strong className="text-textPrimary">₹{gstAmount.toLocaleString()}</strong>
          </div>
          <div className="border-t border-borderLight pt-3.5 flex justify-between items-center text-sm font-black text-textPrimary heading">
            <span>Total Payable Amount</span>
            <span className="text-lg text-primary">₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleOpenRazorpay}
          disabled={!user}
          className={`w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-black text-white hover:opacity-95 transition flex items-center justify-center gap-2 hover:shadow-neonPurple uppercase tracking-wider text-center ${!user ? 'opacity-40 cursor-not-allowed bg-neutral-300' : ''}`}
        >
          Pay with Razorpay →
        </button>

        <div className="text-center text-[10px] text-textSecondary flex justify-center items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-successGreen" />
          <span>Transactions protected by 256-bit bank encryption standards.</span>
        </div>

      </div>

      {/* ─── RAZORPAY MODAL SIMULATION OVERLAY ─── */}
      {razorpayOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white text-textPrimary shadow-2xl animate-fade-up border border-[#ECECF4]">
            
            {/* Modal Header */}
            <div className="bg-[#1E1E38] p-5 text-white flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3F51B5] font-black text-white text-lg flex items-center justify-center">R</div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-wide">Razorpay Checkout</h4>
                  <p className="text-[10px] text-gray-400">Aurenza Academy Payment Hub</p>
                </div>
              </div>
              <button 
                onClick={() => setRazorpayOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
                title="Cancel Payment"
              >
                <span className="text-sm">Cancel</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* SELECT METHOD */}
              {paymentStep === 'select' && (
                <div className="space-y-5">
                  <div className="bg-[#F8FAFC] border border-[#ECECF4] p-4 rounded-xl text-center space-y-1">
                    <span className="text-[10px] text-textSecondary uppercase tracking-widest font-bold">Billing Amount</span>
                    <h3 className="text-xl font-black text-[#1E1E38] flex justify-center items-center gap-0.5">
                      <IndianRupee className="w-4.5 h-4.5 text-[#1E1E38] shrink-0" />
                      {totalPrice.toLocaleString()}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-textSecondary font-bold block uppercase tracking-wider px-1">Select Simulated Option</span>
                    
                    <button
                      onClick={() => handleSimulatePayment('Success')}
                      className="w-full p-4 rounded-xl bg-white border border-[#ECECF4] hover:border-primary text-left text-xs font-semibold flex items-center justify-between hover:bg-purple-50/20 transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Simulate UPI (Success Pipeline)
                      </span>
                      <span className="text-[9px] bg-successGreen/10 text-successGreen border border-successGreen/20 px-2 py-0.5 rounded uppercase font-bold">Fast</span>
                    </button>

                    <button
                      onClick={() => handleSimulatePayment('Success')}
                      className="w-full p-4 rounded-xl bg-white border border-[#ECECF4] hover:border-primary text-left text-xs font-semibold flex items-center justify-between hover:bg-purple-50/20 transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-primary" />
                        Simulate Cards (Success Pipeline)
                      </span>
                      <span className="text-[9px] bg-successGreen/10 text-successGreen border border-successGreen/20 px-2 py-0.5 rounded uppercase font-bold">Fast</span>
                    </button>

                    <button
                      onClick={() => handleSimulatePayment('Failed')}
                      className="w-full p-4 rounded-xl bg-white border border-[#ECECF4] hover:border-red-500 text-left text-xs font-semibold flex items-center justify-between hover:bg-red-50/10 transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Landmark className="w-4 h-4 text-red-500" />
                        Simulate Declined Transaction
                      </span>
                      <span className="text-[9px] bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold">Decline</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PROCESSING SCREEN */}
              {paymentStep === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-up">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div>
                    <h5 className="text-sm font-extrabold text-textPrimary">Connecting Bank Gateways...</h5>
                    <p className="text-[10px] text-textSecondary mt-1">Please do not refresh this window or navigate away.</p>
                  </div>
                </div>
              )}

              {/* SUCCESS ANIMATION */}
              {paymentStep === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-up">
                  <div className="w-16 h-16 rounded-full bg-successGreen/15 text-successGreen flex items-center justify-center border border-successGreen/30 animate-pulse">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-textPrimary">Payment Authenticated Successfully</h4>
                    <p className="text-[10px] text-textSecondary mt-1 leading-normal">
                      Transaction verified. Invoice logged under:<br />
                      <code className="text-primary font-bold mt-1 block select-all bg-sectionBg border border-borderLight py-1 rounded px-2">{txnId}</code>
                    </p>
                    <span className="text-[9px] text-[#7A008C] font-extrabold uppercase mt-4 block tracking-wider animate-pulse">Redirecting to Learner Dashboard...</span>
                  </div>
                </div>
              )}

              {/* FAILED SCREEN */}
              {paymentStep === 'failed' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-up">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center border border-red-200">
                    <XCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-textPrimary">Transaction Declined</h4>
                    <p className="text-[10px] text-textSecondary mt-1 max-w-xs leading-normal">
                      Your bank declined the simulated checkout block due to insufficient credentials. Try rerunning the transaction.
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentStep('select')}
                    className="px-5 py-2 rounded-xl bg-[#1E1E38] hover:bg-opacity-95 text-white text-xs font-bold transition mt-2"
                  >
                    Try Alternate Options
                  </button>
                </div>
              )}

            </div>

            {/* Secure Footer */}
            <div className="bg-[#F8FAFC] border-t border-[#ECECF4] p-3 text-center text-[9px] text-textSecondary uppercase tracking-widest font-bold">
              💳 Secured by Razorpay PCI-DSS Compliance
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
