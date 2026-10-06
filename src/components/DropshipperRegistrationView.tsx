import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Building2,
  Store,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  QrCode,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  FileText,
  BadgeCheck,
  Check,
  Trash2,
  Share2,
  Copy,
  Star,
  Headphones,
  CheckSquare,
} from 'lucide-react';
import { User as AppUser, Store as AppStore } from '../types';
import { PAKISTAN_CITIES, PAKISTAN_BANKS } from './RegisterModal';
import { FrontNavigationBar } from './FrontNavigationBar';

interface DropshipperRegistrationViewProps {
  onRegisterSuccess: (newUser: AppUser, newStore: AppStore) => void;
  onBackToLogin: () => void;
  onOpenSupplierRegister: () => void;
  onNavigateHome?: () => void;
  onNavigateProducts?: () => void;
  onOpenWhatsNew?: () => void;
  onOpenLearningLibrary?: () => void;
  onOpenHelpSupport?: () => void;
  onExportProductsCSV?: () => void;
  onOpenBusinessDashboard?: () => void;
}

export const DropshipperRegistrationView: React.FC<DropshipperRegistrationViewProps> = ({
  onRegisterSuccess,
  onBackToLogin,
  onOpenSupplierRegister,
  onNavigateHome,
  onNavigateProducts,
  onOpenWhatsNew,
  onOpenLearningLibrary,
  onOpenHelpSupport,
  onExportProductsCSV,
  onOpenBusinessDashboard,
}) => {
  // Section Expansion State
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    personal: true,
    seller: true,
    identity: true,
    payment: true,
    review: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Section 1: Personal Information State (8 fields)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Phone OTP Simulation
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpFeedback, setOtpFeedback] = useState('');

  // Section 2: Seller Information State (6 fields)
  const [storeName, setStoreName] = useState('');
  const [experience, setExperience] = useState('Beginner - Starting First Time');
  const [salesChannels, setSalesChannels] = useState<string[]>(['Shopify']);
  const [monthlyOrders, setMonthlyOrders] = useState('10 - 50 orders / month');
  const [mainCategory, setMainCategory] = useState('Consumer Electronics & Mobile Gadgets');
  const [socialLink, setSocialLink] = useState('');

  // Section 3: Identity Verification State (4 fields)
  const [cnicNumber, setCnicNumber] = useState('');
  const [cnicFrontName, setCnicFrontName] = useState('');
  const [cnicBackName, setCnicBackName] = useState('');
  const [selfieName, setSelfieName] = useState('');

  // Section 4: Payment Information State (5 fields)
  const [bankName, setBankName] = useState('Meezan Bank Limited');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [iban, setIban] = useState('');
  const [paymentCycle, setPaymentCycle] = useState('Daily Instant Settlement (Upon COD Delivery)');

  // Section 5: Review & Submit State (2 check boxes)
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [confirmAuthentic, setConfirmAuthentic] = useState(false);

  // Status & Success state
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    user: AppUser;
    store: AppStore;
    certificateId: string;
  } | null>(null);

  // WhatsApp OTP Generator function
  const handleSendOtp = () => {
    if (!whatsappNumber || whatsappNumber.length < 10) {
      setOtpFeedback('Please enter a valid 11-digit WhatsApp number first.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpFeedback(`Demo OTP sent to ${whatsappNumber}: [ ${code} ]`);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp && generatedOtp !== '') {
      setIsOtpVerified(true);
      setOtpFeedback('WhatsApp Verified Successfully!');
    } else {
      setOtpFeedback('Invalid OTP code. Please enter the 4-digit code shown.');
    }
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setEnteredOtp(generatedOtp);
      setIsOtpVerified(true);
      setOtpFeedback('WhatsApp Verified Successfully!');
    }
  };

  // CNIC Auto-Formatter (XXXXX-XXXXXXX-X)
  const handleCnicChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) {
      setCnicNumber(digits);
    } else if (digits.length <= 12) {
      setCnicNumber(`${digits.slice(0, 5)}-${digits.slice(5)}`);
    } else {
      setCnicNumber(`${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`);
    }
  };

  // Channel toggler
  const toggleSalesChannel = (channel: string) => {
    if (salesChannels.includes(channel)) {
      if (salesChannels.length > 1) {
        setSalesChannels(salesChannels.filter((c) => c !== channel));
      }
    } else {
      setSalesChannels([...salesChannels, channel]);
    }
  };

  // File Upload Handlers (with base64 simulation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (name: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file.name);
    }
  };

  // Live Section Completions Calculations
  const personalCount = useMemo(() => {
    let count = 0;
    if (fullName.trim()) count++;
    if (email.trim() && email.includes('@')) count++;
    if (password.length >= 6) count++;
    if (confirmPassword.length >= 6 && confirmPassword === password) count++;
    if (whatsappNumber.trim()) count++;
    if (gender) count++;
    if (address.trim()) count++;
    if (city) count++;
    return count;
  }, [fullName, email, password, confirmPassword, whatsappNumber, gender, address, city]);

  const sellerCount = useMemo(() => {
    let count = 0;
    if (storeName.trim()) count++;
    if (experience) count++;
    if (salesChannels.length > 0) count++;
    if (monthlyOrders) count++;
    if (mainCategory) count++;
    if (socialLink.trim() || storeName.trim()) count++;
    return count;
  }, [storeName, experience, salesChannels, monthlyOrders, mainCategory, socialLink]);

  const identityCount = useMemo(() => {
    let count = 0;
    if (cnicNumber.replace(/\D/g, '').length === 13) count++;
    if (cnicFrontName) count++;
    if (cnicBackName) count++;
    if (selfieName) count++;
    return count;
  }, [cnicNumber, cnicFrontName, cnicBackName, selfieName]);

  const paymentCount = useMemo(() => {
    let count = 0;
    if (bankName) count++;
    if (accountNumber.trim()) count++;
    if (accountTitle.trim()) count++;
    if (iban.trim() || accountNumber.trim()) count++;
    if (paymentCycle) count++;
    return count;
  }, [bankName, accountNumber, accountTitle, iban, paymentCycle]);

  const reviewCount = useMemo(() => {
    let count = 0;
    if (agreeTerms) count++;
    if (confirmAuthentic) count++;
    return count;
  }, [agreeTerms, confirmAuthentic]);

  // Overall Completion Percentage
  const overallPercentage = Math.round(
    ((personalCount + sellerCount + identityCount + paymentCount + reviewCount) / 25) * 100
  );

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!whatsappNumber.trim()) {
      setErrorMessage('Please enter your WhatsApp contact number.');
      return;
    }
    if (!gender) {
      setErrorMessage('Please select your gender.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your complete address.');
      return;
    }
    if (!city) {
      setErrorMessage('Please select your city.');
      return;
    }
    if (!storeName.trim()) {
      setErrorMessage('Please enter your store or brand name in Seller Information.');
      return;
    }
    if (cnicNumber.replace(/\D/g, '').length < 13) {
      setErrorMessage('Please enter a valid 13-digit CNIC number.');
      return;
    }
    if (!accountNumber.trim() || !accountTitle.trim()) {
      setErrorMessage('Please provide your Bank / Mobile Wallet account number and account title.');
      return;
    }
    if (!agreeTerms || !confirmAuthentic) {
      setErrorMessage('Please agree to the YourMart Dropshipping Terms & Authenticity declarations.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const userId = `user-dropshipper-${Date.now()}`;
      const storeId = `store-dropshipper-${Date.now()}`;
      const certId = `YM-VERIFIED-DROP-${Math.floor(100000 + Math.random() * 900000)}`;

      const newUser: AppUser = {
        id: userId,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        role: 'RESELLER',
        companyName: storeName.trim(),
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
        walletBalancePKR: 2500, // Instant bonus credits for verified Pakistani dropshipper
        phone: whatsappNumber,
        city: city || 'Lahore',
        fullAddress: address.trim(),
        cnicNumber: cnicNumber,
        isRegistered: true,
        isVerified: true,
        salesChannels: salesChannels,
      };

      const newStore: AppStore = {
        id: storeId,
        ownerId: userId,
        ownerName: fullName.trim(),
        ownerRole: 'RESELLER',
        ownerType: 'RESELLER',
        name: storeName.trim(),
        slug: storeName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category: mainCategory,
        categories: [mainCategory],
        rating: 5.0,
        totalOrders: 0,
        deliveryRating: '⚡ Standard 2-4 Days Courier Express (COD)',
        isVerified: true,
        logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
        city: city || 'Lahore',
        warehouseAddress: address.trim(),
        description: `Verified YourMart Dropshipper Store. Specializing in ${mainCategory} with direct Pakistan express COD delivery.`,
        verifiedDetails: {
          bankName,
          accountTitle,
          accountNumber,
          iban: iban || accountNumber,
          paymentCycle,
        },
      };

      setRegisteredData({
        user: newUser,
        store: newStore,
        certificateId: certId,
      });
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleFinishAndEnterApp = () => {
    if (registeredData) {
      onRegisterSuccess(registeredData.user, registeredData.store);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-slate-800 antialiased selection:bg-sky-500 selection:text-white pb-16">
      {/* Top Bar / Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome || onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition cursor-pointer"
            >
              <span>Home (Front Page)</span>
            </button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition"
            >
              <span>← Back to Login</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-500 font-medium">Pakistan Dropshipping Gateway</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSupplierRegister}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-sky-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-300 transition"
            >
              <span>Are you a Factory / Supplier?</span>
              <span className="text-sky-600 font-bold">Register as Supplier →</span>
            </button>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-lg border border-sky-200 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Front Navigation Bar (9 Core Platform Options) */}
      <FrontNavigationBar
        variant="gateway"
        activeTab="dropshipper-registration"
        onNavigateHome={onNavigateHome || onBackToLogin}
        onNavigateProducts={onNavigateProducts || (() => {})}
        onOpenDropshipperRegister={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenSupplierRegister={onOpenSupplierRegister}
        onOpenWhatsNew={onOpenWhatsNew || (() => {})}
        onOpenLearningLibrary={onOpenLearningLibrary || (() => {})}
        onOpenHelpSupport={onOpenHelpSupport || (() => {})}
        onExportProductsCSV={onExportProductsCSV || (() => {})}
        onOpenBusinessDashboard={onOpenBusinessDashboard || onNavigateHome || onBackToLogin}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Header Card Matching Screenshot 1 */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Dropshipper Registration
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Join Pakistan&apos;s smartest dropshipping platform and start your online business today.
            </p>
          </div>

          {/* 100% Free Registration Banner (Screenshot 1 Top Right) */}
          <div className="bg-gradient-to-r from-sky-50 to-white border border-sky-200/80 rounded-2xl p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">100% Free Registration</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Start dropshipping with no registration fee or upfront investment.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBackToLogin}
              className="shrink-0 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-sky-700 bg-white border border-slate-300 rounded-lg hover:border-sky-400 hover:bg-sky-50/50 shadow-xs transition"
            >
              Already have an account? <span className="text-sky-600">Sign In</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: STEPPER & SIDEBAR CARDS ================= */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-20">
            {/* 1. Stepper / Progress Indicator Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Steps</span>
                <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                  {overallPercentage}% Completed
                </span>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}
                <div
                  onClick={() => scrollToSection('section-personal')}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                        personalCount === 8
                          ? 'bg-emerald-500 text-white'
                          : 'bg-sky-600 text-white shadow-xs ring-4 ring-sky-100'
                      }`}
                    >
                      {personalCount === 8 ? <Check className="w-3.5 h-3.5" /> : '1'}
                    </div>
                    <div className="w-0.5 h-7 bg-slate-200 mt-1"></div>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition flex items-center gap-1.5">
                      <span>Personal Information</span>
                      <span className="text-[10px] text-slate-400 font-normal">({personalCount}/8)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">Basic details & contact</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  onClick={() => scrollToSection('section-seller')}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                        sellerCount === 6
                          ? 'bg-emerald-500 text-white'
                          : sellerCount > 0
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {sellerCount === 6 ? <Check className="w-3.5 h-3.5" /> : '2'}
                    </div>
                    <div className="w-0.5 h-7 bg-slate-200 mt-1"></div>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition flex items-center gap-1.5">
                      <span>Seller Information</span>
                      <span className="text-[10px] text-slate-400 font-normal">({sellerCount}/6)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">Your business & selling plans</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  onClick={() => scrollToSection('section-identity')}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                        identityCount === 4
                          ? 'bg-emerald-500 text-white'
                          : identityCount > 0
                          ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {identityCount === 4 ? <Check className="w-3.5 h-3.5" /> : '3'}
                    </div>
                    <div className="w-0.5 h-7 bg-slate-200 mt-1"></div>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition flex items-center gap-1.5">
                      <span>Identity Verification</span>
                      <span className="text-[10px] text-slate-400 font-normal">({identityCount}/4)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">CNIC & selfie verification</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  onClick={() => scrollToSection('section-payment')}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                        paymentCount === 5
                          ? 'bg-emerald-500 text-white'
                          : paymentCount > 0
                          ? 'bg-cyan-600 text-white ring-4 ring-cyan-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {paymentCount === 5 ? <Check className="w-3.5 h-3.5" /> : '4'}
                    </div>
                    <div className="w-0.5 h-7 bg-slate-200 mt-1"></div>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-600 transition flex items-center gap-1.5">
                      <span>Payment Information</span>
                      <span className="text-[10px] text-slate-400 font-normal">({paymentCount}/5)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">Bank details for payouts</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div
                  onClick={() => scrollToSection('section-review')}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                        reviewCount === 2
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {reviewCount === 2 ? <Check className="w-3.5 h-3.5" /> : '5'}
                    </div>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition flex items-center gap-1.5">
                      <span>Review & Submit</span>
                      <span className="text-[10px] text-slate-400 font-normal">({reviewCount}/2)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">Confirm & submit application</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. "Why we verify?" Card (Screenshot 1 & 2) */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-sky-950">Why we verify?</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Verification helps us protect genuine sellers, customers and build a trusted community.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. YOURMART DROPSHIPPING WhatsApp Channel Card (Screenshot 2 & 3) */}
            <div className="bg-[#191f28] text-white rounded-2xl p-5 shadow-sm text-center border border-slate-800">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-3 shadow-inner border border-slate-700">
                <ShoppingBag className="w-6 h-6 text-sky-400" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                YOURMART DROPSHIPPING
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">WhatsApp channel</p>

              {/* QR Code */}
              <div className="bg-white p-2.5 rounded-xl inline-block my-3 shadow-md border border-slate-200">
                <div className="w-28 h-28 bg-white flex flex-col items-center justify-center p-1 rounded relative">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                      <Phone className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700"
                >
                  <span>Join to Stay Update</span>
                </a>
              </div>
            </div>

            {/* 4. "What happens next?" Card (Screenshot 2 & 3) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h4 className="text-xs font-bold text-slate-900">What happens next?</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                    1
                  </span>
                  <span>We review your application</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                    2
                  </span>
                  <span>Verify your identity and details</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                    3
                  </span>
                  <span>You&apos;ll get notified via Email</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                    4
                  </span>
                  <span className="font-semibold text-slate-800">Start dropshipping and grow your business!</span>
                </li>
              </ul>
            </div>

            {/* 5. "Need Help?" Card (Screenshot 3) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-start gap-3 mb-3">
                <Headphones className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Our support team is here to help you.</p>
                </div>
              </div>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center py-2 px-3 bg-white hover:bg-sky-50/70 text-sky-600 hover:text-sky-700 border border-sky-300 rounded-xl text-xs font-bold transition shadow-2xs"
              >
                Contact Support
              </a>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: 5 MAIN FORM ACCORDION SECTIONS ================= */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ================= SECTION 1: PERSONAL INFORMATION ================= */}
              <div
                id="section-personal"
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleSection('personal')}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">Personal Information</h2>
                      <p className="text-xs text-slate-500">Please provide your basic details.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{personalCount}/8 complete</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-sky-500 transition-all duration-300 rounded-full"
                          style={{ width: `${(personalCount / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      {expandedSections.personal ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {expandedSections.personal && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Please Enter your full name"
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Whatsapp Number (with '11' Prefix box as shown in screenshot) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Whatsapp Number <span className="text-red-500">*</span>
                          </label>
                          {isOtpVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              <Check className="w-3 h-3" /> WhatsApp Verified
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-[10px] font-bold text-sky-600 hover:text-sky-700 underline"
                            >
                              {otpSent ? 'Resend OTP' : 'Send WhatsApp OTP'}
                            </button>
                          )}
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-sky-500 focus-within:ring-3 focus-within:ring-sky-100 transition">
                          <div className="bg-slate-100 px-3 flex items-center justify-center text-xs font-bold text-slate-600 border-r border-slate-200">
                            11
                          </div>
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <Phone className="w-4 h-4 text-emerald-500" />
                            </div>
                            <input
                              type="tel"
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value)}
                              placeholder="Enter WhatsApp number e.g. 03XXXXXXXXX"
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {/* OTP Verification Box */}
                        {otpSent && !isOtpVerified && (
                          <div className="mt-2 p-2.5 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-sky-900">{otpFeedback}</span>
                              <button
                                type="button"
                                onClick={handleAutoFillOtp}
                                className="text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white px-2 py-0.5 rounded shadow-2xs"
                              >
                                Auto-Fill OTP
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={4}
                                value={enteredOtp}
                                onChange={(e) => setEnteredOtp(e.target.value)}
                                placeholder="Enter 4-digit OTP"
                                className="flex-1 px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-mono tracking-widest text-slate-800 focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition appearance-none cursor-pointer"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other / Prefer not to say</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address & City Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Address */}
                      <div className="md:col-span-8">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3.5 text-slate-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <textarea
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your complete address with house number, street, area, and city."
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition"
                          ></textarea>
                        </div>
                      </div>

                      {/* City */}
                      <div className="md:col-span-4">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition appearance-none cursor-pointer"
                          >
                            <option value="">Select from the following</option>
                            {PAKISTAN_CITIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Two Notice Boxes matching Screenshot 1 & 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600">
                          We will send important updates on your mobile and email.
                        </span>
                      </div>
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600">
                          Make sure your details are correct before submitting your application.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= SECTION 2: SELLER INFORMATION ================= */}
              <div
                id="section-seller"
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleSection('seller')}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">Seller Information</h2>
                      <p className="text-xs text-slate-500">Tell us about your business and selling plans.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{sellerCount}/6 complete</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                          style={{ width: `${(sellerCount / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      {expandedSections.seller ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {expandedSections.seller && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Store / Business Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Store / Brand Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Store className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="e.g. Trendify Store / Ali Mart"
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-100 transition"
                          />
                        </div>
                      </div>

                      {/* Selling Experience */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Selling Experience <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-emerald-100 transition appearance-none cursor-pointer"
                          >
                            <option value="Beginner - Starting First Time">Beginner - Starting First Time</option>
                            <option value="Intermediate - Selling 6-12 Months">Intermediate - Selling 6-12 Months</option>
                            <option value="Advanced - Running Active E-Commerce Store">
                              Advanced - Running Active E-Commerce Store
                            </option>
                            <option value="Daraz / Shopify Expert">Daraz / Shopify Expert (High Volume)</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Expected Monthly Orders */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Target Monthly Orders <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={monthlyOrders}
                            onChange={(e) => setMonthlyOrders(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-emerald-100 transition appearance-none cursor-pointer"
                          >
                            <option value="10 - 50 orders / month">10 - 50 orders / month</option>
                            <option value="50 - 200 orders / month">50 - 200 orders / month</option>
                            <option value="200 - 500 orders / month">200 - 500 orders / month</option>
                            <option value="500+ orders / month (VIP Dropshipper)">
                              500+ orders / month (VIP Dropshipper)
                            </option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Primary Category */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Primary Product Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={mainCategory}
                            onChange={(e) => setMainCategory(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-emerald-100 transition appearance-none cursor-pointer"
                          >
                            <option value="Consumer Electronics & Mobile Gadgets">
                              Consumer Electronics & Mobile Gadgets
                            </option>
                            <option value="Fashion, Clothing & Apparel">Fashion, Clothing & Apparel</option>
                            <option value="Kitchen, Home Living & Decor">Kitchen, Home Living & Decor</option>
                            <option value="Health, Beauty & Personal Care">Health, Beauty & Personal Care</option>
                            <option value="Watches, Jewelry & Accessories">Watches, Jewelry & Accessories</option>
                            <option value="Kids Toys & Baby Care">Kids Toys & Baby Care</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sales Channels Multi-select */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Preferred Sales Channels <span className="text-red-500">*</span> (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Shopify',
                          'Daraz.pk',
                          'TikTok Shop',
                          'Facebook & Instagram',
                          'WhatsApp Catalog',
                          'WooCommerce',
                        ].map((ch) => {
                          const isSelected = salesChannels.includes(ch);
                          return (
                            <button
                              key={ch}
                              type="button"
                              onClick={() => toggleSalesChannel(ch)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                              <span>{ch}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Store or Social Link */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Store or Social Media Link <span className="text-slate-400 font-normal">( optional )</span>
                      </label>
                      <input
                        type="url"
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        placeholder="https://instagram.com/yourstore or https://daraz.pk/shop/..."
                        className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ================= SECTION 3: IDENTITY VERIFICATION ================= */}
              <div
                id="section-identity"
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleSection('identity')}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">Identity Verification</h2>
                      <p className="text-xs text-slate-500">Provide your CNIC details and verify your identity.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{identityCount}/4 complete</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300 rounded-full"
                          style={{ width: `${(identityCount / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      {expandedSections.identity ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {expandedSections.identity && (
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* CNIC Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          CNIC Number <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">13 Digits with Dashes</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={15}
                          value={cnicNumber}
                          onChange={(e) => handleCnicChange(e.target.value)}
                          placeholder="35201-1234567-1"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-500 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-purple-100 transition"
                        />
                        {cnicNumber.replace(/\D/g, '').length === 13 && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-500">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Uploads: CNIC Front, CNIC Back, Selfie */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* CNIC Front */}
                      <div className="border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl p-4 text-center transition bg-slate-50/50 hover:bg-purple-50/20">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mb-0.5">CNIC Front *</h4>
                        <p className="text-[10px] text-slate-400 mb-2.5">PNG, JPG up to 5MB</p>

                        {cnicFrontName ? (
                          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            <Check className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{cnicFrontName}</span>
                            <button
                              type="button"
                              onClick={() => setCnicFrontName('')}
                              className="text-purple-600 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs">
                            <Upload className="w-3 h-3" />
                            <span>Upload Front</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setCnicFrontName)}
                            />
                          </label>
                        )}
                      </div>

                      {/* CNIC Back */}
                      <div className="border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl p-4 text-center transition bg-slate-50/50 hover:bg-purple-50/20">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mb-0.5">CNIC Back *</h4>
                        <p className="text-[10px] text-slate-400 mb-2.5">PNG, JPG up to 5MB</p>

                        {cnicBackName ? (
                          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            <Check className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{cnicBackName}</span>
                            <button
                              type="button"
                              onClick={() => setCnicBackName('')}
                              className="text-purple-600 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs">
                            <Upload className="w-3 h-3" />
                            <span>Upload Back</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setCnicBackName)}
                            />
                          </label>
                        )}
                      </div>

                      {/* Live Selfie */}
                      <div className="border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl p-4 text-center transition bg-slate-50/50 hover:bg-purple-50/20">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2">
                          <User className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mb-0.5">Live Selfie / Photo *</h4>
                        <p className="text-[10px] text-slate-400 mb-2.5">Clear facial picture</p>

                        {selfieName ? (
                          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            <Check className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{selfieName}</span>
                            <button
                              type="button"
                              onClick={() => setSelfieName('')}
                              className="text-purple-600 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs">
                            <Upload className="w-3 h-3" />
                            <span>Upload Selfie</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setSelfieName)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= SECTION 4: PAYMENT INFORMATION ================= */}
              <div
                id="section-payment"
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleSection('payment')}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">Payment Information</h2>
                      <p className="text-xs text-slate-500">Add your bank account details to receive payments.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{paymentCount}/5 complete</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
                          style={{ width: `${(paymentCount / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      {expandedSections.payment ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {expandedSections.payment && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Select Bank */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Select Bank <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-cyan-100 transition appearance-none cursor-pointer"
                          >
                            {PAKISTAN_BANKS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Account Number / Mobile Wallet */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Account / Wallet Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. 023401056789 or 03001234567"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-cyan-100 transition"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          In case of EasyPaisa/JazzCash, enter your registered mobile number.
                        </p>
                      </div>

                      {/* Account Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Account Title / Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={accountTitle}
                          onChange={(e) => setAccountTitle(e.target.value)}
                          placeholder="Name which is displayed on account"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-cyan-100 transition"
                        />
                      </div>

                      {/* IBAN */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          IBAN <span className="text-slate-400 font-normal">( optional )</span>
                        </label>
                        <input
                          type="text"
                          value={iban}
                          onChange={(e) => setIban(e.target.value)}
                          placeholder="PK36MEZN0000000012345678"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-cyan-100 transition"
                        />
                      </div>
                    </div>

                    {/* Payment Cycle */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Payment Settlement Cycle <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          'Daily Instant Settlement (Upon COD Delivery)',
                          'Weekly Settlement (Every Monday)',
                          'Bi-Weekly Settlement',
                        ].map((cycle) => (
                          <button
                            key={cycle}
                            type="button"
                            onClick={() => setPaymentCycle(cycle)}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                              paymentCycle === cycle
                                ? 'border-cyan-500 bg-cyan-50/60 text-cyan-900 ring-2 ring-cyan-200'
                                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold">{cycle.split(' (')[0]}</span>
                              {paymentCycle === cycle && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                            </div>
                            <span className="text-[10px] text-slate-500 font-normal">
                              {cycle.includes('(') ? `(${cycle.split('(')[1]}` : 'Automatic bank transfer'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= SECTION 5: REVIEW & SUBMIT ================= */}
              <div
                id="section-review"
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleSection('review')}
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">Review & Submit</h2>
                      <p className="text-xs text-slate-500">Review your information and submit your application.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{reviewCount}/2 complete</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                          style={{ width: `${(reviewCount / 2) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      {expandedSections.review ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {expandedSections.review && (
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Live Summary Preview Box */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Application Overview
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Full Name:</span>
                          <span className="font-semibold text-slate-800">{fullName || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Email:</span>
                          <span className="font-semibold text-slate-800 truncate block">{email || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                          <span className="font-semibold text-slate-800">{whatsappNumber || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Store Name:</span>
                          <span className="font-semibold text-slate-800">{storeName || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">City:</span>
                          <span className="font-semibold text-slate-800">{city || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Bank / Account:</span>
                          <span className="font-semibold text-slate-800 truncate block">
                            {bankName} - {accountNumber || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Agreement Checkboxes */}
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                        />
                        <span>
                          I acknowledge that I have read and agree to the{' '}
                          <a href="#terms" className="text-sky-600 font-semibold underline">
                            YourMart Dropshipping Terms of Service
                          </a>
                          , COD Verification & Profit Protection Policies.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={confirmAuthentic}
                          onChange={(e) => setConfirmAuthentic(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                        />
                        <span>
                          I confirm that all provided details, CNIC number and bank payout information belong to me
                          and are legally accurate.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Instant Approval for Verified CNIC</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Registration...</span>
                          </>
                        ) : (
                          <>
                            <span>CONFIRM & REGISTER AS DROPSHIPPER</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Floating Scroll-To-Top Button (Screenshot 2 & 3) */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shadow-xl flex items-center justify-center transition z-40 border border-slate-700"
        title="Scroll to Top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Verified Dropshipper Success & Certificate Modal */}
      {showSuccessModal && registeredData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
            {/* Top decorative badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <BadgeCheck className="w-4 h-4" />
              <span>Registration Approved & Active</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome to YourMart Dropshipping!
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
              Your dropshipper store <span className="font-bold text-slate-800">&quot;{registeredData.store.name}&quot;</span> has
              been verified. You can now sell wholesale catalog products across Pakistan.
            </p>

            {/* Certificate Card */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-left shadow-lg border border-slate-700 relative">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px] font-black uppercase tracking-wider">YourMart Pakistan</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {registeredData.certificateId}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-300">
                  <span className="text-slate-400">Dropshipper:</span>{' '}
                  <span className="font-bold text-white">{registeredData.user.name}</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Store Name:</span>{' '}
                  <span className="font-bold text-sky-300">{registeredData.store.name}</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Initial Bonus:</span>{' '}
                  <span className="font-bold text-emerald-400">Rs. 2,500 Demo Wallet Balance</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishAndEnterApp}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ENTER DROPSHIPPER PORTAL & EXPLORE CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive E-Commerce Footer */}
      <footer className="mt-16 bg-[#161c28] text-white border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
            {/* Col 1: About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-sm">
                  YM
                </div>
                <span className="text-base font-black tracking-tight text-white">YourMart</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pakistan&apos;s premier B2B sourcing and automated dropshipping engine with instant COD margin settlements.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> SECP Registered
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                  <Check className="w-3 h-3 text-sky-400" /> FBR Active
                </span>
              </div>
            </div>

            {/* Col 2: Sell on YourMart */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">SELL ON YOURMART</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li
                  onClick={onOpenSupplierRegister}
                  className="hover:text-sky-400 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-slate-600">▪</span> Supplier Registration (Factory)
                </li>
                <li
                  onClick={() => scrollToSection('section-personal')}
                  className="hover:text-sky-400 transition cursor-pointer flex items-center gap-1.5 text-sky-400 font-semibold"
                >
                  <span className="text-sky-400">▪</span> Dropshipper Registration
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Wholesale Bulk Sourcing
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Verified Seller Protection
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">RESOURCES</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Daraz Profit Calculator
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> 1-Click Export | Shopify
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> 1-Click Export | WooCommerce
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Dropshipper Orientation Kit
                </li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">SUPPORT</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Guidelines & Policies
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> FAQs
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Profit Guard & Return Dispute
                </li>
                <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="text-slate-600">▪</span> Get in Touch (24/7 Helpline)
                </li>
              </ul>
            </div>

            {/* Col 5: WhatsApp Channel */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                YOURMART DROPSHIPPING
              </h4>
              <p className="text-xs text-slate-400">Join to Stay Updated</p>
              <div className="bg-white p-2.5 rounded-xl inline-block shadow-md">
                <div className="w-24 h-24 bg-white flex flex-col items-center justify-center p-1 border border-slate-200 rounded">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
              </div>
              <div>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <span>Open WhatsApp Channel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} YourMart Global. All Rights Reserved. Built for Pakistan E-Commerce.</p>
            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              title="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
