import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, Key, RefreshCw, LogOut, CheckCircle, Clock, XCircle, ChevronDown, 
  Phone, Calendar, User, Search, Trash2, ShieldAlert, Award, FileSpreadsheet,
  Plus, Edit, Eye, Mail, X, Filter, Users, Sparkles, CreditCard, AlertTriangle,
  LayoutDashboard, Home, BookOpen, Star, HelpCircle, Image, Globe, Heart, BellRing, Settings, Sliders
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, setDoc, orderBy, onSnapshot, query } from 'firebase/firestore';

// Modular Child Editors
import DashboardOverview from './admin/DashboardOverview';
import BookingLogs from './admin/BookingLogs';
import PageEditors from './admin/PageEditors';
import ListEditors from './admin/ListEditors';

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
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Admin Section
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Unified Alert Banner / Modal Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  // Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && (
        currentUser.email === 'admin@susbee.com' || 
        currentUser.email === 'susbeebeautystudio@gmail.com' ||
        currentUser.email === 'sagarchokhal0@gmail.com'
      )) {
        setIsLoggedIn(true);
        subscribeToAllBookings();
      } else {
        setIsLoggedIn(false);
        setBookings([]);
      }
    });
    return unsubscribe;
  }, []);

  const subscribeToAllBookings = () => {
    setLoading(true);
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: Booking[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as Booking);
      });
      setBookings(fetched);
      setLoading(false);
    }, (err) => {
      console.error("Firestore booking query error:", err);
      setError("Failed to stream booking collection from Firestore.");
      setLoading(false);
    });
    return unsub;
  };

  const triggerNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = username.trim() === 'admin' ? 'admin@susbee.com' : username.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      triggerNotification('success', 'Access Granted', 'Control Center session verified.');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        // Self-bootstrapping credential for 'admin' & 'susbee@2026'
        if (username.trim() === 'admin' && password === 'susbee@2026') {
          try {
            const cred = await createUserWithEmailAndPassword(auth, 'admin@susbee.com', 'susbee@2026');
            await setDoc(doc(db, 'users', cred.user.uid), {
              displayName: 'System Admin',
              email: 'admin@susbee.com',
              phone: '9856103666',
              role: 'admin',
              createdAt: new Date().toISOString()
            });
            triggerNotification('success', 'Admin Bootstrapped', 'Admin credential auto-provisioned securely.');
          } catch (createErr: any) {
            setError('Bootstrapping error: ' + createErr.message);
          }
        } else {
          setError('Invalid administrator credentials.');
        }
      } else {
        setError(err.message || 'Authentication error.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
      triggerNotification('success', 'Signed Out', 'Your session ended securely.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Derive unique customer list
  const customersMap = new Map();
  bookings.forEach(b => {
    if (b.customerPhone) {
      const key = b.customerPhone;
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: b.customerName,
          phone: b.customerPhone,
          email: b.customerEmail || '',
          totalBookings: 1
        });
      } else {
        const existing = customersMap.get(key);
        existing.totalBookings += 1;
      }
    }
  });
  const customersList = Array.from(customersMap.values());

  const sidebarGroups = [
    {
      group: "Logs & Registers",
      items: [
        { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
        { id: "bookings", label: "Appointments Registry", icon: Calendar }
      ]
    },
    {
      group: "Single Page Configs",
      items: [
        { id: "home", label: "Home Page Editor", icon: Home },
        { id: "founder", label: "Founder Bio", icon: Heart },
        { id: "contact", label: "Contact & Map", icon: Mail },
        { id: "announcements", label: "Popup Announcement", icon: BellRing }
      ]
    },
    {
      group: "Dynamic Catalog Lists",
      items: [
        { id: "services", label: "Menu Catalog", icon: FileSpreadsheet },
        { id: "gallery", label: "Gallery Showcase", icon: Image },
        { id: "courses", label: "Academy Courses", icon: Award },
        { id: "team", label: "Team Profiles", icon: Users },
        { id: "testimonials", label: "Client Testimonials", icon: Sparkles },
        { id: "reviews", label: "Salon Reviews", icon: Star },
        { id: "blog", label: "Blog Articles CMS", icon: BookOpen },
        { id: "faqs", label: "FAQs Management", icon: HelpCircle },
        { id: "hero_slider", label: "Hero Slider Config", icon: Sliders },
        { id: "offers", label: "Special Offers", icon: CreditCard }
      ]
    },
    {
      group: "Metadata & Global settings",
      items: [
        { id: "website_settings", label: "Website Configuration", icon: Settings },
        { id: "booking_settings", label: "Scheduling Config", icon: Clock },
        { id: "seo", label: "SEO Headers Metadata", icon: Globe },
        { id: "footer", label: "Footer Layout", icon: XCircle }
      ]
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 font-semibold" id="admin-login-sec">
        <div className="bg-white rounded-3xl border border-pink-100 shadow-2xl p-8 space-y-6 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600"></div>

          <div className="text-center space-y-2">
            <div className="bg-pink-100 p-4 rounded-full inline-block text-pink-600">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-3xl font-extrabold text-pink-900">
              Admin Login
            </h2>
            <p className="text-xs text-gray-500">
              Susbee Beauty Studio Secure Control Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-pink-400">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-sans"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-center animate-pulse">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Verifying access...' : 'Secure Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 text-[10px] text-gray-400/80 tracking-wider">
            Protected Workspace • Susbee Beauty Studio and Training Center
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-2 sm:px-4 space-y-6" id="admin-dashboard-panel">
      {/* Admin header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="space-y-1.5 z-10 font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> System Manager
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-pink-900">
            Control Center Dashboard
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Reviewing live database structures, appointment schedulers, and CMS records instantly.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-zinc-950 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md z-10 self-start md:self-auto"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-pink-100 rounded-3xl p-5 space-y-6 shadow-xs max-h-[80vh] overflow-y-auto sticky top-6">
          {sidebarGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-pink-800/60 tracking-widest px-2">{group.group}</h4>
              <div className="space-y-1 flex flex-col">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer border ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md border-transparent' 
                          : 'text-gray-600 hover:bg-pink-50/50 border-transparent hover:text-pink-900'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Editor Panel */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'overview' && (
            <DashboardOverview 
              bookings={bookings} 
              customersCount={customersList.length} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'bookings' && (
            <BookingLogs 
              bookings={bookings} 
              customersList={customersList} 
              triggerNotification={triggerNotification} 
            />
          )}

          {/* Simple configurations */}
          {['home', 'founder', 'contact', 'announcements', 'seo', 'footer', 'website_settings', 'booking_settings'].includes(activeTab) && (
            <PageEditors 
              section={activeTab} 
              triggerNotification={triggerNotification} 
            />
          )}

          {/* Catalog Lists configurations */}
          {['services', 'gallery', 'courses', 'team', 'testimonials', 'reviews', 'blog', 'faqs', 'hero_slider', 'offers'].includes(activeTab) && (
            <ListEditors 
              section={activeTab} 
              triggerNotification={triggerNotification} 
            />
          )}
        </div>
      </div>

      {/* NOTIFICATION TOAST MODAL */}
      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-[100] overflow-y-auto" id="notification-modal">
            <div className="fixed inset-0 bg-pink-950/20 backdrop-blur-xs" onClick={() => setNotification(null)}></div>
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white w-full max-w-sm rounded-3xl border border-pink-100 shadow-2xl p-6 space-y-4 z-10 text-center font-semibold"
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
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{notification.message}</p>
                </div>

                <button
                  onClick={() => setNotification(null)}
                  className="bg-pink-900 hover:bg-pink-950 text-white font-bold w-full py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close Message
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
