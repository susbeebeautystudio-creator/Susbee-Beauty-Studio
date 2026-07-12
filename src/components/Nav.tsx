import { Home, BookOpen, User, FileText, CalendarRange, ShieldCheck } from 'lucide-react';

interface NavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Nav({ activePage, setActivePage }: NavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'about', label: 'About Us', icon: User },
    { id: 'blog', label: 'Blogs & Tips', icon: FileText },
    { id: 'my-bookings', label: 'Booking', icon: CalendarRange },
  ];

  return (
    <nav className="bg-pink-900 sticky top-0 z-40 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Susbee Studio logo & title on the top-left side */}
        <div 
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer self-start md:self-auto group"
        >
          <img
            src="https://i.imgur.com/pGyeP37.png"
            className="h-10 w-10 rounded-full border-2 border-pink-300 object-cover group-hover:scale-105 transition-transform"
            alt="Susbee Studio Logo"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-serif text-white font-black tracking-wide text-sm sm:text-base leading-none">
              Susbee Beauty Studio
            </span>
            <span className="text-[9px] text-pink-200 uppercase tracking-widest font-bold font-sans mt-0.5">
              & Training Center
            </span>
          </div>
        </div>

        {/* Menu items list below/beside logo */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 w-full md:w-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-200 outline-hidden ${
                  isActive
                    ? 'text-white bg-pink-800 shadow-inner'
                    : 'text-pink-100/85 hover:text-white hover:bg-pink-800/40'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
