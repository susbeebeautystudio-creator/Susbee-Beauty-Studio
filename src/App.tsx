import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Splash from './components/Splash';
import Marquee from './components/Marquee';
import Header from './components/Header';
import Nav from './components/Nav';
import Home from './components/Home';
import Training from './components/Training';
import About from './components/About';
import Blog from './components/Blog';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppButton from './components/WhatsAppButton';
import { Instagram, Facebook, ArrowUp } from 'lucide-react';
import { CMSProvider, useCMS } from './lib/cms';

function AppContent() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  
  const { seoSettings, footerSettings, websiteSettings, contactSettings } = useCMS();

  // Dynamic SEO Meta Title Update
  useEffect(() => {
    if (seoSettings && seoSettings.pageTitle) {
      document.title = seoSettings.pageTitle;
    }
  }, [seoSettings]);

  // Back to top scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash Routing trigger & sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/training' || hash === '#/training.html') {
        setActivePage('training');
      } else if (hash === '#/about' || hash === '#/team.html') {
        setActivePage('about');
      } else if (hash === '#/blog' || hash === '#/blog.html') {
        setActivePage('blog');
      } else if (hash.startsWith('#/my-bookings')) {
        setActivePage('my-bookings');
      } else if (hash === '#/admin') {
        window.location.hash = '#/my-bookings';
        setActivePage('my-bookings');
      } else {
        setActivePage('home');
      }
    };

    // Check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when page changes in UI
  const handlePageChange = (page: string) => {
    setActivePage(page);
    if (page === 'home') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${page}`;
    }
  };

  const handleBookingSuccess = (phone: string) => {
    setCustomerPhone(phone);
    handlePageChange('my-bookings');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 text-zinc-800 antialiased font-sans select-none selection:bg-pink-300 selection:text-pink-900">
      {/* Splash Screen */}
      <AnimatePresence mode="wait">
        {!splashComplete && (
          <Splash key="splash" onComplete={() => setSplashComplete(true)} />
        )}
      </AnimatePresence>

      {splashComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col min-h-screen"
        >
          {/* Sticky Nav - placed at the absolute top now */}
          <Nav activePage={activePage} setActivePage={handlePageChange} />

          {/* Marquee Banner */}
          <Marquee />

          {/* Header - only show on the home page */}
          {activePage === 'home' && <Header />}

          {/* Core Content Layout */}
          <main className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {activePage === 'home' && (
                  <Home
                    onNavigateToBooking={() => handlePageChange('my-bookings')}
                    onNavigateToTraining={() => handlePageChange('training')}
                    onBookingSuccess={handleBookingSuccess}
                  />
                )}
                {activePage === 'training' && <Training />}
                {activePage === 'about' && <About />}
                {activePage === 'blog' && <Blog />}
                {activePage === 'my-bookings' && <CustomerDashboard initialPhone={customerPhone} />}
                {activePage === 'admin' && <AdminDashboard />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Dynamic Footer */}
          <footer className="bg-gradient-to-b from-pink-950 to-pink-900 text-white text-center py-12 px-6 space-y-4">
            <div className="max-w-xl mx-auto space-y-2">
              <p className="font-serif text-lg sm:text-xl font-bold tracking-wide text-pink-100">
                {websiteSettings?.websiteName || "Susbee Beauty Studio And Training Center"}
              </p>
              <p className="text-xs text-pink-200/60 uppercase tracking-widest leading-relaxed">
                {footerSettings?.description || "Professional bridal makeup, skincare diagnostics, hair colorists, and accredited student course programs."}
              </p>
            </div>

            <div className="flex justify-center gap-6 text-sm font-semibold text-pink-200/90 pt-2">
              <a
                href={contactSettings?.instagram || "https://www.instagram.com/susbeebeautyparlour.1234"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 flex items-center gap-1 transition-colors"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href={contactSettings?.facebook || "https://www.facebook.com/susbeeBeautyStudio"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 flex items-center gap-1 transition-colors"
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </div>

            <div className="text-[10px] text-pink-200/40 tracking-wider pt-6 border-t border-pink-900/30">
              {footerSettings?.copyright || `© ${new Date().getFullYear()} Susbee Beauty Studio. All rights reserved. Registered Institution in Pokhara-Lekhnath Area.`}
            </div>
          </footer>

          {/* Floating Action Elements */}
          <WhatsAppButton />

          {/* Scroll to top */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="fixed bottom-6 left-6 z-40 bg-pink-600 hover:bg-pink-700 text-white p-3.5 rounded-full shadow-lg transition-colors border border-pink-500/20 cursor-pointer"
                title="Back to Top"
              >
                <ArrowUp className="h-4 w-4 stroke-[3]" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}
