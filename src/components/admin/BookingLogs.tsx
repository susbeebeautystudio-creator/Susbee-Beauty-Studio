import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Phone, User, Search, Trash2, Mail, Plus, Edit, Eye, Filter, Users, X, Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  category: string;
  staffName: string;
  bookingDate: string;
  bookingTime: string;
  totalPrice: number;
  notes: string;
  bookingStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid';
  createdAt: string;
}

interface BookingLogsProps {
  bookings: Booking[];
  customersList: any[];
  triggerNotification: (type: 'success' | 'error', title: string, message: string) => void;
}

const defaultServices = [
  { name: "Facial Treatment", category: "Skincare", price: 1500 },
  { name: "Deep Cleansing", category: "Skincare", price: 1000 },
  { name: "Bridal Makeup", category: "Makeup", price: 15000 },
  { name: "Waxing Services", category: "Salon Services", price: 800 },
  { name: "Manicure Session", category: "Nails", price: 1200 },
  { name: "Pedicure Session", category: "Nails", price: 1500 },
  { name: "Hair Coloring / Tint", category: "Hair Care", price: 3500 },
  { name: "Hair Cutting & Styling", category: "Hair Care", price: 1000 },
  { name: "Nail Extensions / Gel", category: "Nails", price: 2500 },
  { name: "Eyelash Extensions", category: "Makeup", price: 2000 },
  { name: "Professional Training Course", category: "Training", price: 25000 }
];

