import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Clock, ArrowRight, X, Mail, Sparkles, Search } from 'lucide-react';
import { useCMS, Blog as BlogType } from '../lib/cms';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogType | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { blogs, contactSettings } = useCMS();

  // Filter active blogs
  const activeBlogs = blogs.filter(b => !b.hidden);

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      const msg = `Hello! I'd like to subscribe to Susbee Beauty Studio beauty tips newsletter. My email: ${newsletterEmail}`;
      window.open(`https://wa.me/${contactSettings?.phone || "9856103666"}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'hair care', label: 'Hair Care' },
    { id: 'bridal', label: 'Bridal' },
    { id: 'nails', label: 'Nails' },
  ];

  // Filter & Search list posts
  const filteredPosts = activeBlogs.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Featured post is the first active post
  const featuredPost = activeBlogs[0];
  const listPosts = activeBlogs.slice(1);

  const handleBookFromBlog = (title: string) => {
    window.open(`https://wa.me/${contactSettings?.phone || "9856103666"}?text=Hi! I read your blog on "${encodeURIComponent(title)}" and would like to book an appointment or ask a question.`, '_blank');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-800 via-pink-700 to-rose-600 text-white py-16 px-4 text-center rounded-2xl mx-4 shadow-lg">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center space-y-4">
          <span className="bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Beauty Wisdom
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Beauty Blog & Tips
          </h2>
          <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed max-w-2xl font-sans">
            Professional skincare steps, cosmetics color choices, hair treatments, and bridal prep diaries written by our lead styling team.
          </p>
        </div>
      </section>

      {/* Category filters & Search */}
      <section className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide border-2 transition-all cursor-pointer ${
                activeCategory.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                  : 'bg-white border-pink-200 text-pink-700 hover:border-pink-500 hover:text-pink-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-pink-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium text-pink-950 focus:outline-none focus:border-pink-500 placeholder-pink-300"
          />
        </div>
      </section>

      {/* Featured Post */}
      {activeCategory === 'all' && searchQuery === '' && featuredPost && (
        <section className="max-w-4xl mx-auto px-4">
          <div
            onClick={() => setSelectedPost(featuredPost)}
            className="bg-white rounded-3xl overflow-hidden shadow-md border border-pink-100/60 hover:shadow-lg transition-all cursor-pointer grid grid-cols-1 md:grid-cols-2"
          >
            {/* Visual Block with Image */}
            <div className="bg-gradient-to-tr from-pink-50 to-pink-100/50 flex items-center justify-center py-16 md:py-0 select-none border-b md:border-b-0 md:border-r border-pink-100 h-full min-h-[280px] relative">
              {featuredPost.featuredImageUrl ? (
                <img 
                  src={featuredPost.featuredImageUrl} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover absolute inset-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-8xl select-none">✍️</span>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-10 flex flex-col justify-center space-y-4">
              <span className="bg-pink-100 text-pink-700 text-[9px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full border border-pink-100/50 inline-block self-start">
                {featuredPost.category} ⭐ Featured
              </span>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium font-sans">
                <span className="flex items-center gap-1">📅 {featuredPost.publishDate}</span>
                <span className="flex items-center gap-1">✍️ Staff Writer</span>
              </div>

              <h3 className="font-serif font-black text-xl sm:text-2xl text-pink-950 leading-tight">
                {featuredPost.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans line-clamp-3">
                {featuredPost.seoDescription || featuredPost.content}
              </p>

              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(featuredPost);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-transform hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog list Grid */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        {(activeCategory !== 'all' || searchQuery !== '') ? (
          <h4 className="font-serif text-2xl font-bold text-pink-950">
            Search Results ({filteredPosts.length})
          </h4>
        ) : (
          <h4 className="font-serif text-2xl font-bold text-pink-950">
            Latest Posts
          </h4>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl border border-pink-100/60 hover:border-pink-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full cursor-pointer"
              >
                {/* Image Header */}
                <div className="h-44 bg-gradient-to-tr from-pink-50 to-pink-100/50 flex items-center justify-center relative">
                  {post.featuredImageUrl ? (
                    <img 
                      src={post.featuredImageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-5xl select-none">📝</span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-white/95 text-pink-900 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-pink-100 shadow-xs">
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold font-sans">
                      <span>{post.publishDate}</span>
                    </div>

                    <h4 className="font-serif font-black text-base text-pink-950 leading-snug line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                      {post.seoDescription || post.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-pink-50 flex items-center justify-between text-xs font-bold text-pink-600 group">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-pink-100 text-gray-500 text-sm">
            No articles match the filter settings or search query.
          </div>
        )}
      </section>

      {/* Quick Beauty Tip Section */}
      <section className="bg-pink-100/30 border-y border-pink-100 py-12 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="bg-pink-100 text-pink-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            💡 Quick Daily Tip
          </span>
          <h4 className="font-serif text-xl sm:text-2xl font-black text-pink-900 leading-tight">
            How to lock in maximum facial glow?
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans italic">
            "Always follow up any skin hydration mask session with a cold ice water splash to rapidly close open pores and seal essential moisture inside styling cells."
          </p>
        </div>
      </section>

      {/* Dynamic Article Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] relative border border-pink-100 flex flex-col"
            >
              {/* Header block */}
              <div className="p-6 bg-pink-50/50 border-b border-pink-100 flex justify-between items-center shrink-0">
                <span className="bg-pink-100 text-pink-700 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  {selectedPost.category}
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-white hover:bg-pink-50 text-pink-900 p-1.5 rounded-full border border-pink-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable post content */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
                {selectedPost.featuredImageUrl && (
                  <div className="h-64 rounded-2xl overflow-hidden relative border border-pink-100 shrink-0">
                    <img 
                      src={selectedPost.featuredImageUrl} 
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex gap-4 text-xs text-gray-400 font-medium font-sans">
                    <span>📅 Published: {selectedPost.publishDate}</span>
                    <span>✍️ Author: Staff Expert</span>
                  </div>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-pink-950 leading-tight">
                    {selectedPost.title}
                  </h3>
                </div>

                <div className="text-sm text-gray-600 leading-relaxed font-sans space-y-4 whitespace-pre-line border-t border-pink-100/50 pt-4">
                  {selectedPost.content}
                </div>

                {selectedPost.tags && (
                  <div className="flex gap-1 flex-wrap pt-4">
                    {selectedPost.tags.split(',').map((tag, i) => (
                      <span key={i} className="bg-pink-50 text-pink-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-pink-100">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Trigger Footer */}
              <div className="p-6 bg-pink-50/30 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <p className="text-xs text-pink-900 font-bold tracking-wide">
                  Loved this post? Discuss or book a trial with our specialists!
                </p>
                <button
                  onClick={() => {
                    handleBookFromBlog(selectedPost.title);
                    setSelectedPost(null);
                  }}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Consult via WhatsApp 💬
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
