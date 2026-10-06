import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  Store,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  CreditCard,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Check,
  AlertCircle,
  Clock,
  Shield,
  BadgeCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { PAKISTAN_CITIES, PAKISTAN_BANKS } from './RegisterModal';
import { User as AppUser, Store as AppStore, VerifiedRegistrationData } from '../types';

interface VerifiedRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AppUser;
  onRegisterSuccess?: (newUser: AppUser, newStore: AppStore) => void;
  onRegistrationSuccess?: (data: VerifiedRegistrationData) => void;
}

export const VerifiedRegistrationModal: React.FC<VerifiedRegistrationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRegisterSuccess,
  onRegistrationSuccess,
}) => {
  // Step 1: Role & Personal Contact
  // Step 2: NADRA CNIC & Business / Factory Details
  // Step 3: Bank & Payout Channel
  // Step 4: Document Uploads & Verification Approval
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Role
  const [role, setRole] = useState<'SUPPLIER' | 'RESELLER'>('SUPPLIER');

  // Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState('Karachi');

  // Phone OTP Simulation
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Business & Legal Info
  const [businessName, setBusinessName] = useState('');
  const [cnic, setCnic] = useState('');
  const [ntn, setNtn] = useState('');
  const [warehouseAddress, setWarehouseAddress] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Consumer Electronics & Mobile Gadgets');
  const [productionCapacity, setProductionCapacity] = useState('5,000 - 20,000 Units / Month');

  // Payout Channel
  const [bankName, setBankName] = useState('Meezan Bank Limited');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Documents Upload Simulation
  const [cnicFrontUploaded, setCnicFrontUploaded] = useState(false);
  const [cnicBackUploaded, setCnicBackUploaded] = useState(false);
  const [ntnDocUploaded, setNtnDocUploaded] = useState(false);

  // Form Validation & Error
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedCertificate, setVerifiedCertificate] = useState<{
    id: string;
    badgeName: string;
    storeName: string;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  // Format CNIC with automatic hyphens: 42101-1234567-1
  const handleCnicChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    let formatted = digits;
    if (digits.length > 5 && digits.length <= 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else if (digits.length > 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
    setCnic(formatted);
  };

  // Simulate Sending OTP to Mobile
  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setErrorMessage('Pehle durust Pakistani mobile number likhein (e.g. 0300 1234567)');
      return;
    }
    setErrorMessage('');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp || enteredOtp === '7860') {
      setIsOtpVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Ghalat OTP code enter kiya hai. Baraye meherbani dobara check karein.');
    }
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!fullName.trim()) {
      setErrorMessage('Baraye meherbani apna mukammal naam darj karein.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Durust email address darj karein.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Mobile phone number darj karein.');
      return;
    }
    if (!isOtpVerified) {
      setErrorMessage('Baraye meherbani pehle mobile number ko OTP se verify karein.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    if (!businessName.trim()) {
      setErrorMessage(
        role === 'SUPPLIER'
          ? 'Factory / Manufacturing Business ka naam likhein.'
          : 'Apne Reseller Store / Brand ka naam likhein.'
      );
      return;
    }
    if (cnic.replace(/\D/g, '').length !== 13) {
      setErrorMessage('13 hindo ka durust NADRA CNIC number darj karein (e.g. 42101-1234567-1)');
      return;
    }
    if (role === 'SUPPLIER' && !warehouseAddress.trim()) {
      setErrorMessage('Factory ya warehouse ka physical address darj karein.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(3);
  };

  // Step 3 Validation
  const handleNextStep3 = () => {
    if (!accountTitle.trim()) {
      setErrorMessage('Bank account ya JazzCash/EasyPaisa ka Account Title darj karein.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMessage('Account number ya IBAN darj karein taake payout seedha pohanch sake.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(4);
  };

  // Step 4: Finalize & Submit
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const prefix = role === 'SUPPLIER' ? 'YM-MFR' : 'YM-RSL';
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const cityCode = selectedCity.slice(0, 3).toUpperCase();
      const verificationCode = `${prefix}-${cityCode}-${randNum}`;

      const newUserId = `usr-${Date.now()}`;
      const newStoreId = `store-${Date.now()}`;

      const newUser: AppUser = {
        id: newUserId,
        name: `${fullName} (${role === 'SUPPLIER' ? 'Verified Manufacturer' : 'Verified Reseller'})`,
        email: email.toLowerCase(),
        role: role,
        companyName: businessName,
        avatar:
          role === 'SUPPLIER'
            ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        walletBalancePKR: role === 'SUPPLIER' ? 25000 : 5000,
        phone,
        city: selectedCity,
      };

      const newStore: AppStore = {
        id: newStoreId,
        name: businessName,
        ownerId: newUserId,
        ownerName: fullName,
        ownerRole: role,
        logo:
          role === 'SUPPLIER'
            ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
        banner:
          role === 'SUPPLIER'
            ? 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
        city: selectedCity,
        warehouseAddress: warehouseAddress || `${selectedCity} Central Hub`,
        rating: 5.0,
        deliveryRating: '⚡ 1-2 Days Fast Delivery (99% On-Time)',
        responseRate: '100% (< 10 mins)',
        totalOrders: 0,
        isVerified: true,
        verificationId: verificationCode,
        category: businessCategory,
        description:
          role === 'SUPPLIER'
            ? `Official Verified Manufacturer of ${businessCategory} based in ${selectedCity}. Direct factory prices with fast dispatch.`
            : `Verified Reseller store managed by ${fullName}. Fast COD delivery with zero hassle.`,
      };

      setVerifiedCertificate({
        id: verificationCode,
        badgeName: role === 'SUPPLIER' ? 'Government & Platform Verified Manufacturer' : 'Certified Premier Reseller',
        storeName: businessName,
        timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      });

      setIsSubmitting(false);

      // Call parent callback
      if (onRegisterSuccess) {
        onRegisterSuccess(newUser, newStore);
      }
      if (onRegistrationSuccess) {
        onRegistrationSuccess({
          role,
          businessName,
          contactName: fullName,
          email,
          phone,
          city: selectedCity,
          cnic,
          warehouseAddress,
          bankName,
          accountTitle,
          accountNumber,
          businessCategory,
          verificationId: verificationCode,
          isVerified: true,
          registeredAt: new Date().toISOString()
        });
      }
    }, 1200);
  };

  return (
    <div
      id="verified-registration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/40 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Official Verification Portal
                </span>
                <span className="text-[11px] text-slate-400 font-mono">NADRA & FBR Aligned</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Manufacturer & Reseller Registration
              </h2>
            </div>
          </div>

          {/* Stepper Dots */}
          {!verifiedCertificate && (
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-4 text-xs">
              {[
                { step: 1, title: 'Identity & Role' },
                { step: 2, title: 'CNIC & Business' },
                { step: 3, title: 'Bank Payout' },
                { step: 4, title: 'Documents & Verification' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`flex items-center gap-1.5 font-bold ${
                    currentStep === s.step
                      ? 'text-emerald-400'
                      : currentStep > s.step
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                      currentStep === s.step
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : currentStep > s.step
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {currentStep > s.step ? <Check className="h-3 w-3" /> : s.step}
                  </span>
                  <span className="hidden sm:inline text-[11px]">{s.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* =========================================================================
              SUCCESS / VERIFIED CERTIFICATE STATE
          ========================================================================= */}
          {verifiedCertificate ? (
            <div className="text-center space-y-5 py-4 animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 shadow-xl shadow-emerald-950">
                <BadgeCheck className="h-10 w-10 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Registration Approved & Activated
                </span>
                <h3 className="text-2xl font-black text-white">Mubarak Ho! Aapka Store Live Ho Chuka Hai</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Aapki identity aur business details kamyabi se verify ho chuki hain. Aapka official verified store create kar diya gaya hai.
                </p>
              </div>

              {/* Certificate Card */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 p-5 text-left space-y-3 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Verification Certificate ID
                    </span>
                    <span className="text-base font-black font-mono text-white">
                      {verifiedCertificate.id}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/40">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registered Business / Store:</span>
                    <span className="font-bold text-white text-sm">{verifiedCertificate.storeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Role & Category:</span>
                    <span className="font-bold text-emerald-300">
                      {role === 'SUPPLIER' ? 'Factory Manufacturer / Supplier' : 'Verified Online Reseller'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registration Date:</span>
                    <span className="font-mono text-slate-200">{verifiedCertificate.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Location Hub:</span>
                    <span className="font-semibold text-slate-200">{selectedCity}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Authorized by YourMart Trust & Safety Security Engine</span>
                  <span className="font-mono text-emerald-400">NADRA ID Checked</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3 px-4 text-sm transition shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Start Listing Products & Receiving Orders</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* =========================================================================
                  STEP 1: ROLE SELECTION & PERSONAL CONTACT
              ========================================================================= */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Role Switcher */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                      Aap kis haisiyat se register hona chahte hain?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Manufacturer */}
                      <button
                        type="button"
                        onClick={() => setRole('SUPPLIER')}
                        className={`flex items-start gap-3 rounded-2xl p-4 text-left border transition-all ${
                          role === 'SUPPLIER'
                            ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold flex-shrink-0 mt-0.5 ${
                            role === 'SUPPLIER'
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Building2 className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">Manufacturer / Factory</span>
                            <span className="text-[10px] rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 border border-emerald-500/30">
                              Wholesale
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Factory, Master Importer ya Wholesale Supplier. Apne products bulk rates par list karein.
                          </p>
                        </div>
                      </button>

                      {/* Reseller */}
                      <button
                        type="button"
                        onClick={() => setRole('RESELLER')}
                        className={`flex items-start gap-3 rounded-2xl p-4 text-left border transition-all ${
                          role === 'RESELLER'
                            ? 'bg-orange-950/50 border-orange-500 text-white shadow-lg ring-2 ring-orange-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold flex-shrink-0 mt-0.5 ${
                            role === 'RESELLER'
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Store className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">Reseller / Dropshipper</span>
                            <span className="text-[10px] rounded bg-orange-500/20 text-orange-300 px-1.5 py-0.2 border border-orange-500/30">
                              Ecom Store
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Shopify, Daraz, TikTok ya WhatsApp seller. Zero investment par wholesale products bechein.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Personal Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Owner / Contact Person Full Name (As per CNIC) *</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Hammad Tariq"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Email & City Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hammad@business.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Business Operating City *</span>
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mobile & OTP Simulator */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Pakistani Mobile Number (SMS OTP Verification) *</span>
                      </label>
                      {isOtpVerified && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Number Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
                          🇵🇰 +92
                        </span>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="300 1234567"
                          disabled={isOtpVerified}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-16 pr-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none disabled:opacity-60"
                        />
                      </div>
                      {!isOtpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3.5 py-2 text-xs font-bold transition whitespace-nowrap"
                        >
                          {otpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                      )}
                    </div>

                    {/* OTP Entry Box */}
                    {otpSent && !isOtpVerified && (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-300">
                            💬 OTP Sent! Simulated SMS Code:{' '}
                            <strong className="font-mono text-white bg-slate-900 px-2 py-0.5 rounded">
                              {generatedOtp}
                            </strong>
                          </span>
                          <span className="text-[10px] text-slate-400">Test Code: 7860</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="Enter 4-Digit OTP"
                            className="w-36 rounded-lg border border-emerald-500/50 bg-slate-900 px-3 py-1.5 text-center font-mono text-sm tracking-widest font-bold text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="rounded-lg bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold hover:bg-emerald-400 transition"
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 text-xs transition shadow-lg"
                    >
                      <span>Continue to CNIC & Business Verification</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 2: NADRA CNIC & BUSINESS / FACTORY DETAILS
              ========================================================================= */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Business / Factory Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>
                          {role === 'SUPPLIER'
                            ? 'Factory / Manufacturing Unit Name *'
                            : 'Reseller Store / Brand Name *'}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {role === 'SUPPLIER' ? 'Wholesale Business Name' : 'Public Storefront Name'}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={
                        role === 'SUPPLIER'
                          ? 'e.g. Apex Electronics & Manufacturing Co.'
                          : 'e.g. Trends Hub PK'
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* NADRA CNIC Input with Format Validation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>NADRA CNIC Number (13 Digits) *</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">Format: XXXXX-XXXXXXX-X</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={15}
                        value={cnic}
                        onChange={(e) => handleCnicChange(e.target.value)}
                        placeholder="35202-1234567-1"
                        className="w-full rounded-xl border border-emerald-500/50 bg-slate-950 px-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                      {cnic.replace(/\D/g, '').length === 13 && (
                        <span className="absolute right-3.5 top-2.5 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Valid Format</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FBR NTN / Tax ID (Optional for Reseller, Recommended for Manufacturer) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>FBR NTN / Sales Tax Registration (STRN)</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {role === 'SUPPLIER' ? 'Recommended for Fast Approval' : 'Optional for Resellers'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={ntn}
                      onChange={(e) => setNtn(e.target.value)}
                      placeholder="e.g. 7849201-3"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Factory Physical Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>
                        {role === 'SUPPLIER'
                          ? 'Factory / Warehouse Complete Physical Address *'
                          : 'Dispatch Hub / Office Address (Optional)'}
                      </span>
                    </label>
                    <textarea
                      rows={2}
                      value={warehouseAddress}
                      onChange={(e) => setWarehouseAddress(e.target.value)}
                      placeholder={
                        role === 'SUPPLIER'
                          ? 'Plot # 45, Korangi Industrial Area, Sector 15, Karachi'
                          : 'Commercial Market, Lahore'
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Category & Capacity Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Main Product Category</label>
                      <select
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="Consumer Electronics & Mobile Gadgets">Consumer Electronics & Mobile Gadgets</option>
                        <option value="Fashion, Clothing & Apparel">Fashion, Clothing & Apparel</option>
                        <option value="Home & Kitchen Appliances">Home & Kitchen Appliances</option>
                        <option value="Health, Beauty & Skincare">Health, Beauty & Skincare</option>
                        <option value="Packaging & Courier Supplies">Packaging & Courier Supplies</option>
                        <option value="Automotive & Mobile Accessories">Automotive & Mobile Accessories</option>
                      </select>
                    </div>

                    {role === 'SUPPLIER' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Monthly Production / Sourcing Capacity
                        </label>
                        <select
                          value={productionCapacity}
                          onChange={(e) => setProductionCapacity(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="1,000 - 5,000 Units / Month">1,000 - 5,000 Units / Month</option>
                          <option value="5,000 - 20,000 Units / Month">5,000 - 20,000 Units / Month</option>
                          <option value="20,000 - 50,000+ Units / Month">20,000 - 50,000+ Units / Month</option>
                          <option value="100,000+ Units (Mega Factory)">100,000+ Units (Mega Factory)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 text-xs transition shadow-lg"
                    >
                      <span>Continue to Bank Payout Setup</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 3: BANK & PAYOUT CHANNEL
              ========================================================================= */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-200 flex items-start gap-2.5">
                    <CreditCard className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300">Automated Direct Payouts:</strong> Customer COD delivery ya wholesale order complete hote hi aapka munafa / payment is account mein transfer hoga.
                    </div>
                  </div>

                  {/* Bank / Wallet Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Bank ya Digital Wallet Select Karein *
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                      {PAKISTAN_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Account Title (Bank / Wallet par darj naam) *
                    </label>
                    <input
                      type="text"
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      placeholder="e.g. Muhammad Hammad Tariq"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Account Number / IBAN */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Account Number / IBAN / Wallet Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="PK36MEZN0000123456789012 ya 0300-1234567"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep3}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 text-xs transition shadow-lg"
                    >
                      <span>Continue to Document Upload</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 4: DOCUMENTS UPLOAD & FINAL APPROVAL
              ========================================================================= */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      <span>Identity & Legal Document Proofs</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Fake registrations rokne ke liye CNIC front aur back photo upload karein.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* CNIC Front */}
                      <div
                        onClick={() => setCnicFrontUploaded(!cnicFrontUploaded)}
                        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                          cnicFrontUploaded
                            ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 text-slate-400'
                        }`}
                      >
                        <Upload className="h-5 w-5 mx-auto mb-1 text-slate-400" />
                        <span className="text-xs font-bold block">CNIC Front Picture</span>
                        <span className="text-[10px] text-slate-400">
                          {cnicFrontUploaded ? '✓ Attached (Simulated)' : 'Click to attach photo'}
                        </span>
                      </div>

                      {/* CNIC Back */}
                      <div
                        onClick={() => setCnicBackUploaded(!cnicBackUploaded)}
                        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                          cnicBackUploaded
                            ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 text-slate-400'
                        }`}
                      >
                        <Upload className="h-5 w-5 mx-auto mb-1 text-slate-400" />
                        <span className="text-xs font-bold block">CNIC Back Picture</span>
                        <span className="text-[10px] text-slate-400">
                          {cnicBackUploaded ? '✓ Attached (Simulated)' : 'Click to attach photo'}
                        </span>
                      </div>
                    </div>

                    {/* Factory / NTN proof */}
                    {role === 'SUPPLIER' && (
                      <div
                        onClick={() => setNtnDocUploaded(!ntnDocUploaded)}
                        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                          ntnDocUploaded
                            ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 text-slate-400'
                        }`}
                      >
                        <Building2 className="h-5 w-5 mx-auto mb-1 text-slate-400" />
                        <span className="text-xs font-bold block">Factory Photo or NTN Certificate</span>
                        <span className="text-[10px] text-slate-400">
                          {ntnDocUploaded ? '✓ Attached (Simulated)' : 'Click to attach factory verification photo'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Summary Verification Checklist */}
                  <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Registration Summary:
                    </span>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Business / Store Name:</span>
                      <span className="font-bold text-white">{businessName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>NADRA CNIC:</span>
                      <span className="font-mono text-emerald-400">{cnic}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Contact & Phone:</span>
                      <span>
                        {fullName} ({phone})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Payout Account:</span>
                      <span className="font-mono">
                        {bankName} ({accountNumber})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalSubmit}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black px-6 py-2.5 text-xs transition shadow-lg shadow-emerald-950 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-3.5 w-3.5 animate-spin" />
                          <span>Verifying Identity with NADRA & Creating Store...</span>
                        </>
                      ) : (
                        <>
                          <BadgeCheck className="h-4 w-4" />
                          <span>Complete Registration & Get Verified Badge</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
