import React, { useState } from 'react';
import { Hotel, RoomCategory, Booking, PaymentMethod } from '../types';
import { useHotelPro } from '../context/HotelProContext';
import { formatINR, isValidIndianPhone, isValidGSTIN } from '../utils/indianFormats';
import { calculateHotelBookingPrice } from '../utils/pricing';
import { RazorpayModal } from './RazorpayModal';
import {
  X,
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Calendar,
  Users,
  Building,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface BookingModalProps {
  hotel: Hotel;
  category: RoomCategory;
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  category,
  onClose,
  onBookingComplete,
}) => {
  const {
    currentUser,
    searchCheckIn,
    searchCheckOut,
    searchGuests,
    createBooking,
  } = useHotelPro();

  // Form states
  const [guestName, setGuestName] = useState(currentUser.name || 'Aarav Sharma');
  const [guestEmail, setGuestEmail] = useState(currentUser.email || 'guest@hotelpro.in');
  const [guestPhone, setGuestPhone] = useState(currentUser.phone || '+91 98201 12345');
  const [guestCity, setGuestCity] = useState('Mumbai');
  const [guestGstin, setGuestGstin] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [roomsCount, setRoomsCount] = useState(1);
  const [couponCode, setCouponCode] = useState('NAMASTE10');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponError, setCouponError] = useState('');

  // Payment flow states
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculate pricing breakdown
  const discountPct = couponApplied ? 10 : 0;
  const priceBreakdown = calculateHotelBookingPrice(
    category.basePrice,
    searchCheckIn,
    searchCheckOut,
    roomsCount,
    discountPct
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'NAMASTE10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponError('Invalid coupon code. Try NAMASTE10 for 10% off.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isValidIndianPhone(guestPhone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number (e.g. +91 98201 12345).');
      return;
    }

    if (guestGstin.trim() && !isValidGSTIN(guestGstin.trim())) {
      setFormError('Invalid Indian GSTIN format. Must be 15 alphanumeric characters (e.g. 27AABCM7731M1ZF).');
      return;
    }

    // Launch Razorpay modal
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (paymentId: string, paymentMethod: PaymentMethod) => {
    setShowRazorpay(false);

    const isPaid = paymentMethod !== 'Pay at Hotel';

    const newBooking = createBooking({
      userId: currentUser.id,
      guestName,
      guestEmail,
      guestPhone,
      guestCity,
      guestGstin: guestGstin.trim() || undefined,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelAddress: hotel.address,
      hotelGstin: hotel.gstin,
      categoryId: category.id,
      categoryName: category.name,
      checkIn: searchCheckIn,
      checkOut: searchCheckOut,
      nights: priceBreakdown.nights,
      guestsCount: searchGuests,
      roomsCount,
      priceBreakdown,
      bookingStatus: 'Confirmed',
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      paymentMethod,
      razorpayPaymentId: isPaid ? paymentId : undefined,
      specialRequests: specialRequests.trim() || undefined,
    });

    onBookingComplete(newBooking);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold">Secure Reservation Checkout</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Indian Hospitality GST Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {hotel.name} • {category.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Guest & Stay Details */}
              <div className="lg:col-span-2 space-y-5">
                {/* Stay Summary Card */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">Check-in / Check-out</div>
                      <div className="font-bold text-slate-800">
                        {searchCheckIn} to {searchCheckOut} ({priceBreakdown.nights} Nights)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">Guests & Rooms</div>
                      <div className="font-bold text-slate-800">
                        {searchGuests} Guests • {roomsCount} Room(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">Destination</div>
                      <div className="font-bold text-slate-800">{hotel.city}, India</div>
                    </div>
                  </div>
                </div>

                {/* Primary Guest Details */}
                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Primary Guest Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Full Name (as per Govt ID)</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. Aarav Sharma"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. aarav@example.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Mobile Number (+91)</span>
                        <span className="text-[10px] text-emerald-700">Indian Mobile</span>
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        placeholder="+91 98201 12345"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">City of Residence</label>
                      <input
                        type="text"
                        value={guestCity}
                        onChange={e => setGuestCity(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      />
                    </div>
                  </div>

                  {/* Optional Corporate GSTIN for Tax Credit */}
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Company GSTIN (Optional - for B2B Input Tax Credit)</span>
                      <span className="text-[10px] text-slate-400">15-digit GSTIN</span>
                    </label>
                    <input
                      type="text"
                      value={guestGstin}
                      onChange={e => setGuestGstin(e.target.value.toUpperCase())}
                      maxLength={15}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                      placeholder="e.g. 27AABCM7731M1ZF"
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Special Requests / Preferences</label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={e => setSpecialRequests(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      placeholder="e.g. High floor room, late check-in, dietary requirements..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing Breakdown & Promo */}
              <div className="space-y-4">
                {/* Coupon Box */}
                <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>Have a Promo Code?</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs font-mono font-bold bg-white border border-amber-300 rounded-lg uppercase"
                      placeholder="NAMASTE10"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {couponApplied && (
                    <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      NAMASTE10 applied: 10% Royal Hospitality Savings!
                    </div>
                  )}

                  {couponError && (
                    <div className="text-[11px] text-red-600 font-medium">{couponError}</div>
                  )}
                </div>

                {/* Itemized Price Calculation */}
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3 text-xs">
                  <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-stone-200 pb-2 flex items-center justify-between">
                    <span>Tax Invoice Summary</span>
                    <span className="text-[10px] font-mono text-slate-500">SAC: {priceBreakdown.sacCode}</span>
                  </h4>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Room Tariff ({priceBreakdown.nights}N × {formatINR(category.basePrice)})</span>
                      <span className="font-semibold text-slate-900">{formatINR(priceBreakdown.grossRoomTariff)}</span>
                    </div>

                    {priceBreakdown.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Festive Discount (10%)</span>
                        <span>-{formatINR(priceBreakdown.discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-stone-200 pt-2 font-medium">
                      <span>Net Taxable Value</span>
                      <span className="text-slate-900">{formatINR(priceBreakdown.netTaxableAmount)}</span>
                    </div>

                    {/* Indian GST Breakdown */}
                    <div className="pl-2 border-l-2 border-amber-400 space-y-1 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>CGST ({(priceBreakdown.gstRate * 50).toFixed(0)}%)</span>
                        <span>{formatINR(priceBreakdown.cgstAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST ({(priceBreakdown.gstRate * 50).toFixed(0)}%)</span>
                        <span>{formatINR(priceBreakdown.sgstAmount)}</span>
                      </div>
                      <div className="flex justify-between text-slate-700 font-medium pt-0.5">
                        <span>Total GST ({(priceBreakdown.gstRate * 100).toFixed(0)}%)</span>
                        <span>{formatINR(priceBreakdown.totalGst)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between border-t-2 border-stone-300 pt-3 text-sm font-bold text-slate-900">
                      <span>Grand Total (INR)</span>
                      <span className="text-lg text-amber-700 font-serif">
                        {formatINR(priceBreakdown.grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200/80 text-[10px] text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Free cancellation up to 48 hours prior to check-in. Instant GST receipt issued.</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-900/30 transition-all cursor-pointer active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment ({formatINR(priceBreakdown.grandTotal)})</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={showRazorpay}
        onClose={() => setShowRazorpay(false)}
        amount={priceBreakdown.grandTotal}
        hotelName={hotel.name}
        categoryName={category.name}
        customerName={guestName}
        customerEmail={guestEmail}
        customerPhone={guestPhone}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};
