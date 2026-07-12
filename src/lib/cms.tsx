import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { 
  teamMembers, 
  courses as defaultCourses, 
  reviews as defaultReviews, 
  transformations as defaultTransformations, 
  blogPosts as defaultBlogs, 
  hairCareFaqs as defaultFaqs,
  quickTips
} from '../data';

// CMS Types
export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  displayOrder: number;
  hidden: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  category: string;
  caption: string;
  sortOrder: number;
  featured: boolean;
  hidden: boolean;
}

export interface TrainingCourse {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  imageUrl: string;
  hasCertificate: boolean;
  curriculum: string; // Comma separated or multi-line
  featured: boolean;
  hidden: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  description: string;
  skills: string; // comma-separated
  imageUrl: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTikTok: string;
  socialWhatsApp: string;
  sortOrder: number;
  hidden: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  photoUrl: string;
  rating: number;
  review: string;
  date: string;
  hidden: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  featuredImageUrl: string;
  category: string;
  content: string;
  tags: string; // comma-separated
  seoDescription: string;
  publishDate: string;
  hidden: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  hidden: boolean;
}

export interface BeforeAfter {
  id: string;
  beforeImg: string;
  afterImg: string;
  title: string;
  description: string;
  tags: string; // comma-separated
  category: string;
  sortOrder: number;
  hidden: boolean;
}

export interface SpecialOffer {
  id: string;
  offerImage: string;
  offerTitle: string;
  offerDescription: string;
  expiryDate: string;
  buttonText: string;
  buttonLink: string;
  hidden: boolean;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  hidden: boolean;
}

export interface PopupAnnouncement {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  enabled: boolean;
  showOnce: boolean;
}

export interface ReviewItem {
  id: string;
  stars: number;
  text: string;
  author: string;
  location: string;
  hidden: boolean;
}

// Subsections inside website_settings
export interface HomeSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroBackground: string;
  heroImage: string;
  scrollingAnnouncement: string;
  openingTime: string;
  location: string;
  whatsAppNumber: string;
  phoneNumber: string;
  email: string;
  discountBanner: string;
  specialOffer: string;
  marqueeText: string;
}

export interface FounderSettings {
  name: string;
  photoUrl: string;
  designation: string;
  biography: string;
  experience: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  skills: string; // comma-separated
  certificates: string; // comma-separated
  achievements: string; // comma-separated
}

export interface ContactSettings {
  address: string;
  phone: string;
  email: string;
  googleMapLink: string;
  whatsApp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  businessHours: string;
}

export interface FooterSettings {
  logoUrl: string;
  description: string;
  quickLinks: string; // Json or comma list
  socialLinks: string;
  copyright: string;
}

export interface WebsiteSettings {
  websiteName: string;
  logoUrl: string;
  faviconUrl: string;
  themeColor: string;
  businessName: string;
  businessHours: string;
  currency: string;
  defaultLanguage: string;
}

export interface SEOSettings {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl: string;
  canonicalUrl: string;
}

export interface BookingSettings {
  availableServices: string; // comma list
  availableDates: string; // JSON or list
  workingHours: string; // JSON or list
  closedDays: string; // comma list
  bookingStatus: string;
}

// Static Fallback values
export const initialHomeSettings: HomeSettings = {
  heroTitle: "Welcome to Susbee Beauty Studio",
  heroSubtitle: "✨ Established in 2026 in Lekhnath, Taalchowk ✨",
  heroDescription: "Your premium destination for exquisite bridal makeup, contemporary hair styling, relaxing skincare therapies, and professional, certified beauty training.",
  heroButtonText: "Book Appointment Now 💄",
  heroButtonLink: "#/my-bookings",
  heroBackground: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1920",
  heroImage: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/main%20price.png",
  scrollingAnnouncement: "🎉 Special Monsoon Discount! Flat 20% Off on Bridal Makeup Packages & Skin Facial Services. Call/WhatsApp 9856103666 for bookings!",
  openingTime: "8 AM – 7 PM",
  location: "Lekhnath, Taalchowk, Nepal",
  whatsAppNumber: "+9779856103666",
  phoneNumber: "9856103666",
  email: "susbeebeautystudio@gmail.com",
  discountBanner: "🎉 Special Offer: Flat 20% off on all training courses registered this week!",
  specialOffer: "Bridal Package include FREE premium facial + free gel nails artwork!",
  marqueeText: "✨ BRIDAL SPECIALIST • SKINCARE THERAPY • CERTIFIED BEAUTY COURSES • HAIR COLOR & STYLE • NAIL ART ACADEMY ✨"
};

