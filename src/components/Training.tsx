import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, GraduationCap, Package, Briefcase, HelpCircle, ChevronDown, ArrowRight, BookOpen } from 'lucide-react';
import { useCMS } from '../lib/cms';

export default function Training() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { courses, faqs } = useCMS();

  // Filter hidden training/academy courses
  const activeCourses = courses.filter(c => !c.hidden);
  
  // Also list faqs on academy page if relevant, or just render academy FAQs
  const academyFaqs = faqs.filter(f => !f.hidden);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const enroll = (courseTitle: string) => {
    window.location.hash = `#/my-bookings?service=${encodeURIComponent(courseTitle)}`;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-800 via-pink-700 to-rose-600 text-white py-16 px-4 text-center rounded-2xl mx-4 shadow-lg">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center space-y-4">
          <span className="bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1">
            <GraduationCap className="h-4 w-4" /> Professional Academy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Certified Beauty Training Courses
          </h2>
          <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed max-w-2xl font-sans">
            Master professional makeup artistry, expert hairstyling, precision nail techniques, and lash grafting with hands-on, accredited training at Susbee Beauty Studio.
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-4xl mx-auto px-4 space-y-10">
        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
            Our Programs & Certifications
          </h3>
          <p className="mt-2 text-sm text-gray-500 font-sans">
            Click Enroll to request direct details & register your seat instantly.
          </p>
        </div>

        {activeCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full"
              >
                {/* Course Image */}
                {course.imageUrl && (
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                {/* Card Header */}
                <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/30 border-b border-pink-100 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-pink-50 text-pink-700 border border-pink-100">
                      ACADEMY COURSE
                    </span>
                    <h4 className="font-serif font-bold text-lg text-pink-900 leading-tight">
                      {course.title}
                    </h4>
                  </div>
                  <span className="text-4xl select-none shrink-0">🎓</span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 font-medium font-sans">
                      <span className="flex items-center gap-1">⏱ Duration: {course.duration}</span>
                      {course.hasCertificate && (
                        <span className="flex items-center gap-1 text-pink-600 font-bold">🎖️ Certified</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-sans line-clamp-3">
                      {course.description}
                    </p>

                    {/* Feature list from curriculum */}
                    {course.curriculum && (
                      <ul className="space-y-2">
                        {course.curriculum.split('\n').filter(t => t.trim()).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 font-sans">
                            <span className="text-pink-500 text-xs font-bold shrink-0">✓</span>
                            <span>{feat.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Course Fee</p>
                      <p className="font-serif font-bold text-lg text-pink-600">
                        {course.price}
                      </p>
                    </div>
                    <button
                      onClick={() => enroll(course.title)}
                      className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-pink-100 text-gray-500 text-sm">
            No training courses found. Add them in the admin panel!
          </div>
        )}
      </section>

      {/* Why Train Here */}
      <section className="bg-gradient-to-br from-pink-50 to-pink-100/30 py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900">
              Why Train With Us?
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto font-sans">
              We focus on building actual technical mastery combined with real field work so you graduate with high confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Award, title: 'Expert Trainers', desc: 'Learn directly from certified professionals.' },
              { icon: ShieldCheck, title: 'Certified Academy', desc: 'Receive standard certificates on completion.' },
              { icon: GraduationCap, title: 'Practical Work', desc: '80% practical exercises on real clients.' },
              { icon: Package, title: 'Starter Kit', desc: 'Sourcing kits included with selected programs.' },
              { icon: Briefcase, title: 'Career Support', desc: 'Assistance for job placements and business setup.' },
            ].map((box, idx) => {
              const Icon = box.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl shadow-xs border border-pink-100/50 text-center space-y-3 hover:-translate-y-1 transition-transform"
                >
                  <div className="bg-pink-100 text-pink-600 p-2.5 rounded-full inline-block">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-pink-900 leading-tight">
                    {box.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    {box.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academy FAQs */}
      {academyFaqs.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 space-y-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 border-b-3 border-pink-300 pb-2 inline-block">
            Frequently Asked Questions
          </h3>

          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm divide-y divide-pink-100 overflow-hidden">
            {academyFaqs.map((faq, idx) => {
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
    </div>
  );
}
