import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useCMS } from '../../lib/cms';
import { Plus, Edit, Trash2, Eye, EyeOff, Copy, ArrowUp, ArrowDown, Sparkles, Image as ImageIcon, Check, X, AlertTriangle } from 'lucide-react';

interface ListEditorsProps {
  section: string;
  triggerNotification: (type: 'success' | 'error', title: string, message: string) => void;
}

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url' | 'checkbox' | 'select';
  required?: boolean;
  options?: string[];
}

const SCHEMAS: Record<string, {
  label: string;
  collectionName: string;
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  fields: FieldDef[];
}> = {
  services: {
    label: "Menu Catalog Registry",
    collectionName: "services",
    titleKey: "name",
    imageKey: "imageUrl",
    fields: [
      { key: "name", label: "Menu Sheet / Category Name *", type: "text", required: true },
      { key: "imageUrl", label: "Menu Sheet Image URL *", type: "url", required: true }
    ]
  },
  gallery: {
    label: "Gallery Showcase",
    collectionName: "gallery",
    titleKey: "caption",
    subtitleKey: "category",
    imageKey: "imageUrl",
    fields: [
      { key: "imageUrl", label: "Image URL *", type: "url", required: true },
      { key: "caption", label: "Caption / Photo Description *", type: "text", required: true },
      { key: "category", label: "Category *", type: "select", required: true, options: ["Bridal", "Hair", "Nails", "Skincare", "Events", "General"] },
      { key: "featured", label: "Feature on Home Slide", type: "checkbox" }
    ]
  },
  courses: {
    label: "Training Courses Academy",
    collectionName: "courses",
    titleKey: "title",
    subtitleKey: "duration",
    imageKey: "imageUrl",
    fields: [
      { key: "title", label: "Course Program Name *", type: "text", required: true },
      { key: "price", label: "Fee / Price (e.g. Rs. 25,000) *", type: "text", required: true },
      { key: "duration", label: "Duration (e.g. 3 Months) *", type: "text", required: true },
      { key: "imageUrl", label: "Cover Image URL", type: "url" },
      { key: "hasCertificate", label: "Accredited Certificate Handout", type: "checkbox" },
      { key: "description", label: "Course Curriculum Syllabus Description", type: "textarea" },
      { key: "curriculum", label: "Course Curriculum Bullet points (Multi-line, one per line)", type: "textarea" },
      { key: "featured", label: "Feature on Training Board", type: "checkbox" }
    ]
  },
  team: {
    label: "Team Profiles",
    collectionName: "team",
    titleKey: "name",
    subtitleKey: "role",
    imageKey: "photoUrl",
    fields: [
      { key: "name", label: "Staff Name *", type: "text", required: true },
      { key: "role", label: "Role Title *", type: "text", required: true },
      { key: "photoUrl", label: "Photo URL", type: "url" },
      { key: "description", label: "Professional Background Bio", type: "textarea" },
      { key: "skills", label: "Area Expertise Skills", type: "text" }
    ]
  },
  before_after: {
    label: "Transformation Before & Afters",
    collectionName: "beforeAfter",
    titleKey: "title",
    imageKey: "beforeImg",
    fields: [
      { key: "beforeImg", label: "Before Photo URL *", type: "url", required: true },
      { key: "afterImg", label: "After Photo URL *", type: "url", required: true },
      { key: "title", label: "Transformation Title *", type: "text", required: true },
      { key: "description", label: "Short Description / Treatment Name", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Bridal", "Hair", "Nails", "Skincare", "General"] },
      { key: "tags", label: "Tags (comma-separated)", type: "text" }
    ]
  },
  testimonials: {
    label: "Client Testimonials",
    collectionName: "testimonials",
    titleKey: "customerName",
    subtitleKey: "rating",
    imageKey: "photoUrl",
    fields: [
      { key: "customerName", label: "Client Full Name *", type: "text", required: true },
      { key: "rating", label: "Rating Stars (1-5) *", type: "number", required: true },
      { key: "review", label: "Testimonial Statement *", type: "textarea", required: true },
      { key: "photoUrl", label: "Avatar/Photo URL", type: "url" },
      { key: "date", label: "Date (YYYY-MM-DD)", type: "text" }
    ]
  },
  reviews: {
    label: "Google & Salon Reviews",
    collectionName: "reviews",
    titleKey: "author",
    subtitleKey: "stars",
    fields: [
      { key: "author", label: "Author Name *", type: "text", required: true },
      { key: "stars", label: "Stars Rating (1-5) *", type: "number", required: true },
      { key: "text", label: "Comment Statement *", type: "textarea", required: true },
      { key: "location", label: "Location/Relative Time (e.g. Lekhnath)", type: "text" }
    ]
  },
  blog: {
    label: "Blog Content Management",
    collectionName: "blogs",
    titleKey: "title",
    subtitleKey: "category",
    imageKey: "featuredImageUrl",
    fields: [
      { key: "title", label: "Article Title *", type: "text", required: true },
      { key: "category", label: "Category *", type: "text", required: true },
      { key: "slug", label: "URL Slug (lowercase-with-hyphens) *", type: "text", required: true },
      { key: "featuredImageUrl", label: "Cover Photo URL", type: "url" },
      { key: "content", label: "Full Post Content (supports Markdown/HTML) *", type: "textarea", required: true },
      { key: "tags", label: "Tags (comma-separated)", type: "text" },
      { key: "seoDescription", label: "Search Engine Description", type: "text" },
      { key: "publishDate", label: "Publish Date (YYYY-MM-DD)", type: "text" }
    ]
  },
  faqs: {
    label: "Frequently Asked Questions",
    collectionName: "faqs",
    titleKey: "question",
    fields: [
      { key: "question", label: "Question Statement *", type: "text", required: true },
      { key: "answer", label: "Answer Explanation *", type: "textarea", required: true }
    ]
  },
  hero_slider: {
    label: "Hero Sliders",
    collectionName: "heroSlides",
    titleKey: "title",
    subtitleKey: "subtitle",
    imageKey: "imageUrl",
    fields: [
      { key: "title", label: "Slide Main Heading *", type: "text", required: true },
      { key: "subtitle", label: "Subheading / Tagline", type: "text" },
      { key: "imageUrl", label: "Background Photo URL *", type: "url", required: true },
      { key: "buttonText", label: "Action Button Text", type: "text" },
      { key: "buttonLink", label: "Action Button Link", type: "text" },
      { key: "displayOrder", label: "Display Order Rank (lower is first)", type: "number" }
    ]
  },
  offers: {
    label: "Special Promotion Deals",
    collectionName: "offers",
    titleKey: "offerTitle",
    subtitleKey: "expiryDate",
    imageKey: "offerImage",
    fields: [
      { key: "offerTitle", label: "Offer Promo Title *", type: "text", required: true },
      { key: "offerImage", label: "Offer Banner URL *", type: "url", required: true },
      { key: "offerDescription", label: "Details / Promo Code", type: "textarea" },
      { key: "expiryDate", label: "Expiry Date Description (e.g. Ends July 20)", type: "text" },
      { key: "buttonText", label: "Action Button Text", type: "text" },
      { key: "buttonLink", label: "Action Button Link", type: "text" }
    ]
  }
};

function getFirestoreCollectionName(sec: string): string {
  switch (sec) {
    case 'courses': return 'training_courses';
    case 'before_after': return 'before_after';
    case 'blog': return 'blogs';
    case 'hero_slider': return 'hero_slides';
    case 'offers': return 'special_offers';
    default: return sec;
  }
}

export default function ListEditors({ section, triggerNotification }: ListEditorsProps) {
  const cms = useCMS() as any;
  const schema = SCHEMAS[section];

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // Form Value State
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  if (!schema) {
    return <div className="p-4 text-center text-xs text-red-500">Selected configuration section does not exist.</div>;
  }

  // Get active items in current array
  const collectionNameInCms = schema.collectionName;
  const itemsList = (cms[collectionNameInCms] || []) as any[];

  const handleOpenCreate = () => {
    const initial: any = {};
    schema.fields.forEach(f => {
      if (f.type === 'checkbox') initial[f.key] = false;
      else if (f.type === 'select') initial[f.key] = f.options?.[0] || '';
      else if (f.type === 'number') initial[f.key] = 0;
      else initial[f.key] = '';
    });
    setFormData(initial);
    setEditingItem(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormData({ ...item });
    setEditingItem(item);
    setShowFormModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const id = editingItem ? editingItem.id : `ID-${Math.floor(100000 + Math.random() * 900000)}`;
      const order = editingItem ? (editingItem.order ?? 0) : itemsList.length;

      const payload = {
        id,
        ...formData,
        order,
        hidden: editingItem ? (editingItem.hidden ?? false) : false,
        createdAt: editingItem ? (editingItem.createdAt ?? new Date().toISOString()) : new Date().toISOString()
      };

      // Save to collectionName (singular map equivalent)
      const firestoreCollName = getFirestoreCollectionName(section);
      await setDoc(doc(db, firestoreCollName, id), payload);

      setShowFormModal(false);
      triggerNotification('success', editingItem ? 'Updated Item' : 'Created Item', 'Database records synchronized successfully.');
    } catch (err: any) {
      triggerNotification('error', 'Execution Error', err.message || 'Firestore connection failure');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      const firestoreCollName = getFirestoreCollectionName(section);
      await deleteDoc(doc(db, firestoreCollName, itemToDelete.id));
      setItemToDelete(null);
      triggerNotification('success', 'Asset Purged', 'Item permanently removed from catalog database.');
    } catch (err: any) {
      triggerNotification('error', 'Purge Failed', err.message);
    }
  };

  const handleToggleHide = async (item: any) => {
    try {
      const firestoreCollName = getFirestoreCollectionName(section);
      await setDoc(doc(db, firestoreCollName, item.id), {
        ...item,
        hidden: !item.hidden
      });
      triggerNotification('success', 'Status Swapped', item.hidden ? 'Item visible now.' : 'Item hidden from public views.');
    } catch (err: any) {
      triggerNotification('error', 'Firestore Sync Error', err.message);
    }
  };

  const handleDuplicate = async (item: any) => {
    try {
      const id = `ID-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = {
        ...item,
        id,
        order: itemsList.length,
        caption: item.caption ? `${item.caption} (Copy)` : undefined,
        name: item.name ? `${item.name} (Copy)` : undefined,
        title: item.title ? `${item.title} (Copy)` : undefined,
        question: item.question ? `${item.question} (Copy)` : undefined,
        authorName: item.authorName ? `${item.authorName} (Copy)` : undefined,
        createdAt: new Date().toISOString()
      };

      const firestoreCollName = getFirestoreCollectionName(section);
      await setDoc(doc(db, firestoreCollName, id), payload);
      triggerNotification('success', 'Item Duplicated', 'Duplicated document records cleanly.');
    } catch (err: any) {
      triggerNotification('error', 'Duplication Error', err.message);
    }
  };

  const handleShiftOrder = async (item: any, direction: 'up' | 'down') => {
    const idx = itemsList.findIndex(i => i.id === item.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= itemsList.length) return;

    const otherItem = itemsList[targetIdx];
    try {
      const firestoreCollName = getFirestoreCollectionName(section);
      
      // Swap order tags
      await setDoc(doc(db, firestoreCollName, item.id), { ...item, order: targetIdx });
      await setDoc(doc(db, firestoreCollName, otherItem.id), { ...otherItem, order: idx });

      triggerNotification('success', 'Order Adjusted', 'Rearranged visual display order indices successfully.');
    } catch (err: any) {
      triggerNotification('error', 'Reorder failure', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-semibold text-zinc-800">
      {/* CMS Header Controls */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-xs flex justify-between items-center">
        <div>
          <h3 className="font-serif text-lg font-black text-pink-950 leading-none mb-1">
            {schema.label} ({itemsList.length})
          </h3>
          <p className="text-[10px] text-gray-400">Instantly edit, delete, duplicate, or reorder entries displayed on public views.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-md"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Item
        </button>
      </div>

      {/* Grid of existing elements */}
      {itemsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {itemsList.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border shadow-xs p-5 relative flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                item.hidden ? 'border-dashed border-gray-300 opacity-60 bg-gray-50/50' : 'border-pink-100'
              }`}
            >
              {/* Image Preview Block */}
              {schema.imageKey && item[schema.imageKey] && (
                <div className="h-32 rounded-2xl overflow-hidden border border-pink-50 relative shrink-0">
                  <img
                    src={item[schema.imageKey]}
                    alt={item[schema.titleKey] || 'CMS Preview'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {item.hidden && (
                    <span className="absolute top-2 right-2 bg-zinc-950/70 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      Hidden
                    </span>
                  )}
                </div>
              )}

              {/* Text Context */}
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-serif text-pink-900 font-extrabold text-sm sm:text-base line-clamp-1">
                    {item[schema.titleKey] || 'Untitled Item'}
                  </h4>
                  {item.price !== undefined && (
                    <span className="text-pink-950 font-sans text-xs bg-pink-50 border px-1.5 py-0.5 rounded-md font-bold">
                      Rs. {item.price}
                    </span>
                  )}
                </div>
                {schema.subtitleKey && item[schema.subtitleKey] !== undefined && (
                  <p className="text-[10px] text-pink-600 uppercase font-bold tracking-wider leading-none">
                    {String(item[schema.subtitleKey])}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans font-medium">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Controls suite */}
              <div className="flex justify-between items-center pt-3 border-t border-pink-50">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleShiftOrder(item, 'up')}
                    disabled={index === 0}
                    className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 disabled:opacity-30 disabled:hover:bg-pink-50 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleShiftOrder(item, 'down')}
                    disabled={index === itemsList.length - 1}
                    className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 disabled:opacity-30 disabled:hover:bg-pink-50 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleHide(item)}
                    className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 cursor-pointer"
                    title={item.hidden ? "Unhide" : "Hide"}
                  >
                    {item.hidden ? <Eye className="h-3.5 w-3.5 text-zinc-400" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDuplicate(item)}
                    className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 cursor-pointer"
                    title="Edit fields"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 cursor-pointer"
                    title="Purge"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-pink-100 rounded-3xl p-12 text-center text-gray-400 text-sm">
          No records registered in this CMS catalogue yet. Press "Add New Item" to start!
        </div>
      )}

      {/* CREATE / EDIT MODAL FOR LIST ELEMENTS */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-list-editor-modal">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowFormModal(false)}></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 z-10">
              <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                <h3 className="font-serif text-xl font-bold text-pink-900">
                  {editingItem ? 'Edit Catalogue Entry' : 'New Catalogue Entry'}
                </h3>
                <button onClick={() => setShowFormModal(false)} className="p-1 rounded-full bg-pink-50 text-pink-700 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                {schema.fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        required={f.required}
                        rows={3}
                        value={formData[f.key] || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden text-sm"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        required={f.required}
                        value={formData[f.key] || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-pink-150 text-sm cursor-pointer"
                      >
                        {f.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : f.type === 'checkbox' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          checked={formData[f.key] || false}
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, [f.key]: e.target.checked }))}
                          className="w-4 h-4 accent-pink-600 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-pink-950">Active / Enabled</span>
                      </div>
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : f.type === 'url' ? 'url' : 'text'}
                        required={f.required}
                        value={formData[f.key] !== undefined ? formData[f.key] : ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                        className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden text-sm"
                      />
                    )}

                    {/* Image live helper preview */}
                    {f.type === 'url' && formData[f.key] && (
                      <div className="mt-2 text-center bg-zinc-50 border p-1 rounded-xl h-24 overflow-hidden inline-block relative">
                        <img src={formData[f.key]} alt="Live Preview" className="h-full object-contain mx-auto" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer pt-3 text-xs uppercase tracking-wider"
                >
                  {submitting ? 'Saving database logs...' : 'Save Catalog Record'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM PURGE CATALOG ENTRY */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-list-purge-confirm">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setItemToDelete(null)}></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4 z-10">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg font-bold text-pink-900">Remove Entry?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently delete <strong className="font-serif text-pink-950">"{itemToDelete[schema.titleKey]}"</strong> from catalog databases? This cannot be undone.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                <button onClick={handleDeleteItem} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">Permanently Purge</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
