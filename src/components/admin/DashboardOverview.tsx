import React from 'react';
import { Calendar, FileSpreadsheet, Star, Image, Award, BookOpen, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useCMS } from '../../lib/cms';

interface DashboardOverviewProps {
  bookings: any[];
  customersCount: number;
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ bookings, customersCount, setActiveTab }: DashboardOverviewProps) {
  const { services, gallery, courses, blogs, reviews } = useCMS();

  // Calculations
  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.bookingStatus === 'Pending').length,
    completedBookings: bookings.filter(b => b.bookingStatus === 'Completed').length,
    revenue: bookings
      .filter(b => b.bookingStatus === 'Completed' || b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0),
    totalServices: services.length,
    totalImages: gallery.length,
    totalCourses: courses.length,
    totalBlogs: blogs.length,
    totalReviews: reviews.length
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in font-semibold">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
          <div className="bg-pink-100 text-pink-600 p-3.5 rounded-2xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Appointments</span>
            <span className="text-xl sm:text-2xl font-black text-pink-950">{stats.totalBookings}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-600 p-3.5 rounded-2xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Estimated Revenue</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950">Rs. {stats.revenue}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3.5 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Customer Profiles</span>
            <span className="text-xl sm:text-2xl font-black text-blue-950">{customersCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
          <div className="bg-amber-100 text-amber-600 p-3.5 rounded-2xl">
            <Star className="h-6 w-6 animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Avg Rating</span>
            <span className="text-xl sm:text-2xl font-black text-amber-950">
              {stats.totalReviews > 0 
                ? (reviews.reduce((sum, r) => sum + r.stars, 0) / stats.totalReviews).toFixed(1) 
                : "5.0"} ⭐
            </span>
          </div>
        </div>
      </div>

      {/* Asset Counters */}
      <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-xs">
        <h3 className="font-serif text-lg font-bold text-pink-950 mb-4 border-b border-pink-50 pb-2">
          CMS Inventory Asset Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          {[
            { label: 'Menu Catalog', value: stats.totalServices, icon: FileSpreadsheet, color: 'text-pink-600 bg-pink-50', tab: 'services' },
            { label: 'Gallery Photo', value: stats.totalImages, icon: Image, color: 'text-rose-600 bg-rose-50', tab: 'gallery' },
            { label: 'Courses', value: stats.totalCourses, icon: Award, color: 'text-indigo-600 bg-indigo-50', tab: 'courses' },
            { label: 'Blog Posts', value: stats.totalBlogs, icon: BookOpen, color: 'text-sky-600 bg-sky-50', tab: 'blog' },
            { label: 'Reviews', value: stats.totalReviews, icon: Star, color: 'text-amber-600 bg-amber-50', tab: 'reviews' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.tab)}
                className="bg-white p-4 rounded-2xl border border-pink-150 hover:-translate-y-0.5 hover:shadow-xs transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer outline-hidden group"
              >
                <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] text-gray-500 font-bold block leading-none">{item.label}</span>
                <span className="text-lg font-black text-pink-950 block leading-none">{item.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Bookings & Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-pink-50 pb-2">
            <h3 className="font-serif text-lg font-bold text-pink-950">Recent Appointments</h3>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="text-xs text-pink-600 hover:underline font-bold"
            >
              See all logs
            </button>
          </div>

          {recentBookings.length > 0 ? (
            <div className="divide-y divide-pink-50">
              {recentBookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="space-y-1">
                    <div className="font-bold text-pink-950">{b.customerName}</div>
                    <div className="text-[11px] text-gray-500 font-sans">
                      {b.serviceName} • {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                    b.bookingStatus === 'Confirmed' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : b.bookingStatus === 'Completed'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-400">
              No bookings logged yet.
            </div>
          )}
        </div>

        {/* Dynamic status overview visual spacer */}
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-pink-950 border-b border-pink-50 pb-2">
              Appointment Status
            </h3>
            <div className="space-y-3 pt-3">
              {[
                { label: 'Pending Response', count: stats.pendingBookings, color: 'bg-amber-500' },
                { label: 'Confirmed Schedule', count: stats.completedBookings + bookings.filter(b => b.bookingStatus === 'Confirmed').length, color: 'bg-emerald-500' },
                { label: 'Completed Sessions', count: stats.completedBookings, color: 'bg-blue-500' }
              ].map((it, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>{it.label}</span>
                    <span>{it.count}</span>
                  </div>
                  <div className="w-full bg-pink-50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${it.color} h-full`} 
                      style={{ width: `${stats.totalBookings > 0 ? (it.count / stats.totalBookings) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-center">
            <span className="text-xl block mb-1">💅</span>
            <p className="text-[10px] text-pink-800 leading-relaxed font-bold">
              Tip: Keep customer appointments and services updated to synchronize with real-time website booking selectors!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
