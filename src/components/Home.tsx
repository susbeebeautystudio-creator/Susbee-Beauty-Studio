import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, ChevronDown, Award, Calendar, Phone, Mail, 
  MapPin, Star, Instagram, Facebook, Video, HelpCircle, Eye, X, MessageCircle
} from 'lucide-react';
import { useCMS } from '../lib/cms';

interface HomeProps {
  onNavigateToBooking: () => void;
  onNavigateToTraining: () => void;
  onBookingSuccess?: (phone: string) => void;
}

const parseGoogleMapEmbedUrl = (input: string | undefined): string => {
  const fallback = "https://www.google.com/maps?q=Susbee%20Beauty%20Studio%20Taalchowk&output=embed";
  if (!input) return fallback;

  const trimmed = input.trim();
  if (
    !trimmed || 
    trimmed === "https://maps.google.com" || 
    trimmed === "https://www.google.com/maps" || 
    trimmed === "https://maps.google.com/"
  ) {
    return fallback;
  }

  // 1. Extract src from iframe tag
  if (trimmed.startsWith("<iframe") || trimmed.includes("src=")) {
    const srcMatch = trimmed.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 2. Already an embed link
  if (trimmed.includes("output=embed") || trimmed.includes("/maps/embed")) {
    return trimmed;
  }

  // 3. Convert place link to search embed
  if (trimmed.includes("google.co") || trimmed.includes("google.com")) {
    const placeMatch = trimmed.match(/\/maps\/place\/([^\/]+)/);
    if (placeMatch && placeMatch[1]) {
      return `https://www.google.com/maps?q=${placeMatch[1]}&output=embed`;
    }

    try {
      const urlObj = new URL(trimmed);
      const q = urlObj.searchParams.get("q");
      if (q) {
        return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      }
    } catch (e) {
      // ignore URL parsing issues
    }
  }

  // 4. Raw search term
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
  }

  return trimmed;
};

