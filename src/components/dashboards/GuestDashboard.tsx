import React, { useState } from 'react';
import { useHotelPro } from '../../context/HotelProContext';
import { Booking, ServiceType } from '../../types';
import { formatINR, formatIndianDate } from '../../utils/indianFormats';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Bell,
  Utensils,
  Sparkles,
  User as UserIcon,
  Phone,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface GuestDashboardProps {
  onViewInvoice: (booking: Booking) => void;
  onExploreMore: () => void;
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({
  onViewInvoice,
  onExploreMore,
}) => {
  const {
    currentUser,
    bookings,
    cancelBooking,
    requestRefund,
    createServiceRequest,
    serviceRequests,
  } = useHotelPro();

  // Filter bookings for this user
  const userBookings = bookings.filter(b => b.userId === currentUser.id || b.guestEmail === currentUser.email);

  // States for actions
  const [selectedBookingForService, setSelectedBookingForService] = useState<Booking | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('In-Room Royal Dining (Thali & Beverages)');
  const [serviceNotes, setServiceNotes] = useState('');
  const [serviceFeedback, setServiceFeedback] = useState('');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel dates');

  const upcomingBookings = userBookings.filter(b => b.bookingStatus === 'Confirmed');
  const activeBookings = userBookings.filter(b => b.bookingStatus === 'Checked-in');
  const pastBookings = userBookings.filter(b => b.bookingStatus === 'Checked-out' || b.bookingStatus === 'Cancelled');

  const handleCreateServiceRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForService) return;

    createServiceRequest({
      bookingId: selectedBookingForService.id,
      bookingReference: selectedBookingForService.bookingReference,
      hotelId: selectedBookingForService.hotelId,
      roomNumber: selectedBookingForService.roomNumber || '101',
      guestName: currentUser.name,
      guestPhone: currentUser.phone,
      serviceType,
      priority: 'Normal',
      status: 'Pending',
      notes: serviceNotes,
    });

    setServiceFeedback(`Service request sent to Front Desk for Room ${selectedBookingForService.roomNumber || '101'}.`);
    setTimeout(() => {
      setSelectedBookingForService(null);
      setServiceFeedback('');
      setServiceNotes('');
    }, 1500);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    cancelBooking(cancelModalBooking.id, cancelReason);
    setCancelModalBooking(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold">Namaste, {currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Verified Guest
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-4">
              <span>{currentUser.email}</span>
              <span>•</span>
              <span className="font-mono">{currentUser.phone}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onExploreMore}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-md shadow-amber-900/30 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book Another Stay</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Upcoming Stays</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{upcomingBookings.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Currently Checked-in</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{activeBookings.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Completed Stays</div>
            <div className="text-2xl font-bold font-serif text-slate-900">
              {pastBookings.filter(b => b.bookingStatus === 'Checked-out').length}
            </div>
          </div>
        </div>
      </div>

      {/* Active Checked-In Stay Banner (If any) */}
      {activeBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Current Stay in Progress
          </h3>

          {activeBookings.map(bkg => (
            <div
              key={bkg.id}
              className="bg-emerald-50/60 border-2 border-emerald-300 rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-bold">
                    Currently Checked-In
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-950">
                    Room {bkg.roomNumber}
                  </span>
                  <span className="text-xs text-slate-500">• {bkg.bookingReference}</span>
                </div>

                <h4 className="font-serif text-xl font-bold text-slate-900">{bkg.hotelName}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {bkg.hotelCity}, India • Category: {bkg.categoryName} • Check-out on {formatIndianDate(bkg.checkOut)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setSelectedBookingForService(bkg)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Request In-Room Dining / Amenities</span>
                </button>

                <button
                  onClick={() => onViewInvoice(bkg)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>GST Tax Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Bookings Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Your Booking History</h3>
            <p className="text-xs text-slate-500">Track reservations, download certified invoices, and manage requests</p>
          </div>
          <span className="text-xs font-medium text-slate-500">{userBookings.length} total records</span>
        </div>

        {userBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-serif text-base font-bold text-slate-700">No Reservations Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our handpicked collection of royal heritage palaces and beach retreats across India.
            </p>
            <button
              onClick={onExploreMore}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userBookings.map(booking => {
              const statusColors = {
                'Confirmed': 'bg-blue-50 text-blue-800 border-blue-200',
                'Checked-in': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'Checked-out': 'bg-slate-100 text-slate-700 border-slate-200',
                'Cancelled': 'bg-red-50 text-red-700 border-red-200',
              };

              return (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-stone-50/70 transition-colors flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {booking.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          statusColors[booking.bookingStatus]
                        }`}
                      >
                        {booking.bookingStatus.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Booked on {formatIndianDate(booking.createdAt)}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-900">
                      {booking.hotelName} ({booking.hotelCity})
                    </h4>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>Room Category: <strong>{booking.categoryName}</strong></span>
                      <span>•</span>
                      <span>Dates: <strong>{formatIndianDate(booking.checkIn)} → {formatIndianDate(booking.checkOut)}</strong> ({booking.nights}N)</span>
                      <span>•</span>
                      <span>Guests: <strong>{booking.guestsCount}</strong></span>
                      {booking.roomNumber && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">Room #{booking.roomNumber}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] text-slate-500">Total (incl. GST)</div>
                      <div className="font-serif text-base font-bold text-slate-900">
                        {formatINR(booking.priceBreakdown.grandTotal)}
                      </div>
                      <div className="text-[10px] text-slate-400">{booking.paymentMethod}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewInvoice(booking)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold flex items-center gap-1 border border-stone-200 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Tax Invoice</span>
                      </button>

                      {booking.bookingStatus === 'Confirmed' && (
                        <button
                          onClick={() => setCancelModalBooking(booking)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors cursor-pointer"
                        >
                          Cancel Stay
                        </button>
                      )}

                      {booking.bookingStatus === 'Cancelled' && booking.refundStatus === 'Requested' && (
                        <button
                          onClick={() => requestRefund(booking.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 cursor-pointer"
                        >
                          Process Instant Refund
                        </button>
                      )}

                      {booking.bookingStatus === 'Cancelled' && booking.refundStatus === 'Processed' && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          ✓ Refund Credited
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guest Service Requests History */}
      {serviceRequests.filter(s => s.guestName === currentUser.name).length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            Your Concierge & Service Requests
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceRequests
              .filter(s => s.guestName === currentUser.name)
              .map(srv => (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{srv.serviceType}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        srv.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{srv.notes}</p>
                  <div className="text-[10px] text-slate-400">
                    Room {srv.roomNumber} • Requested at {new Date(srv.requestedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal: In-Room Dining & Amenities Request */}
      {selectedBookingForService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif text-lg font-bold text-slate-900">
                In-Room Service Request (Room {selectedBookingForService.roomNumber || '101'})
              </h4>
              <button
                onClick={() => setSelectedBookingForService(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {serviceFeedback ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{serviceFeedback}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateServiceRequest} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Select Hospitality Service</label>
                  <select
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value as ServiceType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value="In-Room Royal Dining (Thali & Beverages)">In-Room Royal Dining (Thali & Beverages)</option>
                    <option value="Extra Towels & Ayurvedic Toiletries">Extra Towels & Ayurvedic Toiletries</option>
                    <option value="Airport / Railway Station Taxi">Airport / Railway Station Taxi</option>
                    <option value="Ayurvedic Spa & Wellness Booking">Ayurvedic Spa & Wellness Booking</option>
                    <option value="Luggage & Bell Desk Assistance">Luggage & Bell Desk Assistance</option>
                    <option value="Ironing & Laundry Service">Ironing & Laundry Service</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Specific Requirements / Food Items</label>
                  <textarea
                    rows={3}
                    value={serviceNotes}
                    onChange={e => setServiceNotes(e.target.value)}
                    required
                    placeholder="e.g. 2x Royal Mewari Vegetarian Thalis with garlic naan, or 4 PM Ayurveda consultation..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForService(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    Send to Front Desk
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Cancellation Confirmation */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <h4 className="font-serif text-lg font-bold text-slate-900">
              Confirm Reservation Cancellation
            </h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel booking <strong>{cancelModalBooking.bookingReference}</strong> at {cancelModalBooking.hotelName}? As per Indian hospitality policy, full refund of {formatINR(cancelModalBooking.priceBreakdown.grandTotal)} will be credited back via Razorpay.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              >
                <option value="Change of travel dates">Change of travel dates</option>
                <option value="Flight / train cancelled or rescheduled">Flight / train cancelled or rescheduled</option>
                <option value="Personal emergency">Personal emergency</option>
                <option value="Found alternative accommodation">Found alternative accommodation</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