const staffList = [
  "Priya Sharma (Senior Stylist)",
  "Sita Thapa (Makeup Specialist)",
  "Asha Gurung (Skincare Expert)",
  "Sujata Rai (Nail Artist)",
  "Any Available Staff"
];

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function BookingLogs({ bookings, customersList, triggerNotification }: BookingLogsProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'customers'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedCustomerPhoneFilter, setSelectedCustomerPhoneFilter] = useState<string | null>(null);

  // Modals
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [showViewBookingModal, setShowViewBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState(defaultServices[0].name);
  const [formStaff, setFormStaff] = useState(staffList[0]);
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState(timeSlots[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formBookingStatus, setFormBookingStatus] = useState<'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('Pending');
  const [formPaymentStatus, setFormPaymentStatus] = useState<'Pending' | 'Paid'>('Pending');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const resetFormFields = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormService(defaultServices[0].name);
    setFormStaff(staffList[0]);
    setFormDate('');
    setFormTime(timeSlots[0]);
    setFormNotes('');
    setFormBookingStatus('Pending');
    setFormPaymentStatus('Pending');
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formDate) {
      triggerNotification('error', 'Fields Incomplete', 'All essential details must be filled.');
      return;
    }

    setModalSubmitting(true);
    try {
      const bId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
      const selectedSrv = defaultServices.find(s => s.name === formService);
      const price = selectedSrv ? selectedSrv.price : 1500;
      const category = selectedSrv ? selectedSrv.category : 'General';

      const payload: Booking = {
        id: bId,
        customerId: 'guest',
        customerName: formName,
        customerEmail: formEmail,
        customerPhone: formPhone,
        serviceName: formService,
        category,
        staffName: formStaff,
        bookingDate: formDate,
        bookingTime: formTime,
        totalPrice: price,
        notes: formNotes,
        bookingStatus: 'Pending',
        paymentStatus: 'Pending',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'bookings', bId), payload);
      setShowNewBookingModal(false);
      resetFormFields();
      triggerNotification('success', 'Booking Confirmed', `Logged appointment ${bId} successfully.`);
    } catch (err: any) {
      triggerNotification('error', 'Execution Error', err.message || 'Error occurred');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setModalSubmitting(true);
    try {
      const selectedSrv = defaultServices.find(s => s.name === formService);
      const price = selectedSrv ? selectedSrv.price : 1500;
      const category = selectedSrv ? selectedSrv.category : 'General';

      const updatedPayload = {
        customerName: formName,
        customerPhone: formPhone,
        customerEmail: formEmail,
        serviceName: formService,
        category,
        staffName: formStaff,
        bookingDate: formDate,
        bookingTime: formTime,
        notes: formNotes,
        totalPrice: price,
        bookingStatus: formBookingStatus,
        paymentStatus: formPaymentStatus,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'bookings', selectedBooking.id), updatedPayload);
      setShowEditBookingModal(false);
      setSelectedBooking(null);
      triggerNotification('success', 'Booking Updated', 'Modified appointment settings successfully.');
    } catch (err: any) {
      triggerNotification('error', 'Update Error', err.message);
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteDoc(doc(db, 'bookings', bookingToDelete.id));
      setBookingToDelete(null);
      triggerNotification('success', 'Record Deleted', 'Appointment log was deleted.');
    } catch (err: any) {
      triggerNotification('error', 'Deletion Failed', err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    let match = true;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      match = match && (
        b.customerName.toLowerCase().includes(s) ||
        b.customerPhone.includes(s) ||
        b.serviceName.toLowerCase().includes(s) ||
        b.id.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'All') {
      match = match && b.bookingStatus === statusFilter;
    }
    if (dateFilter) {
      match = match && b.bookingDate === dateFilter;
    }
    if (selectedCustomerPhoneFilter) {
      match = match && b.customerPhone === selectedCustomerPhoneFilter;
    }
    return match;
  });

  return (
    <div className="space-y-6 font-semibold animate-fade-in text-zinc-800">
      {/* Search & Tabs Header */}
      <div className="flex bg-pink-100/40 p-1 rounded-2xl max-w-sm mx-auto border border-pink-200/20 shadow-xs mb-4">
        <button
          onClick={() => { setActiveTab('bookings'); setSelectedCustomerPhoneFilter(null); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-extrabold'
              : 'text-pink-950 hover:bg-pink-100/50'
          }`}
        >
          <Calendar className="h-4 w-4" /> Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-extrabold'
              : 'text-pink-950 hover:bg-pink-100/50'
          }`}
        >
          <Users className="h-4 w-4" /> Customers ({customersList.length})
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search phone, name, appointment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-pink-200 focus:outline-hidden focus:border-pink-500 font-sans font-medium"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-pink-200 px-3 py-2 rounded-xl text-xs font-sans outline-hidden text-pink-950 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => { resetFormFields(); setShowNewBookingModal(true); }}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Appointment
              </button>
            </div>
          </div>

          {/* Bookings Table/Card List */}
          <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs">
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-pink-50/50 border-b border-pink-100 text-pink-950 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4 font-black">ID</th>
                      <th className="p-4 font-black">Customer</th>
                      <th className="p-4 font-black">Service</th>
                      <th className="p-4 font-black">Schedule Date</th>
                      <th className="p-4 font-black">Status</th>
                      <th className="p-4 font-black">Payment</th>
                      <th className="p-4 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50 text-gray-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-pink-50/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-pink-900">{b.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-pink-950">{b.customerName}</div>
                          <div className="text-[10px] text-gray-400 font-sans">{b.customerPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-serif font-bold text-pink-950">{b.serviceName}</div>
                          <div className="text-[9px] text-pink-500 font-bold uppercase">{b.category}</div>
                        </td>
                        <td className="p-4 font-medium">
                          <div>{b.bookingDate}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{b.bookingTime}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border ${
                            b.bookingStatus === 'Confirmed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : b.bookingStatus === 'Completed'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : b.bookingStatus === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-1.5 pt-6">
                          <button
                            onClick={() => { setSelectedBooking(b); setShowViewBookingModal(true); }}
                            className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 cursor-pointer"
                            title="Quick Overview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setFormName(b.customerName);
                              setFormPhone(b.customerPhone);
                              setFormEmail(b.customerEmail || '');
                              setFormService(b.serviceName);
                              setFormStaff(b.staffName);
                              setFormDate(b.bookingDate);
                              setFormTime(b.bookingTime);
                              setFormNotes(b.notes || '');
                              setFormBookingStatus(b.bookingStatus);
                              setFormPaymentStatus(b.paymentStatus);
                              setShowEditBookingModal(true);
                            }}
                            className="p-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg hover:bg-pink-100 cursor-pointer"
                            title="Update Schedule"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setBookingToDelete(b)}
                            className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 cursor-pointer"
                            title="Delete Log"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-xs text-gray-400">
                No matching appointment logs found.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Customers Base view */
        <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs">
          {customersList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-pink-50/50 border-b border-pink-100 text-pink-950 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 font-black">Customer Name</th>
                    <th className="p-4 font-black">Phone Number</th>
                    <th className="p-4 font-black">Email Addr</th>
                    <th className="p-4 font-black">Total Bookings</th>
                    <th className="p-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 text-gray-700">
                  {customersList.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-pink-50/20 transition-colors">
                      <td className="p-4 font-bold text-pink-950">{cust.name}</td>
                      <td className="p-4 font-mono font-medium">{cust.phone}</td>
                      <td className="p-4 font-mono text-xs">{cust.email || '—'}</td>
                      <td className="p-4 font-bold text-pink-850">{cust.totalBookings} times</td>
                      <td className="p-4 text-right flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedCustomerPhoneFilter(cust.phone);
                            setActiveTab('bookings');
                          }}
                          className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-100 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Booking History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-gray-400">
              No registered customers registered in the database yet.
            </div>
          )}
        </div>
      )}

      {/* CREATE APPOINTMENT MODAL */}
      <AnimatePresence>
        {showNewBookingModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-create-booking-modal">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowNewBookingModal(false)}></div>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 z-10">
                <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-pink-900">Add Manual Appointment</h3>
                  <button onClick={() => setShowNewBookingModal(false)} className="p-1 rounded-full bg-pink-50 text-pink-700 cursor-pointer"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleCreateBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Customer Full Name *</label>
                    <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Phone Number *</label>
                    <input type="tel" required value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Email (Optional)</label>
                    <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Select Service *</label>
                    <select value={formService} onChange={e => setFormService(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans cursor-pointer">
                      {defaultServices.map((s, idx) => (
                        <option key={idx} value={s.name}>{s.name} (Rs. {s.price})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Stylist / Assistant *</label>
                    <select value={formStaff} onChange={e => setFormStaff(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans cursor-pointer">
                      {staffList.map((st, idx) => (
                        <option key={idx} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Appointment Date *</label>
                    <input type="date" required value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Time Slot *</label>
                    <select value={formTime} onChange={e => setFormTime(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans cursor-pointer">
                      {timeSlots.map((ts, idx) => (
                        <option key={idx} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Notes / Special Demands</label>
                    <textarea rows={3} value={formNotes} onChange={e => setFormNotes(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden focus:border-pink-500 font-sans" />
                  </div>
                  <button type="submit" disabled={modalSubmitting} className="sm:col-span-2 w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all cursor-pointer">
                    {modalSubmitting ? 'Logging Schedule...' : 'Confirm Appointment'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT APPOINTMENT MODAL */}
      <AnimatePresence>
        {showEditBookingModal && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-edit-booking-modal">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => { setShowEditBookingModal(false); setSelectedBooking(null); }}></div>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 z-10">
                <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-pink-900">Manage Schedule: {selectedBooking.id}</h3>
                  <button onClick={() => { setShowEditBookingModal(false); setSelectedBooking(null); }} className="p-1 rounded-full bg-pink-50 text-pink-700 cursor-pointer"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleEditBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Name</label>
                    <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Phone</label>
                    <input type="tel" required value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Date</label>
                    <input type="date" required value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Time</label>
                    <select value={formTime} onChange={e => setFormTime(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 cursor-pointer">
                      {timeSlots.map((ts, idx) => (
                        <option key={idx} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Booking Status</label>
                    <select value={formBookingStatus} onChange={e => setFormBookingStatus(e.target.value as any)} className="w-full p-2.5 rounded-xl border border-pink-150 cursor-pointer">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Payment Status</label>
                    <select value={formPaymentStatus} onChange={e => setFormPaymentStatus(e.target.value as any)} className="w-full p-2.5 rounded-xl border border-pink-150 cursor-pointer">
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-pink-900 mb-1">Notes / Instructions</label>
                    <textarea rows={2} value={formNotes} onChange={e => setFormNotes(e.target.value)} className="w-full p-2.5 rounded-xl border border-pink-150 focus:outline-hidden" />
                  </div>
                  <button type="submit" disabled={modalSubmitting} className="sm:col-span-2 w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">
                    {modalSubmitting ? 'Updating settings...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {showViewBookingModal && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-view-booking-modal">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => { setShowViewBookingModal(false); setSelectedBooking(null); }}></div>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 z-10">
                <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-pink-900">Appointment Overview</h3>
                  <button onClick={() => { setShowViewBookingModal(false); setSelectedBooking(null); }} className="p-1 rounded-full bg-pink-50 text-pink-700 cursor-pointer"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/20 rounded-2xl border border-pink-100/50 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wider">Client Identity</span>
                    <h4 className="text-pink-950 font-bold text-base leading-none">{selectedBooking.customerName}</h4>
                    <p className="text-xs text-gray-500 font-sans">📞 Phone: {selectedBooking.customerPhone}</p>
                    {selectedBooking.customerEmail && <p className="text-xs text-gray-500 font-sans">✉️ Email: {selectedBooking.customerEmail}</p>}
                  </div>
                  <div className="p-4 bg-pink-50/20 rounded-2xl border border-pink-100/50 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wider">Service Selected</span>
                    <h4 className="text-pink-950 font-bold text-base leading-none">{selectedBooking.serviceName}</h4>
                    <p className="text-xs text-gray-500 font-sans">💇‍♀️ Stylist: {selectedBooking.staffName}</p>
                    <p className="text-xs text-pink-900 font-black">💰 Fee: Rs. {selectedBooking.totalPrice}</p>
                  </div>
                  <div className="p-4 bg-pink-50/20 rounded-2xl border border-pink-100/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wider">Appointment Schedule</span>
                    <p className="text-xs font-bold text-gray-700">🗓 Date: {selectedBooking.bookingDate}</p>
                    <p className="text-xs font-bold text-gray-700">⏱ Time Slot: {selectedBooking.bookingTime}</p>
                  </div>
                  {selectedBooking.notes && (
                    <div className="p-4 bg-pink-50/20 rounded-2xl border border-pink-100/50">
                      <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wider block mb-1">Notes</span>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {bookingToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-delete-confirm-modal">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setBookingToDelete(null)}></div>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4 z-10">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto"><AlertTriangle className="h-6 w-6 animate-pulse" /></div>
                <h3 className="font-serif text-lg font-bold text-pink-900">Delete Record?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Are you sure you want to permanently delete booking <strong className="font-mono text-pink-950">{bookingToDelete.id}</strong>? This action is irreversible.</p>
                <div className="flex gap-3 justify-center pt-2">
                  <button onClick={() => setBookingToDelete(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                  <button onClick={handleDeleteBooking} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