export default function Home({ onNavigateToBooking, onNavigateToTraining, onBookingSuccess }: HomeProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const { 
    homeSettings, 
    contactSettings, 
    services, 
    gallery, 
    faqs, 
    reviews, 
    beforeAfter, 
    popupAnnouncement 
  } = useCMS();

  // Load TikTok script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Popup announcement trigger
  useEffect(() => {
    if (popupAnnouncement?.enabled) {
      const shown = localStorage.getItem('susbee_announcement_shown');
      if (popupAnnouncement.showOnce && shown) {
        setShowPopup(false);
      } else {
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [popupAnnouncement]);

  const closePopup = () => {
    setShowPopup(false);
    if (popupAnnouncement?.showOnce) {
      localStorage.setItem('susbee_announcement_shown', 'true');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Filter out hidden items
  const activeServices = services.filter(s => !s.hidden);
  const activeGallery = gallery.filter(g => !g.hidden);
  const activeFaqs = faqs.filter(f => !f.hidden);
  const activeReviews = reviews.filter(r => !r.hidden);

  return (
    <div className="space-y-16 pb-16">
      {/* Dynamic Pop-up Announcement */}
      <AnimatePresence>
        {showPopup && popupAnnouncement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative border border-pink-100 flex flex-col"
            >
              <button 
                onClick={closePopup}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full z-10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {popupAnnouncement.imageUrl && (
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={popupAnnouncement.imageUrl} 
                    alt={popupAnnouncement.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              <div className="p-6 text-center space-y-4">
                <h4 className="font-serif text-2xl font-black text-pink-900 leading-tight">
                  {popupAnnouncement.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed font-sans">
                  {popupAnnouncement.description}
                </p>
                
                {popupAnnouncement.buttonText && (
                  <div className="pt-2">
                    <a
                      href={popupAnnouncement.buttonLink}
                      onClick={closePopup}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-bold px-8 py-3.5 rounded-full inline-block shadow-lg hover:shadow-pink-500/20 transition-all hover:-translate-y-0.5"
                    >
                      {popupAnnouncement.buttonText}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section */}
      <section id="hero" className="relative px-4 pt-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-pink-200/50 shadow-xl overflow-hidden relative p-8 sm:p-12 text-center">
          {/* Sparkles */}
          <div className="absolute top-6 left-6 text-pink-500 animate-[pulse_2s_infinite]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="absolute top-12 right-12 text-pink-500 animate-[pulse_2.5s_infinite]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="absolute bottom-12 left-12 text-pink-500 animate-[pulse_1.8s_infinite]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="absolute bottom-6 right-6 text-pink-500 animate-[pulse_2.2s_infinite]">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-pink-900 leading-tight">
            {homeSettings?.heroTitle || "Welcome to Susbee Beauty Studio"}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-black text-pink-600/90 tracking-[0.2em] uppercase">
            {homeSettings?.heroSubtitle || "✨ Established in 2026 in Lekhnath, Taalchowk ✨"}
          </p>
          <p className="mt-6 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-sans">
            {homeSettings?.heroDescription || "Your premium destination for exquisite bridal makeup, contemporary hair styling, relaxing skincare therapies, and professional, certified beauty training."}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onNavigateToBooking}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-pink-500/30 hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              {homeSettings?.heroButtonText || "Book Appointment Now 💄"}
            </button>
            <button
              onClick={onNavigateToTraining}
              className="bg-pink-100 hover:bg-pink-200/80 text-pink-800 font-bold px-8 py-3.5 rounded-full shadow-xs transition-all hover:-translate-y-0.5 border border-pink-200 cursor-pointer"
            >
              Explore Training Courses 📚
            </button>
          </div>
        </div>
      </section>

      {/* Special Offer Banner if any */}
      {homeSettings?.discountBanner && (
        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-4 rounded-xl shadow-md flex items-center gap-3 font-semibold justify-center text-center animate-pulse">
            <span className="text-xl">🎉</span>
            <span className="text-sm sm:text-base">{homeSettings.discountBanner}</span>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section id="why-choose-us" className="max-w-4xl mx-auto px-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
          Why Choose Us
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[
            'Professional Bridal Makeup Specialists',
            'Modern Hair Styling & Advanced Coloring',
            'Certified & Accredited Training Academy',
            'Hygienic, Elegant & Friendly Environment',
          ].map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl shadow-xs border border-pink-100 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <div className="bg-pink-100 p-2.5 rounded-full text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                <Check className="h-5 w-5 stroke-[3]" />
              </div>
              <span className="font-bold text-gray-700 font-sans group-hover:text-pink-900 transition-colors">
                {feat}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Services List with Rates */}
      <section id="services-pricing" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center sm:text-left space-y-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
            Our Beauty Menu & Prices
          </h3>
          <p className="text-sm text-gray-500 font-sans">
            Click any menu sheet below to zoom and view our full rates list.
          </p>
        </div>

        {activeServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((svc) => (
              <div 
                key={svc.id}
                className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-md p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:border-pink-200 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="font-serif text-lg font-black text-pink-950">
                      {svc.name}
                    </h4>
                  </div>
                  {svc.imageUrl && (
                    <div 
                      className="relative rounded-2xl overflow-hidden border border-pink-50 shadow-xs cursor-zoom-in bg-pink-50/20 aspect-[3/4]"
                      onClick={() => setSelectedImage(svc.imageUrl)}
                    >
                      <img 
                        src={svc.imageUrl} 
                        alt={svc.name} 
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="bg-pink-600/95 text-white font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                          <Eye className="h-4 w-4" /> Click to Zoom
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-pink-100 text-gray-500 text-sm">
            No items in the menu catalog yet. Add them in the admin dashboard!
          </div>
        )}
      </section>

      {/* TikTok embedded feed */}
      <section id="tiktok" className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block self-start mb-8">
          TikTok Transformations
        </h3>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100 space-y-4">
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-block">
              Trending Tutorial
            </span>
            <h4 className="font-serif text-xl font-bold text-pink-900">
              Watch Us Work the Magic!
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              We share amazing before-and-after bridal tutorials, cosmetic reviews, and client styling sessions on TikTok. Check out our real creations and join our beauty family!
            </p>
            <a
              href={contactSettings?.tiktok || "https://www.tiktok.com/@susbeebeautystudio"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-colors"
            >
              <Video className="h-4 w-4" /> Visit TikTok Channel
            </a>
          </div>

          <div className="flex justify-center bg-white p-4 rounded-2xl shadow-md border border-pink-100/50">
            <blockquote
              className="tiktok-embed w-full max-w-[325px] overflow-hidden rounded-xl"
              cite={contactSettings?.tiktok || "https://www.tiktok.com/@susbeebeautystudio"}
              data-unique-id="susbeebeautystudio"
              data-embed-type="creator"
              style={{ minHeight: '380px' }}
            >
              <section className="p-4 text-center text-xs text-gray-400">
                <a target="_blank" href={contactSettings?.tiktok || "https://www.tiktok.com/@susbeebeautystudio"} className="text-pink-600 hover:underline">
                  @susbeebeautystudio
                </a>
              </section>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Bridal Gallery */}
      <section id="gallery" className="max-w-4xl mx-auto px-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block mb-8">
          Bridal & Makeup Gallery
        </h3>

        {activeGallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {activeGallery.map((img) => (
              <div
                key={img.id}
                className="group relative h-48 rounded-xl overflow-hidden shadow-sm bg-zinc-100 cursor-pointer border border-pink-100/40"
                onClick={() => setSelectedImage(img.imageUrl)}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Bridal style"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-xs font-semibold">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-pink-100 text-gray-500 text-sm">
            Gallery is empty. Add portfolio images in the admin dashboard!
          </div>
        )}
      </section>

      {/* Follow Our Beauty Work */}
      <section id="social-connect" className="max-w-4xl mx-auto px-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block mb-8">
          Follow Our Beauty Journey
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-pink-100 p-4 rounded-full text-pink-600 mb-4">
              <Instagram className="h-6 w-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-pink-900">📸 Instagram</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Explore gorgeous bridal transformation snapshots, close-up details, and day-to-day moments at our parlor.
            </p>
            <a
              href={contactSettings?.instagram || "https://www.instagram.com/susbeebeautyparlour.1234"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs transition-colors"
            >
              Open Instagram
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-pink-100 p-4 rounded-full text-pink-600 mb-4">
              <Facebook className="h-6 w-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-pink-900">🌐 Facebook</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Find special discount packages, public announcements, and course curriculum registrations for training classes.
            </p>
            <a
              href={contactSettings?.facebook || "https://www.facebook.com/susbeeBeautyStudio"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs transition-colors"
            >
              Open Facebook
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-pink-100 p-4 rounded-full text-pink-600 mb-4">
              <Video className="h-6 w-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-pink-900">🎵 TikTok Clips</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Catch lightning quick video tutorials, cosmetic testing, product recommendations, and trending beauty audios.
            </p>
            <a
              href={contactSettings?.tiktok || "https://www.tiktok.com/@susbeebeautystudio"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs transition-colors"
            >
              Watch TikTok
            </a>
          </div>
        </div>
      </section>

      {/* Hair Care FAQs */}
      {activeFaqs.length > 0 && (
        <section id="hair-care-faq" className="max-w-2xl mx-auto px-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block mb-8">
            Frequently Asked Questions
          </h3>

          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm divide-y divide-pink-100 overflow-hidden">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.id} className="transition-all">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-700 hover:text-pink-900 font-sans outline-hidden cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-pink-500 shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-pink-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-11 pb-5 text-sm text-gray-600 leading-relaxed font-sans">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Reviews */}
      {activeReviews.length > 0 && (
        <section id="reviews" className="max-w-4xl mx-auto px-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block mb-8">
            Customer Reviews
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border-l-4 border-pink-500 shadow-sm space-y-3 relative hover:shadow-md transition-all"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <p className="text-sm italic text-gray-600 leading-relaxed font-sans">
                  "{rev.text}"
                </p>
                <p className="text-xs text-pink-800 font-bold tracking-wide">
                  — {rev.author}, {rev.location}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Find us on Map */}
      <section id="map-location" className="max-w-4xl mx-auto px-4 space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
          Find Us on Google Map
        </h3>

        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-pink-100 p-2">
          <iframe
            className="w-full h-96 rounded-xl"
            src={parseGoogleMapEmbedUrl(contactSettings?.googleMapLink)}
            title="Location map"
            loading="lazy"
          />
        </div>

        <div className="text-center pt-4">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJN1gAdAC9lTkRiFSYIwsDZv8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Star className="h-5 w-5 fill-white stroke-none" />
            <span>Give Us a Google Review</span>
          </a>
        </div>
      </section>

      {/* Contact information footer */}
      <section id="contact-info" className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-pink-100 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="bg-pink-100 p-3 rounded-full text-pink-600">
              <Phone className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-pink-900 text-sm tracking-wider uppercase">Call Us</h4>
            <p className="text-xs text-gray-600 font-mono">{contactSettings?.phone || "9856103666"}</p>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="bg-pink-100 p-3 rounded-full text-pink-600">
              <Mail className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-pink-900 text-sm tracking-wider uppercase">Email Us</h4>
            <p className="text-xs text-gray-600 select-all font-mono">{contactSettings?.email || "susbeebeautystudio@gmail.com"}</p>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="bg-pink-100 p-3 rounded-full text-pink-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-pink-900 text-sm tracking-wider uppercase">Location</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">{contactSettings?.address || "Lekhnath, Taalchowk"}</p>
          </div>
        </div>
      </section>

      {/* Selected Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-3xl max-h-[90vh]"
            >
              <img
                src={selectedImage}
                alt="Selected preview"
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain border border-white/20"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full cursor-pointer"
              >
                Close (Esc)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