export const initialFounderSettings: FounderSettings = {
  name: "Sagar Chokhal",
  photoUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg",
  designation: "Lead Makeup Artist & Managing Director",
  biography: "Founder & Director Sagar Chokhal launched Susbee Beauty Studio with a dream to bring world-class beauty services and professional academy-level certified courses to the Lekhnath and Pokhara regions. With multiple international training certifications and years of experience, he has transformed hundreds of brides and coached dozens of successful styling practitioners.",
  experience: "8+ Years Experience",
  instagram: "https://www.instagram.com/susbeebeautyparlour.1234",
  facebook: "https://www.facebook.com",
  tiktok: "https://www.tiktok.com/@susbeebeautystudio",
  whatsapp: "https://wa.me/9779856103666",
  skills: "Bridal Makeup, Skincare Analytics, Modern Hair Updos, Microblading, Certified Educator",
  certificates: "International Makeup Artist Diploma, Advanced Hair Dressing Masterclass",
  achievements: "Trained 100+ graduates in Nepal, Best Bridal Studio in Lekhnath 2026"
};

export const initialContactSettings: ContactSettings = {
  address: "Lekhnath, Taalchowk, Pokhara, Nepal",
  phone: "9856103666",
  email: "susbeebeautystudio@gmail.com",
  googleMapLink: "https://maps.google.com",
  whatsApp: "https://wa.me/9779856103666",
  facebook: "https://www.facebook.com",
  instagram: "https://www.instagram.com/susbeebeautyparlour.1234",
  tiktok: "https://www.tiktok.com/@susbeebeautystudio",
  businessHours: "Everyday: 8 AM – 7 PM"
};

export const initialFooterSettings: FooterSettings = {
  logoUrl: "https://i.imgur.com/pGyeP37.png",
  description: "Susbee Beauty Studio and Training Center is a premier styling salon and accredited beauty academy in Lekhnath, Nepal. Empowering beauty and confidence.",
  quickLinks: "Home, Services, Gallery, Training, About, Blog, Booking",
  socialLinks: "Facebook, Instagram, TikTok, WhatsApp",
  copyright: "© 2026 Susbee Beauty Studio and Training Center. All rights reserved."
};

export const initialWebsiteSettings: WebsiteSettings = {
  websiteName: "Susbee Beauty Studio and Training Center",
  logoUrl: "https://i.imgur.com/pGyeP37.png",
  faviconUrl: "",
  themeColor: "#ec4899",
  businessName: "Susbee Beauty Studio",
  businessHours: "8:00 AM - 7:00 PM",
  currency: "Rs.",
  defaultLanguage: "English / Nepali"
};

export const initialSEOSettings: SEOSettings = {
  pageTitle: "Susbee Beauty Studio and Training Center | Lekhnath, Pokhara",
  metaDescription: "Official website for Susbee Beauty Studio and Training Center in Lekhnath, Taalchowk. Explore professional bridal makeup, beauty services, transformations, and certified training courses.",
  keywords: "beauty parlor lekhnath, makeup academy pokhara, bridal makeup nepal, susbee beauty studio, hair style parlor, skin treatment, nail art",
  ogImageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb3.png",
  canonicalUrl: "https://susbeebeautystudio.com"
};

