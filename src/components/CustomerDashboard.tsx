import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, User, Phone, CheckCircle, Clock, AlertTriangle, BookOpen, LogOut, 
  LogIn, Lock, Mail, Plus, X, Eye, EyeOff, FileText, Sparkles, CreditCard, UserCheck, Trash2
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import AdminDashboard from './AdminDashboard';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  category: string;
  staffName: string;
  bookingDate: string;
  bookingTime: string;
  totalPrice: number;
  notes: string;
  bookingStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid';
  createdAt: string;
  updatedAt?: string;
}

interface CustomerDashboardProps {
  initialPhone?: string;
}

const defaultServices = [
  { name: "Facial Treatment", category: "Skincare", price: 1500 },
  { name: "Deep Cleansing", category: "Skincare", price: 1000 },
  { name: "Bridal Makeup", category: "Makeup", price: 15000 },
  { name: "Waxing Services", category: "Salon Services", price: 800 },
  { name: "Manicure Session", category: "Nails", price: 1200 },
  { name: "Pedicure Session", category: "Nails", price: 1500 },
  { name: "Hair Coloring / Tint", category: "Hair Care", price: 3500 },
  { name: "Hair Cutting & Styling", category: "Hair Care", price: 1000 },
  { name: "Nail Extensions / Gel", category: "Nails", price: 2500 },
  { name: "Eyelash Extensions", category: "Makeup", price: 2000 },
  { name: "Professional Training Course", category: "Training", price: 25000 }
];

