import { Heart, GraduationCap, Users, Sparkles, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useCMS } from '../lib/cms';

export default function About() {
  const { founderSettings, team, contactSettings } = useCMS();
  
  // Filter active staff members
  const staff = team.filter(member => !member.hidden);

  return (
    <div className="space-y-16 pb-16">
      {/* About Overview */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-pink-100 shadow-md space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900">
            About Susbee Beauty Studio
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
            Susbee Beauty Studio and Training Center is a leading, professional beauty institution based in Lekhnath, Taalchowk. We are dedicated to delivering top-tier cosmetic styling, custom hair styling, therapeutic skin restoration, and certified academy programs for students across Pokhara and Lekhnath.
          </p>
          <div className="pt-4 grid grid-cols-2 gap-4 text-xs sm:text-sm font-semibold text-pink-850">
            <span className="bg-pink-50 px-4 py-2.5 rounded-lg border border-pink-100">
              📅 Opening Days: Everyday
            </span>
            <span className="bg-pink-50 px-4 py-2.5 rounded-lg border border-pink-100">
              🕐 Opening Time: {contactSettings?.businessHours || "8 AM – 7 PM"}
            </span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-800 via-pink-700 to-rose-600 text-white py-16 px-4 text-center rounded-2xl mx-4 shadow-lg">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center space-y-4">
          <span className="bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1">
            <Users className="h-4 w-4" /> Professional Artists
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Our Beautiful Team
          </h2>
          <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed max-w-2xl font-sans">
            Meet the certified cosmetologists, hair specialists, and precise technicians who work hand-in-hand to bring your beauty visions to life.
          </p>
        </div>
      </section>

      {/* Founder Profile */}
      {founderSettings && (
        <section className="max-w-4xl mx-auto px-4 space-y-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
            Meet Our Founder
          </h3>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-pink-100 shadow-md grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="flex flex-col items-center text-center space-y-3 md:col-span-1">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-pink-500 to-rose-700 border-4 border-pink-100 shadow-lg overflow-hidden flex items-center justify-center relative">
                {founderSettings.photoUrl ? (
                  <img 
                    src={founderSettings.photoUrl} 
                    alt={founderSettings.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-5xl">👑</span>
                )}
                <span className="absolute bottom-1 right-1 bg-pink-500 text-white p-1.5 rounded-full border-2 border-white text-xs">
                  ✨
                </span>
              </div>
              <h4 className="font-serif font-black text-xl text-pink-950 leading-none mt-1">
                {founderSettings.name}
              </h4>
              <p className="text-[10px] bg-pink-500 text-white font-bold tracking-wider uppercase px-3.5 py-1 rounded-full border border-pink-100">
                {founderSettings.designation || "Founder & Director"}
              </p>
            </div>

            <div className="md:col-span-3 space-y-4">
              <span className="text-[11px] text-pink-500 font-bold uppercase tracking-widest block">
                Director's Note
              </span>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {founderSettings.biography}
              </p>
              
              {founderSettings.skills && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {founderSettings.skills.split(',').map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-pink-50 text-pink-700 text-xs font-bold px-3 py-1 rounded-full border border-pink-100/60 font-sans"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4 flex-wrap">
                {founderSettings.instagram && (
                  <a
                    href={founderSettings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Instagram className="h-4 w-4" /> Instagram Portfolio
                  </a>
                )}
                {founderSettings.whatsapp && (
                  <a
                    href={founderSettings.whatsapp.startsWith('http') ? founderSettings.whatsapp : `https://wa.me/${founderSettings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" /> Chat directly
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Staff Grid */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
          Our Specialised Staff
        </h3>

        {staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-pink-100/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full"
              >
                {/* Photo with fallback */}
                <div className="h-44 bg-gradient-to-tr from-pink-100 to-rose-100 relative overflow-hidden flex items-center justify-center">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-5xl select-none">💆‍♀️</span>
                  )}
                  {member.experience && (
                    <span className="absolute top-4 right-4 bg-white/95 text-pink-900 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full border border-pink-100 shadow-xs">
                      {member.experience}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-lg text-pink-950">
                      {member.name}
                    </h4>
                    <p className="text-xs text-pink-600 font-bold uppercase tracking-wider">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed pt-1.5">
                      {member.description}
                    </p>
                  </div>

                  {member.skills && (
                    <div className="flex gap-1.5 flex-wrap pt-2">
                      {member.skills.split(',').map((s, i) => (
                        <span
                          key={i}
                          className="bg-pink-50/50 text-pink-700 text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-md border border-pink-100 font-sans"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-pink-100 text-gray-500 text-sm">
            No specialized staff profiles found. Register your stylists in the admin dashboard!
          </div>
        )}
      </section>

      {/* Brand Values */}
      <section className="bg-gradient-to-br from-pink-50 to-pink-100/30 py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900">
              Our Team Values
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto font-sans">
              Our culture revolves around precision craft, mutual respect, and bringing absolute delight to every customer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Heart, label: 'Client First', desc: "Every appointment starts with listening to what fits you best — always." },
              { icon: GraduationCap, label: 'Continuous Growth', desc: "We actively update our skills with modern style trends year-round." },
              { icon: Users, label: 'One Family', desc: "We lift each other up and motivate creative exploration together." },
              { icon: Sparkles, label: 'Excellence', desc: "We treat each styling layer as a signature masterpiece, no less." },
            ].map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-xs border border-pink-100/40 text-center space-y-3"
                >
                  <div className="bg-pink-100 text-pink-600 p-3 rounded-full inline-block">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-pink-900">
                    {v.label}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recruitment CTA Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-pink-950 to-pink-850 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-lg text-center space-y-4">
          <div className="absolute left-0 bottom-0 text-white/5 text-[150px] -translate-x-12 translate-y-12 select-none font-serif">
            💄
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black">
            Want to Join Our Team?
          </h3>
          <p className="text-sm text-pink-200/90 max-w-xl mx-auto font-sans">
            We are always scouting for enthusiastic, certified hair stylists, facial practitioners, and cosmetics artists to expand our parlor family.
          </p>
          <div className="pt-4">
            <a
              href={`https://wa.me/${contactSettings?.phone || "9856103666"}?text=Hello!%20I%20am%20interested%20in%20joining%20the%20Susbee%20Beauty%20Studio%20team.%20Please%20share%20more%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-pink-900 hover:bg-pink-50 font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 fill-pink-900 stroke-none" />
              <span>Apply via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