export const initialBookingSettings: BookingSettings = {
  availableServices: "Facial Treatment, Deep Cleansing, Bridal Makeup, Waxing Services, Manicure Session, Pedicure Session, Hair Coloring / Tint, Hair Cutting & Styling, Nail Extensions / Gel, Eyelash Extensions, Professional Training Course",
  availableDates: "All upcoming calendar days except closed days",
  workingHours: "10:00 AM, 11:00 AM, 12:00 PM, 01:00 PM, 02:00 PM, 03:00 PM, 04:00 PM, 05:00 PM",
  closedDays: "Major public festivals",
  bookingStatus: "Active & Accepting Bookings"
};

export const initialPopupAnnouncement: PopupAnnouncement = {
  imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb3.png",
  title: "🌸 Welcome to Susbee Beauty Academy!",
  description: "New batch for professional Makeup & Hair Designing starts next week. Limited seats remaining! Sign up today and get Rs. 5,000 early bird discount.",
  buttonText: "Enroll Now 📚",
  buttonLink: "#/training",
  enabled: true,
  showOnce: false
};

// Core context structure
interface CMSContextProps {
  services: Service[];
  gallery: GalleryImage[];
  courses: TrainingCourse[];
  team: TeamMember[];
  testimonials: Testimonial[];
  blogs: Blog[];
  faqs: FAQ[];
  beforeAfter: BeforeAfter[];
  offers: SpecialOffer[];
  heroSlides: HeroSlide[];
  popupAnnouncement: PopupAnnouncement;
  reviews: ReviewItem[];
  
  // Website subsettings
  homeSettings: HomeSettings;
  founderSettings: FounderSettings;
  contactSettings: ContactSettings;
  footerSettings: FooterSettings;
  websiteSettings: WebsiteSettings;
  seoSettings: SEOSettings;
  bookingSettings: BookingSettings;
  
  loading: boolean;
}

