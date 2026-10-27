import React, { useState } from 'react';
import { Hotel, RoomCategory } from '../types';
import { useHotelPro } from '../context/HotelProContext';
import { formatINR } from '../utils/indianFormats';
import { calculateHotelBookingPrice } from '../utils/pricing';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Check,
  Shield,
  Sparkles,
  Bed,
  Maximize2,
  Users,
  CreditCard,
  FileText,
} from 'lucide-react';

interface HotelDetailsModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  onBookRoomCategory: (category: RoomCategory) => void;
}

export const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({
  hotel,
  onClose,
  onBookRoomCategory,
}) => {
  const { categories, searchCheckIn, searchCheckOut, searchGuests } = useHotelPro();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!hotel) return null;

  const hotelCategories = categories.filter(c => c.hotelId === hotel.id);
  const images = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.featuredImage];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold">{hotel.name}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950">
                ★ {hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {hotel.address}, {hotel.city}, {hotel.state} - {hotel.postalCode}, India
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Hotel Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Photo Gallery with Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={images[activeImageIdx]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-md">
                Photo {activeImageIdx + 1} of {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-amber-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hotel Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">About This Property</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Featured Amenities & Services
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {hotel.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-slate-800 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indian Regulatory & Hotel Details Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 h-fit">
              <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-stone-200 pb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" /> Hotel Verification & Policies
              </h4>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-mono font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {hotel.gstin}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SAC Code:</span>
                  <span className="font-mono font-semibold text-slate-900">9963 (Accommodation)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Check-in:
                  </span>
                  <span className="font-semibold text-slate-900">{hotel.checkInTime} IST</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Check-out:
                  </span>
                  <span className="font-semibold text-slate-900">{hotel.checkOutTime} IST</span>
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{hotel.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span className="truncate">{hotel.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <strong>Government ID Requirement:</strong> As per Indian hospitality regulations, valid government photo ID (Aadhaar, Passport, Voter ID, or DL) is required at check-in for all adult guests.
              </div>
            </div>
          </div>

          {/* Room Categories Available */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Select Room & Suite Category</h3>
                <p className="text-xs text-slate-500">
                  Rates for your stay ({searchCheckIn} to {searchCheckOut}) • {searchGuests} Guests
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                GST Included on Checkout
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hotelCategories.map(cat => {
                const sampleBreakdown = calculateHotelBookingPrice(
                  cat.basePrice,
                  searchCheckIn,
                  searchCheckOut,
                  1,
                  0
                );

                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Category Image */}
                      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                        <img
                          src={cat.images[0] || hotel.featuredImage}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-sm">
                          {cat.categoryType}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-lg font-bold text-slate-900">{cat.name}</h4>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>

                        {/* Room Specifications */}
                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-amber-600" />
                            <span className="truncate">{cat.bedType}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>{cat.sizeSqFt} sq.ft</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                            <span>Max {cat.maxGuests} Guests</span>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5">
                          {cat.amenities.slice(0, 3).map((a, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                            >
                              ✓ {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Reserve CTA */}
                    <div className="p-5 bg-stone-50 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-500 font-medium">Nightly Base Tariff</div>
                        <div className="font-serif text-xl font-bold text-slate-900">
                          {formatINR(cat.basePrice)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Est. Total: {formatINR(sampleBreakdown.grandTotal)} ({sampleBreakdown.nights} nights incl. {(sampleBreakdown.gstRate * 100).toFixed(0)}% GST)
                        </div>
                      </div>

                      <button
                        onClick={() => onBookRoomCategory(cat)}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-900/20 transition-all cursor-pointer active:scale-95"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Reserve</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
