import { useCMS } from '../lib/cms';

export default function Marquee() {
  const { homeSettings } = useCMS();
  
  const text = homeSettings?.marqueeText || "✨ BRIDAL SPECIALIST • SKINCARE THERAPY • CERTIFIED BEAUTY COURSES • HAIR COLOR & STYLE • NAIL ART ACADEMY ✨";
  const announcements = text.split('•').map(t => t.trim());

  // Repeat twice to ensure smooth seamless loop
  const content = [...announcements, ...announcements];

  return (
    <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 overflow-hidden text-sm font-semibold select-none border-b border-pink-700/20">
      <div className="relative w-full overflow-hidden flex">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          {content.map((txt, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span>{txt}</span>
              {idx < content.length - 1 && <span className="text-pink-200">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
