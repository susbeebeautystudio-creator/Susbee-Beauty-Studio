import { useState } from 'react';
import { Sparkles, MapPin, Clock } from 'lucide-react';
import { useCMS } from '../lib/cms';

export default function Header() {
  const [imageError, setImageError] = useState(false);
  const { homeSettings, websiteSettings } = useCMS();

  const defaultLogo = "https://i.imgur.com/pGyeP37.png";

  const logoSrc = (!websiteSettings?.logoUrl || websiteSettings.logoUrl.includes('onecompiler.io') || websiteSettings.logoUrl.includes('Picsart'))
    ? defaultLogo
    : websiteSettings.logoUrl;

  const title = websiteSettings?.websiteName || "Susbee Beauty Studio And Training Center";
  const location = homeSettings?.location || "Lekhnath, Taalchowk, Nepal";
  const openingHours = homeSettings?.openingTime || "Everyday: 8 AM – 7 PM";

  return (
    <header className="relative bg-gradient-to-br from-pink-800 via-pink-600 to-rose-500 text-white py-12 px-4 text-center overflow-hidden shadow-md">
      {/* Decorative SVG pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {!imageError ? (
          <img
            src={logoSrc}
            className="h-24 w-24 rounded-full border-3 border-white/40 shadow-lg object-cover mb-4 animate-[bounce_3s_infinite]"
            alt="Susbee Logo"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src={defaultLogo}
            className="h-24 w-24 rounded-full border-3 border-white/40 shadow-lg object-cover mb-4"
            alt="Susbee Logo Fallback"
            referrerPolicy="no-referrer"
          />
        )}

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm leading-tight max-w-3xl">
          {title}
        </h1>

        <p className="mt-3 text-sm sm:text-base font-medium text-pink-100 tracking-[0.15em] uppercase flex items-center justify-center gap-1.5 flex-wrap">
          <Sparkles className="h-4 w-4 text-pink-200 animate-pulse" />
          <span>Professional Beauty Services & Training</span>
          <Sparkles className="h-4 w-4 text-pink-200 animate-pulse" />
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm text-pink-100/90 font-medium">
          <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
            <MapPin className="h-3.5 w-3.5 text-pink-200" />
            {location}
          </span>
          <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
            <Clock className="h-3.5 w-3.5 text-pink-200" />
            {openingHours}
          </span>
        </div>
      </div>
    </header>
  );
}
