import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Globe, Link2, Eye, ShieldAlert, Award } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useCMS } from '../../lib/cms';

interface PageEditorsProps {
  section: string;
  triggerNotification: (type: 'success' | 'error', title: string, message: string) => void;
}

export default function PageEditors({ section, triggerNotification }: PageEditorsProps) {
  const cms = useCMS();
  const [submitting, setSubmitting] = useState(false);

  // Dynamic States
  const [formData, setFormData] = useState<any>({});

  // Sync state with incoming CMS state depending on selected section
  useEffect(() => {
    if (section === 'home') {
      setFormData(cms.homeSettings || {});
    } else if (section === 'founder') {
      setFormData(cms.founderSettings || {});
    } else if (section === 'contact') {
      setFormData(cms.contactSettings || {});
    } else if (section === 'seo') {
      setFormData(cms.seoSettings || {});
    } else if (section === 'footer') {
      setFormData(cms.footerSettings || {});
    } else if (section === 'website_settings') {
      setFormData(cms.websiteSettings || {});
    } else if (section === 'announcements') {
      setFormData(cms.popupAnnouncement || {});
    } else if (section === 'booking_settings') {
      setFormData(cms.bookingSettings || {});
    }
  }, [section, cms]);

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (section === 'home') {
        await setDoc(doc(db, 'website_settings', 'home'), formData);
      } else if (section === 'founder') {
        await setDoc(doc(db, 'website_settings', 'founder'), formData);
      } else if (section === 'contact') {
        await setDoc(doc(db, 'website_settings', 'contact'), formData);
      } else if (section === 'seo') {
        await setDoc(doc(db, 'website_settings', 'seo'), formData);
      } else if (section === 'footer') {
        await setDoc(doc(db, 'website_settings', 'footer'), formData);
      } else if (section === 'website_settings') {
        await setDoc(doc(db, 'website_settings', 'website'), formData);
      } else if (section === 'announcements') {
        await setDoc(doc(db, 'popup_announcements', 'config'), formData);
      } else if (section === 'booking_settings') {
        await setDoc(doc(db, 'website_settings', 'booking_settings'), formData);
      }
      triggerNotification('success', 'Changes Saved', 'Settings updated on Firestore successfully. Updates reflect instantly.');
    } catch (err: any) {
      triggerNotification('error', 'Failed to Save', err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const renderHomeEditor = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Hero Title *</label>
          <input type="text" required value={formData.heroTitle || ''} onChange={e => handleFieldChange('heroTitle', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Hero Subtitle</label>
          <input type="text" value={formData.heroSubtitle || ''} onChange={e => handleFieldChange('heroSubtitle', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Hero Description</label>
          <input type="text" value={formData.heroDescription || ''} onChange={e => handleFieldChange('heroDescription', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Hero Button Text</label>
          <input type="text" value={formData.heroButtonText || ''} onChange={e => handleFieldChange('heroButtonText', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Marquee / Announcement Text</label>
          <input type="text" value={formData.marqueeText || ''} onChange={e => handleFieldChange('marqueeText', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Discount Banner / Special Offers Alert</label>
          <input type="text" placeholder="e.g. 10% Discount on Bridal Packages during Wedding Seasons!" value={formData.discountBanner || ''} onChange={e => handleFieldChange('discountBanner', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Publishing Updates...' : 'Publish Home Settings'}
      </button>
    </form>
  );

  const renderFounderEditor = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Founder Full Name *</label>
          <input type="text" required value={formData.name || ''} onChange={e => handleFieldChange('name', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Professional Designation</label>
          <input type="text" value={formData.designation || ''} onChange={e => handleFieldChange('designation', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Biography Note *</label>
          <textarea rows={4} required value={formData.biography || ''} onChange={e => handleFieldChange('biography', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Founder Photo URL (Imgur / Public URL)</label>
          <input type="url" value={formData.photoUrl || ''} onChange={e => handleFieldChange('photoUrl', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
          {formData.photoUrl && (
            <div className="mt-2 text-center bg-zinc-50 border p-2 rounded-xl h-28 overflow-hidden inline-block">
              <img src={formData.photoUrl} alt="Founder Preview" className="h-full object-contain mx-auto" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Special Skills (comma-separated)</label>
          <input type="text" placeholder="Bridal makeup, Skincare consulting" value={formData.skills || ''} onChange={e => handleFieldChange('skills', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Instagram Link</label>
          <input type="url" value={formData.instagram || ''} onChange={e => handleFieldChange('instagram', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Updating profile...' : 'Save Founder Details'}
      </button>
    </form>
  );

  const renderContactEditor = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Business Location *</label>
          <input type="text" required value={formData.address || ''} onChange={e => handleFieldChange('address', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Contact Phone Number *</label>
          <input type="tel" required value={formData.phone || ''} onChange={e => handleFieldChange('phone', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Email Address</label>
          <input type="email" value={formData.email || ''} onChange={e => handleFieldChange('email', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Business Opening Hours</label>
          <input type="text" placeholder="8 AM - 7 PM" value={formData.businessHours || ''} onChange={e => handleFieldChange('businessHours', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Google Maps Embed Link (or Place Search Name)</label>
          <input 
            type="text" 
            placeholder="e.g. Susbee Beauty Studio Taalchowk, or paste the <iframe...> code from Google Maps" 
            value={formData.googleMapLink || ''} 
            onChange={e => handleFieldChange('googleMapLink', e.target.value)} 
            className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden font-sans text-sm" 
          />
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            💡 <strong>Pro Tip:</strong> You can simply type your business name (e.g. <code>Susbee Beauty Studio Taalchowk</code>), paste a standard Google Maps URL, or paste the entire HTML <code>&lt;iframe...&gt;</code> code from Google Maps (Share → Embed a map). The website will automatically sanitize, parse, and render it perfectly!
          </p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Facebook Handle URL</label>
          <input type="url" value={formData.facebook || ''} onChange={e => handleFieldChange('facebook', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Instagram Handle URL</label>
          <input type="url" value={formData.instagram || ''} onChange={e => handleFieldChange('instagram', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">TikTok Handle URL</label>
          <input type="url" value={formData.tiktok || ''} onChange={e => handleFieldChange('tiktok', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Saving Contacts...' : 'Save Contact Details'}
      </button>
    </form>
  );

  const renderPopupEditor = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-between">
        <div>
          <h4 className="font-serif font-black text-pink-900 leading-tight">Enable Pop-up announcement</h4>
          <p className="text-[10px] text-gray-500">Enable this to show a modal with discount info when customers visit.</p>
        </div>
        <input 
          type="checkbox" 
          checked={formData.enabled || false} 
          onChange={e => handleFieldChange('enabled', e.target.checked)} 
          className="w-5 h-5 accent-pink-600 cursor-pointer" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Modal Alert Title *</label>
          <input type="text" required value={formData.title || ''} onChange={e => handleFieldChange('title', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Alert Description</label>
          <textarea rows={3} value={formData.description || ''} onChange={e => handleFieldChange('description', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Featured Banner URL (Imgur / Public URL)</label>
          <input type="url" value={formData.imageUrl || ''} onChange={e => handleFieldChange('imageUrl', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
          {formData.imageUrl && (
            <div className="mt-2 text-center bg-zinc-50 border p-2 rounded-xl h-28 overflow-hidden inline-block">
              <img src={formData.imageUrl} alt="Alert Preview" className="h-full object-contain mx-auto" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Call-To-Action Button Text</label>
          <input type="text" placeholder="e.g. Book Trial Now" value={formData.buttonText || ''} onChange={e => handleFieldChange('buttonText', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Call-To-Action Button Link</label>
          <input type="text" placeholder="e.g. #/my-bookings" value={formData.buttonLink || ''} onChange={e => handleFieldChange('buttonLink', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={formData.showOnce || false} onChange={e => handleFieldChange('showOnce', e.target.checked)} className="w-4 h-4 accent-pink-600 cursor-pointer" />
          <label className="text-xs font-bold text-pink-950">Show only once per browser session (recommended)</label>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Saving settings...' : 'Publish Pop-up Announcement'}
      </button>
    </form>
  );

  const renderSEOEditor = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Website Title *</label>
          <input type="text" required value={formData.pageTitle || ''} onChange={e => handleFieldChange('pageTitle', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Meta Keywords</label>
          <input type="text" placeholder="bridal makeup lekhnath, susbee beauty parlour taalchowk" value={formData.metaKeywords || ''} onChange={e => handleFieldChange('metaKeywords', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Meta Description *</label>
          <textarea rows={3} required value={formData.metaDescription || ''} onChange={e => handleFieldChange('metaDescription', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Updating SEO...' : 'Save SEO Headers'}
      </button>
    </form>
  );

  const renderFooterEditor = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Footer Brief Description *</label>
          <textarea rows={3} required value={formData.description || ''} onChange={e => handleFieldChange('description', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Copyright Signature Text *</label>
          <input type="text" required value={formData.copyright || ''} onChange={e => handleFieldChange('copyright', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Saving footer...' : 'Save Footer Settings'}
      </button>
    </form>
  );

  const renderWebsiteSettings = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Website Display Name *</label>
          <input type="text" required value={formData.websiteName || ''} onChange={e => handleFieldChange('websiteName', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Default Business Hours</label>
          <input type="text" value={formData.businessHours || ''} onChange={e => handleFieldChange('businessHours', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Logo Public URL</label>
          <input type="url" value={formData.logoUrl || ''} onChange={e => handleFieldChange('logoUrl', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Favicon Public URL</label>
          <input type="url" value={formData.faviconUrl || ''} onChange={e => handleFieldChange('faviconUrl', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Updating settings...' : 'Save Website Config'}
      </button>
    </form>
  );

  const renderBookingSettings = () => (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-between">
        <div>
          <h4 className="font-serif font-black text-pink-900 leading-tight">Accept Online Appointments</h4>
          <p className="text-[10px] text-gray-500">Allow customers to request booking dates from the scheduling page.</p>
        </div>
        <input 
          type="checkbox" 
          checked={formData.acceptingBookings || false} 
          onChange={e => handleFieldChange('acceptingBookings', e.target.checked)} 
          className="w-5 h-5 accent-pink-600 cursor-pointer" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Daily Capacity Limit (Slots per Hour)</label>
          <input type="number" value={formData.dailyLimit || 3} onChange={e => handleFieldChange('dailyLimit', Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden font-sans" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Closed Days (e.g. Saturdays)</label>
          <input type="text" placeholder="e.g. None" value={formData.closedDays || ''} onChange={e => handleFieldChange('closedDays', e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden font-sans" />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
        {submitting ? 'Saving settings...' : 'Save Booking Configuration'}
      </button>
    </form>
  );

  const getHeader = () => {
    switch (section) {
      case 'home': return 'Home Page Content Editor';
      case 'founder': return 'Founder Bio & Social Links';
      case 'contact': return 'Contact Details & Interactive Map';
      case 'announcements': return 'Header Popup Announcement';
      case 'seo': return 'SEO Titles & Meta Settings';
      case 'footer': return 'Footer Layout & Copyrights';
      case 'website_settings': return 'Website Config & Brand Elements';
      case 'booking_settings': return 'Appoint Scheduling Slot Controls';
      default: return 'Page Settings';
    }
  };

  return (
    <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xs animate-fade-in text-zinc-800 font-semibold">
      <h3 className="font-serif text-xl font-black text-pink-950 border-b border-pink-50 pb-2 mb-6">
        {getHeader()}
      </h3>

      {section === 'home' && renderHomeEditor()}
      {section === 'founder' && renderFounderEditor()}
      {section === 'contact' && renderContactEditor()}
      {section === 'announcements' && renderPopupEditor()}
      {section === 'seo' && renderSEOEditor()}
      {section === 'footer' && renderFooterEditor()}
      {section === 'website_settings' && renderWebsiteSettings()}
      {section === 'booking_settings' && renderBookingSettings()}
    </div>
  );
}