const CMSContext = createContext<CMSContextProps | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  // Lists
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfter[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [popupAnnouncement, setPopupAnnouncement] = useState<PopupAnnouncement>(initialPopupAnnouncement);

  // Singletons inside website_settings
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(initialHomeSettings);
  const [founderSettings, setFounderSettings] = useState<FounderSettings>(initialFounderSettings);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(initialContactSettings);
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(initialFooterSettings);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [seoSettings, setSEOSettings] = useState<SEOSettings>(initialSEOSettings);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(initialBookingSettings);

  useEffect(() => {
    // 1. Subscribe to services
    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const items: Service[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Service);
      });
      // Fallback
      if (items.length === 0) {
        setServices([
          { id: '1', name: "Facial Treatment", category: "Skincare", price: 1500, duration: "45 mins", description: "Rejuvenating skin massage & cleanse", imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/price1.png", featured: true, displayOrder: 1, hidden: false },
          { id: '2', name: "Deep Cleansing", category: "Skincare", price: 1000, duration: "30 mins", description: "Thorough pores cleaning and mask", imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/price1.png", featured: false, displayOrder: 2, hidden: false },
          { id: '3', name: "Bridal Makeup", category: "Makeup", price: 15000, duration: "3 hours", description: "Elegant long lasting wedding makeover", imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/main%20price.png", featured: true, displayOrder: 3, hidden: false },
          { id: '4', name: "Waxing Services", category: "Salon Services", price: 800, duration: "45 mins", description: "Smooth full hand or leg waxing", imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/price1.png", featured: false, displayOrder: 4, hidden: false },
          { id: '5', name: "Nail Extensions / Gel", category: "Nails", price: 2500, duration: "90 mins", description: "Beautiful custom extension nail art", imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/Price3.png", featured: true, displayOrder: 5, hidden: false }
        ]);
      } else {
        setServices(items.sort((a, b) => a.displayOrder - b.displayOrder));
      }
    }, (error) => {
      console.warn("services collection subscription failed:", error);
    });

    // 2. Subscribe to gallery
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const items: GalleryImage[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      if (items.length === 0) {
        setGallery([
          { id: 'g1', imageUrl: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb3.png', category: 'Bridal', caption: 'Beautiful Bride Look', sortOrder: 1, featured: true, hidden: false },
          { id: 'g2', imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702', category: 'Makeup', caption: 'Makeup Artistry', sortOrder: 2, featured: false, hidden: false },
          { id: 'g3', imageUrl: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bride.jpeg', category: 'Bridal', caption: 'Traditional Bride Draping', sortOrder: 3, featured: true, hidden: false },
          { id: 'g4', imageUrl: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg', category: 'Festival', caption: 'Flawless Festival Glow', sortOrder: 4, featured: false, hidden: false },
          { id: 'g5', imageUrl: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb2.png', category: 'Bridal', caption: 'Bridal Portrait', sortOrder: 5, featured: false, hidden: false },
          { id: 'g6', imageUrl: 'https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb.png', category: 'Bridal', caption: 'Modern Bride Styling', sortOrder: 6, featured: true, hidden: false }
        ]);
      } else {
        setGallery(items.sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }, (error) => {
      console.warn("gallery subscription failed:", error);
    });

    // 3. Subscribe to training courses
    const unsubCourses = onSnapshot(collection(db, 'training_courses'), (snapshot) => {
      const items: TrainingCourse[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as TrainingCourse);
      });
      if (items.length === 0) {
        const parsed = defaultCourses.map((c, i) => ({
          id: c.id,
          title: c.title,
          duration: c.duration,
          price: c.price,
          description: `Certified Training - timing is ${c.timing}. Class Level: ${c.level}. Includes premium styling techniques.`,
          imageUrl: i % 2 === 0 ? "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb2.png" : "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg",
          hasCertificate: c.hasCertificate,
          curriculum: c.features.join('\n'),
          featured: i < 3,
          hidden: false
        }));
        setCourses(parsed);
      } else {
        setCourses(items);
      }
    }, (error) => {
      console.warn("training_courses subscription failed:", error);
    });

    // 4. Subscribe to team members
    const unsubTeam = onSnapshot(collection(db, 'team'), (snapshot) => {
      const items: TeamMember[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as TeamMember);
      });
      if (items.length === 0) {
        const parsed = teamMembers.map((m, i) => ({
          id: `t${i}`,
          name: m.name === 'xyz' ? (i === 0 ? "Sagar Chokhal" : "Sita Thapa") : m.name,
          role: m.role,
          experience: m.experience,
          description: m.description,
          skills: m.skills.join(', '),
          imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg",
          socialInstagram: "https://www.instagram.com/susbeebeautyparlour.1234",
          socialFacebook: "https://www.facebook.com",
          socialTikTok: "https://www.tiktok.com/@susbeebeautystudio",
          socialWhatsApp: "https://wa.me/9779856103666",
          sortOrder: i,
          hidden: false
        }));
        setTeam(parsed);
      } else {
        setTeam(items.sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }, (error) => {
      console.warn("team subscription failed:", error);
    });

    // 5. Subscribe to testimonials
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const items: Testimonial[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      if (items.length === 0) {
        setTestimonials([
          { id: 'test1', customerName: "Priya S.", photoUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg", rating: 5, review: "Amazing bridal makeup and friendly service. Highly recommended!", date: "2026-06-15", hidden: false },
          { id: 'test2', customerName: "Anita M.", photoUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg", rating: 5, review: "Best beauty studio in Lekhnath. Always satisfied with results.", date: "2026-06-20", hidden: false },
          { id: 'test3', customerName: "Suman R.", photoUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/aisha.jpg", rating: 5, review: "Professional beauty training and great environment. Worth every penny.", date: "2026-06-28", hidden: false }
        ]);
      } else {
        setTestimonials(items);
      }
    }, (error) => {
      console.warn("testimonials subscription failed:", error);
    });

    // 6. Subscribe to blogs
    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const items: Blog[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Blog);
      });
      if (items.length === 0) {
        const parsed = defaultBlogs.map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.id,
          featuredImageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb3.png",
          category: b.cat,
          content: b.body,
          tags: b.cat,
          seoDescription: b.excerpt,
          publishDate: b.date,
          hidden: false
        }));
        setBlogs(parsed);
      } else {
        setBlogs(items);
      }
    }, (error) => {
      console.warn("blogs subscription failed:", error);
    });

    // 7. Subscribe to faqs
    const unsubFaqs = onSnapshot(collection(db, 'faqs'), (snapshot) => {
      const items: FAQ[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as FAQ);
      });
      if (items.length === 0) {
        const parsed = defaultFaqs.map((f, i) => ({
          id: `faq${i}`,
          question: f.q,
          answer: f.a,
          sortOrder: i,
          hidden: false
        }));
        setFaqs(parsed);
      } else {
        setFaqs(items.sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }, (error) => {
      console.warn("faqs subscription failed:", error);
    });

    // 8. Subscribe to before_after transformations
    const unsubBeforeAfter = onSnapshot(collection(db, 'before_after'), (snapshot) => {
      const items: BeforeAfter[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as BeforeAfter);
      });
      if (items.length === 0) {
        const parsed = defaultTransformations.map((t, i) => ({
          id: t.id,
          beforeImg: t.beforeImg,
          afterImg: t.afterImg,
          title: t.title,
          description: t.description,
          tags: t.tags.join(', '),
          category: t.tags[0] || 'Bridal',
          sortOrder: i,
          hidden: false
        }));
        setBeforeAfter(parsed);
      } else {
        setBeforeAfter(items.sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }, (error) => {
      console.warn("before_after subscription failed:", error);
    });

    // 9. Subscribe to special offers
    const unsubOffers = onSnapshot(collection(db, 'special_offers'), (snapshot) => {
      const items: SpecialOffer[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as SpecialOffer);
      });
      if (items.length === 0) {
        setOffers([
          { id: 'off1', offerImage: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb.png", offerTitle: "Monsoon Bridal Special", offerDescription: "Get a premium skin glow facial complimentary with full bridal makeup styling package. Flat 20% discount on pre-booking this week.", expiryDate: "2026-07-31", buttonText: "Pre-book Bridal Pack", buttonLink: "#/my-bookings", hidden: false }
        ]);
      } else {
        setOffers(items);
      }
    }, (error) => {
      console.warn("special_offers subscription failed:", error);
    });

    // 10. Subscribe to hero slides
    const unsubSlides = onSnapshot(collection(db, 'hero_slides'), (snapshot) => {
      const items: HeroSlide[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as HeroSlide);
      });
      if (items.length === 0) {
        setHeroSlides([
          { id: 's1', imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1920", title: "Flawless Bridal Makeovers", subtitle: "Lekhnath's highly recommended cosmetics & beauty lounge", buttonText: "Book Wedding Stylist 💄", buttonLink: "#/my-bookings", displayOrder: 1, hidden: false },
          { id: 's2', imageUrl: "https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/bb3.png", title: "Accredited Training Academy", subtitle: "Turn your passion into a certified beauty career", buttonText: "Explore Courses 📚", buttonLink: "#/training", displayOrder: 2, hidden: false }
        ]);
      } else {
        setHeroSlides(items.sort((a, b) => a.displayOrder - b.displayOrder));
      }
    }, (error) => {
      console.warn("hero_slides subscription failed:", error);
    });

    // 11. Subscribe to popup announcement setting
    const unsubPopup = onSnapshot(doc(db, 'popup_announcements', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setPopupAnnouncement(docSnap.data() as PopupAnnouncement);
      } else {
        setPopupAnnouncement(initialPopupAnnouncement);
      }
    }, (error) => {
      console.warn("popup_announcements subscription failed:", error);
    });

    // 12. Subscribe to reviews (which users can post and admin manages)
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const items: ReviewItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ReviewItem);
      });
      if (items.length === 0) {
        const parsed = defaultReviews.map((r, i) => ({
          id: `rev${i}`,
          stars: r.stars,
          text: r.text,
          author: r.author,
          location: r.location,
          hidden: false
        }));
        setReviews(parsed);
      } else {
        setReviews(items);
      }
    }, (error) => {
      console.warn("reviews subscription failed:", error);
    });

    // 13. Subscribe to website_settings singletons
    const unsubHome = onSnapshot(doc(db, 'website_settings', 'home'), (docSnap) => {
      if (docSnap.exists()) {
        setHomeSettings(docSnap.data() as HomeSettings);
      } else {
        setHomeSettings(initialHomeSettings);
      }
    }, (error) => {
      console.warn("home settings subscription failed:", error);
    });

    const unsubFounder = onSnapshot(doc(db, 'website_settings', 'founder'), (docSnap) => {
      if (docSnap.exists()) {
        setFounderSettings(docSnap.data() as FounderSettings);
      } else {
        setFounderSettings(initialFounderSettings);
      }
    }, (error) => {
      console.warn("founder settings subscription failed:", error);
    });

    const unsubContact = onSnapshot(doc(db, 'website_settings', 'contact'), (docSnap) => {
      if (docSnap.exists()) {
        setContactSettings(docSnap.data() as ContactSettings);
      } else {
        setContactSettings(initialContactSettings);
      }
    }, (error) => {
      console.warn("contact settings subscription failed:", error);
    });

    const unsubFooter = onSnapshot(doc(db, 'website_settings', 'footer'), (docSnap) => {
      if (docSnap.exists()) {
        setFooterSettings(docSnap.data() as FooterSettings);
      } else {
        setFooterSettings(initialFooterSettings);
      }
    }, (error) => {
      console.warn("footer settings subscription failed:", error);
    });

    const unsubWeb = onSnapshot(doc(db, 'website_settings', 'website'), (docSnap) => {
      if (docSnap.exists()) {
        setWebsiteSettings(docSnap.data() as WebsiteSettings);
      } else {
        setWebsiteSettings(initialWebsiteSettings);
      }
    }, (error) => {
      console.warn("website settings subscription failed:", error);
    });

    const unsubSEO = onSnapshot(doc(db, 'website_settings', 'seo'), (docSnap) => {
      if (docSnap.exists()) {
        setSEOSettings(docSnap.data() as SEOSettings);
      } else {
        setSEOSettings(initialSEOSettings);
      }
    }, (error) => {
      console.warn("seo settings subscription failed:", error);
    });

    const unsubBookingSet = onSnapshot(doc(db, 'website_settings', 'booking_settings'), (docSnap) => {
      if (docSnap.exists()) {
        setBookingSettings(docSnap.data() as BookingSettings);
      } else {
        setBookingSettings(initialBookingSettings);
      }
    }, (error) => {
      console.warn("booking settings subscription failed:", error);
    });

    // Unsubscribe all on unmount
    return () => {
      unsubServices();
      unsubGallery();
      unsubCourses();
      unsubTeam();
      unsubTestimonials();
      unsubBlogs();
      unsubFaqs();
      unsubBeforeAfter();
      unsubOffers();
      unsubSlides();
      unsubPopup();
      unsubReviews();
      unsubHome();
      unsubFounder();
      unsubContact();
      unsubFooter();
      unsubWeb();
      unsubSEO();
      unsubBookingSet();
    };
  }, []);

  // Set loading to false once initial hooks fire
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CMSContext.Provider value={{
      services,
      gallery,
      courses,
      team,
      testimonials,
      blogs,
      faqs,
      beforeAfter,
      offers,
      heroSlides,
      popupAnnouncement,
      reviews,
      homeSettings,
      founderSettings,
      contactSettings,
      footerSettings,
      websiteSettings,
      seoSettings,
      bookingSettings,
      loading
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