const staffList = [
  "Priya Sharma (Senior Stylist)",
  "Sita Thapa (Makeup Specialist)",
  "Asha Gurung (Skincare Expert)",
  "Sujata Rai (Nail Artist)",
  "Any Available Staff"
];

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function CustomerDashboard({ initialPhone = '' }: CustomerDashboardProps) {
  // Authentication State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState(initialPhone);
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Bookings and States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // New Booking Modal State
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingService, setBookingService] = useState('');
  const [bookingStaff, setBookingStaff] = useState(staffList[4]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState(timeSlots[0]);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // View Booking Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Custom Confirmation Modal
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Notification Modals (Replaces alert)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  // Tab State
  const [activeMainTab, setActiveMainTab] = useState<'book' | 'history'>('history');

  // Pre-fill profile info if logged in
  useEffect(() => {
    if (user) {
      setBookingEmail(user.email || '');
      
      const isAdminEmail = user.email === 'admin@susbee.com' || 
                           user.email === 'susbeebeautystudio@gmail.com' || 
                           user.email === 'sagarchokhal0@gmail.com';

      if (isAdminEmail) {
        setUserRole('admin');
      }

      // Fetch profile
      const fetchProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setBookingName(data.displayName || '');
            setBookingPhone(data.phone || '');

            // Auto backfill / update phone to email mapping
            if (data.phone && data.email && /^\d{10}$/.test(data.phone)) {
              try {
                await setDoc(doc(db, 'phone_to_email', data.phone), {
                  email: data.email,
                  userId: user.uid
                });
              } catch (mapErr) {
                console.error("Error setting phone to email lookup document:", mapErr);
              }
            }
            
            if (isAdminEmail || data.role === 'admin') {
              setUserRole('admin');
              if (data.role !== 'admin') {
                await updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
              }
            } else {
              setUserRole(data.role || 'customer');
            }
          } else {
            setBookingName(user.displayName || '');
            if (isAdminEmail) {
              setUserRole('admin');
              await setDoc(doc(db, 'users', user.uid), {
                displayName: user.displayName || 'System Admin',
                email: user.email,
                phone: user.phoneNumber || '9856103666',
                role: 'admin',
                createdAt: new Date().toISOString()
              });
            }
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Subscribe to real-time bookings when authenticated user changes
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    setBookingsLoading(true);
    const q = query(
      collection(db, 'users', user.uid, 'bookings'),
      orderBy('createdAt', 'desc')
    );
    const unsubBookings = onSnapshot(q, (snapshot) => {
      const fetched: Booking[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as Booking);
      });
      setBookings(fetched);
      setBookingsLoading(false);
    }, (err) => {
      console.error("Error subscribing to bookings:", err);
      setBookingsError("Could not synchronize bookings in real-time.");
      setBookingsLoading(false);
    });

    return () => {
      unsubBookings();
    };
  }, [user]);

  // Parse Hash Parameter for Preselected Service
  useEffect(() => {
    const checkHashService = () => {
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const queryStr = hash.split('?')[1];
        const params = new URLSearchParams(queryStr);
        const serviceParam = params.get('service');
        if (serviceParam) {
          setBookingService(serviceParam);
          if (user) {
            setShowNewBookingModal(true);
            // Clean up the hash to prevent opening again on tab switch
            window.location.hash = '#/my-bookings';
          }
        }
      }
    };
    checkHashService();
    window.addEventListener('hashchange', checkHashService);
    return () => window.removeEventListener('hashchange', checkHashService);
  }, [user]);

  const triggerNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const identifier = authEmail.trim();
    let loginEmail = identifier;

    // Handle legacy phone-based temporary sign-in standard or custom email lookup
    if (/^\d{10}$/.test(identifier)) {
      try {
        const lookupDoc = await getDoc(doc(db, 'phone_to_email', identifier));
        if (lookupDoc.exists()) {
          const data = lookupDoc.data();
          if (data && data.email) {
            loginEmail = data.email;
          } else {
            loginEmail = `${identifier}@susbee-temp.com`;
          }
        } else {
          loginEmail = `${identifier}@susbee-temp.com`;
        }
      } catch (err) {
        console.error("Error looking up user by phone number mapping:", err);
        loginEmail = `${identifier}@susbee-temp.com`;
      }
    } else if (identifier === 'admin' || identifier === 'username-admin') {
      loginEmail = 'admin@susbee.com';
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, authPassword);
      triggerNotification('success', 'Welcome Back!', 'Successfully signed in to your dashboard.');
    } catch (err: any) {
      if ((identifier === 'admin' || identifier === 'username-admin') && authPassword === 'susbee@2026') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, 'admin@susbee.com', 'susbee@2026');
          await setDoc(doc(db, 'users', cred.user.uid), {
            displayName: 'System Admin',
            email: 'admin@susbee.com',
            phone: '9856103666',
            role: 'admin',
            createdAt: new Date().toISOString()
          });
          triggerNotification('success', 'Admin Account Created', 'Bootstrapped first admin credential successfully.');
        } catch (createErr: any) {
          setAuthError(createErr.message || 'Incorrect email, phone number, or password.');
        }
      } else {
        setAuthError('Incorrect email, phone number, or password.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const email = authEmail.trim();
    if (!email) {
      setAuthError('Please enter your email address to receive a password reset link.');
      setAuthLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      triggerNotification('success', 'Reset Link Sent', 'Please check your email inbox for a link to reset your password.');
      setAuthMode('signin');
    } catch (err: any) {
      console.error("Error sending password reset email:", err);
      setAuthError(err.message || 'Failed to send password reset email. Please make sure the email is registered.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const email = authEmail.trim();
    const phone = authPhone.trim();
    const name = authName.trim();

    if (!email || !phone || !authPassword || !authConfirmPassword || !name) {
      setAuthError('All fields are required.');
      setAuthLoading(false);
      return;
    }

    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      setAuthLoading(false);
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setAuthError('Phone number must be exactly 10 digits.');
      setAuthLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, authPassword);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        // Create Firestore user record
        await setDoc(doc(db, 'users', cred.user.uid), {
          displayName: name,
          email,
          phone,
          role: 'customer',
          createdAt: new Date().toISOString()
        });

        // Save phone to email mapping
        await setDoc(doc(db, 'phone_to_email', phone), {
          email,
          userId: cred.user.uid
        });

        triggerNotification('success', 'Account Created!', 'Thank you for registering. You can now start booking beauty sessions!');
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Email is already registered. Please sign in instead.');
      } else {
        setAuthError(err.message || 'Failed to register account.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      if (cred.user) {
        // Check if profile exists, otherwise create it
        const docRef = doc(db, 'users', cred.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            displayName: cred.user.displayName || 'Google Client',
            email: cred.user.email || '',
            phone: '',
            role: 'customer',
            createdAt: new Date().toISOString()
          });
        }
        triggerNotification('success', 'Google Sign-In Success', 'Connected to secure customer dashboard.');
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setAuthError('Google login popup was blocked. Please open this app in a new tab.');
      } else {
        setAuthError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      triggerNotification('success', 'Signed Out', 'You have been successfully signed out.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      triggerNotification('error', 'Authentication Required', 'Please log in to your account to place a booking.');
      return;
    }

    if (!bookingName || !bookingPhone || !bookingService || !bookingDate || !bookingTime) {
      triggerNotification('error', 'Missing Fields', 'Please complete all fields to submit appointment.');
      return;
    }

    if (bookingPhone.length !== 10) {
      triggerNotification('error', 'Invalid Phone', 'Phone number must be exactly 10 digits.');
      return;
    }

    setBookingSubmitting(true);

    try {
      const selectedSrvInfo = defaultServices.find(s => s.name === bookingService);
      const category = selectedSrvInfo ? selectedSrvInfo.category : 'General';
      const totalPrice = selectedSrvInfo ? selectedSrvInfo.price : 1500;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `SB-${randomNum}`;

      const bookingPayload: Booking = {
        id: bookingId,
        customerId: user.uid,
        customerName: bookingName,
        customerEmail: bookingEmail,
        customerPhone: bookingPhone,
        serviceName: bookingService,
        category,
        staffName: bookingStaff,
        bookingDate,
        bookingTime,
        totalPrice,
        notes: bookingNotes,
        bookingStatus: 'Pending',
        paymentStatus: 'Pending',
        createdAt: new Date().toISOString()
      };

      // Save to user sub-collection
      await setDoc(doc(db, 'users', user.uid, 'bookings', bookingId), bookingPayload);

      // Save to global collection
      await setDoc(doc(db, 'bookings', bookingId), bookingPayload);

      // Reset form
      setBookingNotes('');
      setShowNewBookingModal(false);
      triggerNotification('success', 'Appointment Secure!', `Your session has been registered under ID ${bookingId}.`);

    } catch (err: any) {
      triggerNotification('error', 'Submission Failed', err.message || 'Could not register appointment in Firestore.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel || !user) return;
    setCancelLoading(true);
    try {
      // Set status to Cancelled in user's sub-collection
      await updateDoc(doc(db, 'users', user.uid, 'bookings', bookingToCancel.id), {
        bookingStatus: 'Cancelled',
        updatedAt: new Date().toISOString()
      });

      // Set status to Cancelled in global collection
      await updateDoc(doc(db, 'bookings', bookingToCancel.id), {
        bookingStatus: 'Cancelled',
        updatedAt: new Date().toISOString()
      });

      setBookingToCancel(null);
      triggerNotification('success', 'Appointment Cancelled', 'Your appointment status has been updated to Cancelled.');
    } catch (err: any) {
      triggerNotification('error', 'Error', err.message || 'Failed to cancel the booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => b.bookingStatus === 'Pending' || b.bookingStatus === 'Confirmed');
  const pastBookings = bookings.filter(b => b.bookingStatus === 'Completed' || b.bookingStatus === 'Cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'Paid' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-zinc-100 text-zinc-600 border-zinc-200';
  };

  if (user && userRole === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-8" id="booking-page-container">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-pink-900">
          Client Portal & Booking
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto font-medium">
          Secure, cloud-synchronized reservation engine for premium beauty therapies.
        </p>
      </div>

      {!user ? (
        /* PORTAL AUTHENTICATION GATE */
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-pink-100 shadow-2xl p-8 space-y-6 relative overflow-hidden" id="customer-auth-container">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>

          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900">
              {authMode === 'forgot' ? 'Reset Password' : 'Customer Log In'}
            </h2>
            <p className="text-xs text-gray-400">
              {authMode === 'forgot'
                ? 'Request a link to securely recover access to your profile.'
                : 'Create an account or log in to lock down appointments and track history.'}
            </p>
          </div>

          {bookingService && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-pink-50/80 border border-pink-100 rounded-2xl p-4 text-center space-y-1.5 shadow-sm"
            >
              <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                <BookOpen className="h-3.5 w-3.5 animate-pulse" /> Enrollment Action Required
              </div>
              <p className="text-xs font-semibold text-pink-950 leading-snug">
                Please log in or create an account to book your training session:
              </p>
              <p className="text-sm font-black text-pink-800 font-serif bg-white py-1.5 px-3 rounded-lg shadow-2xs border border-pink-100 inline-block max-w-full truncate">
                {bookingService}
              </p>
            </motion.div>
          )}

          {/* Toggle Tabs */}
          {authMode !== 'forgot' && (
            <div className="flex border-b border-pink-100">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                  setAuthPassword('');
                  setAuthConfirmPassword('');
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  authMode === 'signin'
                    ? 'border-pink-600 text-pink-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                  setAuthPassword('');
                  setAuthConfirmPassword('');
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  authMode === 'signup'
                    ? 'border-pink-600 text-pink-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {authMode === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  Enter your email address above, and we will send you a secure password reset link.
                </p>
              </div>

              {authError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">
                  ⚠️ {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {authLoading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors pt-2 block"
              >
                Back to Sign In
              </button>
            </form>
          ) : authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-pink-400 hover:text-pink-600 focus:outline-hidden"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setAuthError(null);
                    }}
                    className="text-[11px] font-bold text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">
                  ⚠️ {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <LogIn className="h-4 w-4" />
                {authLoading ? 'Verifying profile...' : 'Secure Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Phone Number (10 digits)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9856103666"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Choose a password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-pink-400 hover:text-pink-600 focus:outline-hidden"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter your password"
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-pink-400 hover:text-pink-600 focus:outline-hidden"
                    title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">
                  ⚠️ {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <UserCheck className="h-4 w-4" />
                {authLoading ? 'Creating secure profile...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Google Sign-In */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-pink-150"></div>
            <span className="flex-shrink mx-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-pink-150"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-pink-200 hover:bg-pink-50 text-zinc-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs text-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </div>
      ) : (
        /* LOGGED IN CLIENT VIEW */
        <div className="space-y-6">
          {/* Active Session Card */}
          <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Client Portal
                </span>
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-pink-900">
                Welcome, {bookingName || user.email?.split('@')[0]}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Email: <strong className="text-pink-950 font-mono">{user.email}</strong> • Phone: <strong className="font-mono text-pink-950">{bookingPhone || 'Not Linked'}</strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  // Set default inputs
                  setBookingName(bookingName);
                  setBookingPhone(bookingPhone);
                  setShowNewBookingModal(true);
                }}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Book Session
              </button>
              <button
                onClick={handleLogout}
                className="bg-zinc-900 text-white px-4 py-3 rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Bookings Lists */}
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-pink-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Active & Upcoming Bookings
              </h3>

              {bookingsLoading ? (
                <div className="py-16 text-center space-y-4">
                  <div className="animate-spin inline-block h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
                  <p className="text-sm font-semibold text-pink-950">Synchronizing records with secure engine...</p>
                </div>
              ) : bookingsError ? (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 flex items-center gap-3 max-w-md mx-auto">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{bookingsError}</span>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-pink-100 p-8 text-center space-y-4">
                  <div className="bg-pink-50 text-pink-400 p-3 rounded-full inline-block">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-gray-700">No Upcoming Appointments</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Make a reservation now to book professional skincare diagnostics, master makeups, or training courses.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-pink-100/60 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold font-mono tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-sm">
                            {booking.id}
                          </span>
                          <h4 className="font-serif font-extrabold text-pink-900 text-base pt-1">
                            {booking.serviceName}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md border font-mono ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus === 'Paid' ? '💳 Paid' : '⏳ Unpaid'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-pink-50/50 pt-4 space-y-2 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-pink-400" />
                          <span>Staff: <strong className="text-gray-800">{booking.staffName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-pink-400" />
                          <span>Date: <strong className="text-gray-800">{new Date(booking.bookingDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-pink-400" />
                          <span>Time: <strong className="text-gray-800">{booking.bookingTime}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3.5 w-3.5 text-pink-400" />
                          <span>Total Bill: <strong className="text-pink-900">Rs. {booking.totalPrice}</strong></span>
                        </div>
                      </div>

                      {/* Customer Actions */}
                      <div className="flex gap-2 pt-2 border-t border-pink-50/30">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex-1 bg-pink-50 hover:bg-pink-100 text-pink-700 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </button>
                        {booking.bookingStatus === 'Pending' && (
                          <button
                            onClick={() => setBookingToCancel(booking)}
                            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel Session
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-pink-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                Past & Cancelled Bookings
              </h3>

              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-pink-100 p-8 text-center space-y-2">
                  <p className="text-xs text-gray-400">No historic appointments logged.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-pink-100/60 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm">
                            {booking.id}
                          </span>
                          <h4 className="font-serif font-extrabold text-pink-900 text-base pt-1">
                            {booking.serviceName}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md border font-mono ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-pink-50/50 pt-4 space-y-2 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-pink-400" />
                          <span>Staff: <strong className="text-gray-800">{booking.staffName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-pink-400" />
                          <span>Date: <strong className="text-gray-800">{new Date(booking.bookingDate).toLocaleDateString()}</strong></span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Overview
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW BOOKING MODAL (NO WINDOW.ALERT OR BROWSER PROMPTS) */}
      <AnimatePresence>
        {showNewBookingModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="new-booking-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewBookingModal(false)}
              className="fixed inset-0 bg-pink-950/40 backdrop-blur-xs"
            ></motion.div>

            {/* Content box */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-xl rounded-3xl border border-pink-100 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden z-10"
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-2xl font-black text-pink-900">Book Appointment</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Make a safe, secure salon reservation in real-time.</p>
                  </div>
                  <button
                    onClick={() => setShowNewBookingModal(false)}
                    className="p-1.5 rounded-full hover:bg-pink-50 text-gray-400 hover:text-pink-900 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleNewBooking} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        minLength={10}
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="e.g. 9856103666"
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="e.g. customer@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                        Select Service
                      </label>
                      <select
                        required
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm text-gray-700 font-medium"
                      >
                        <option value="">Select a Service</option>
                        {defaultServices.map((srv, idx) => (
                          <option key={idx} value={srv.name}>{srv.name} (Rs. {srv.price})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                        Booking Time Slot
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm text-gray-700 font-medium"
                      >
                        {timeSlots.map((ts, idx) => (
                          <option key={idx} value={ts}>{ts}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-950 mb-1">
                      Special Instructions / Notes (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Skin sensitivity details, general beauty preferences, or custom requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm font-sans resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewBookingModal(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
                    >
                      {bookingSubmitting ? 'Registering Appointment...' : 'Submit Booking'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW BOOKING OVERVIEW MODAL */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="view-booking-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-pink-950/40 backdrop-blur-xs"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-3xl border border-pink-100 shadow-2xl p-6 sm:p-8 space-y-6 z-10"
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>

                <div className="flex justify-between items-start border-b border-pink-50 pb-4">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-pink-600 bg-pink-50 px-2 py-0.5 rounded-sm">
                      {selectedBooking.id}
                    </span>
                    <h3 className="font-serif text-xl font-extrabold text-pink-900 pt-1">Booking Overview</h3>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-1.5 rounded-full hover:bg-pink-50 text-gray-400 hover:text-pink-900 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-50/20 p-3 rounded-xl border border-pink-100/30">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Customer Name</div>
                      <div className="text-pink-950">{selectedBooking.customerName}</div>
                    </div>
                    <div className="bg-pink-50/20 p-3 rounded-xl border border-pink-100/30">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Phone Number</div>
                      <div className="text-pink-950 font-mono">{selectedBooking.customerPhone}</div>
                    </div>
                  </div>

                  <div className="bg-pink-50/20 p-3.5 rounded-xl border border-pink-100/30">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Service & Category</div>
                    <div className="text-pink-950 text-sm font-extrabold">{selectedBooking.serviceName}</div>
                    <div className="text-pink-600/70 text-[10px] mt-0.5">Category: {selectedBooking.category}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-50/20 p-3 rounded-xl border border-pink-100/30">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Assigned Staff</div>
                      <div className="text-pink-950">{selectedBooking.staffName}</div>
                    </div>
                    <div className="bg-pink-50/20 p-3 rounded-xl border border-pink-100/30">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total Bill Amount</div>
                      <div className="text-pink-950 font-bold">Rs. {selectedBooking.totalPrice}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-50/20 p-3 rounded-xl border border-pink-100/30">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Date & Time</div>
                      <div className="text-pink-950">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</div>
                      <div className="text-pink-600 font-mono text-[10px] mt-0.5">{selectedBooking.bookingTime}</div>
                    </div>
                    <div className="bg-pink-50/20 p-3 rounded-xl border border-pink-100/30">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Status Overview</div>
                      <div className="mt-1 flex flex-col gap-1 items-start">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${getStatusColor(selectedBooking.bookingStatus)}`}>
                          Booking: {selectedBooking.bookingStatus}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                          Payment: {selectedBooking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-50/20 p-3.5 rounded-xl border border-pink-100/30">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Notes & Instructions</div>
                    <p className="text-pink-950 leading-relaxed font-normal">{selectedBooking.notes || 'No custom instruction logged.'}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="bg-pink-900 hover:bg-pink-950 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Close Overview
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCEL BOOKING CONFIRMATION MODAL (NO WINDOW.CONFIRM) */}
      <AnimatePresence>
        {bookingToCancel && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="cancel-confirmation-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingToCancel(null)}
              className="fixed inset-0 bg-pink-950/40 backdrop-blur-xs"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-sm rounded-3xl border border-pink-100 shadow-2xl p-6 sm:p-8 space-y-6 z-10 text-center"
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>

                <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <AlertTriangle className="h-6 w-6 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-pink-900">Cancel Appointment?</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Are you sure you want to cancel appointment <strong className="font-mono text-pink-950">{bookingToCancel.id}</strong>? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => setBookingToCancel(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    No, Keep Booking
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelLoading}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-60"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Session'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION MODAL (REPLACES WINDOW.ALERT) */}
      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-[100] overflow-y-auto" id="notification-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotification(null)}
              className="fixed inset-0 bg-pink-950/20 backdrop-blur-xs"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white w-full max-w-sm rounded-3xl border border-pink-100 shadow-2xl p-6 space-y-4 z-10 text-center"
              >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>

                <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center">
                  {notification.type === 'success' ? (
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="bg-rose-100 text-rose-600 p-2 rounded-full">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-serif text-lg font-bold text-pink-900">{notification.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{notification.message}</p>
                </div>

                <button
                  onClick={() => setNotification(null)}
                  className="bg-pink-900 hover:bg-pink-950 text-white font-bold w-full py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
