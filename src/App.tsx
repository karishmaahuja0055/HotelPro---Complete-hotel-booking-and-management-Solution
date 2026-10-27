import React, { useState } from 'react';
import { HotelProProvider, useHotelPro } from './context/HotelProContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HotelCard } from './components/HotelCard';
import { HotelDetailsModal } from './components/HotelDetailsModal';
import { BookingModal } from './components/BookingModal';
import { GstInvoiceModal } from './components/GstInvoiceModal';
import { GuestDashboard } from './components/dashboards/GuestDashboard';
import { StaffDashboard } from './components/dashboards/StaffDashboard';
import { ManagerDashboard } from './components/dashboards/ManagerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { Hotel, RoomCategory, Booking } from './types';
import { formatINR } from './utils/indianFormats';
import {
  Compass,
  MapPin,
  Filter,
  Sparkles,
  ShieldCheck,
  Building2,
  PhoneCall,
  Mail,
  Heart,
  CheckCircle,
} from 'lucide-react';

function HotelProAppContent() {
  const { hotels, searchCity, currentUser } = useHotelPro();
  const [activeTab, setActiveTab] = useState<'explore' | 'dashboard' | 'about'>('explore');

  // Modals state
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingCategory, setBookingCategory] = useState<RoomCategory | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [priceMaxFilter, setPriceMaxFilter] = useState<number>(50000);
  const [selectedAmenityFilter, setSelectedAmenityFilter] = useState<string>('All');
  const [bookingConfirmationNotice, setBookingConfirmationNotice] = useState<Booking | null>(null);

  // Filter hotels by city, price in INR, and amenity
  const filteredHotels = hotels.filter(hotel => {
    const matchesCity =
      searchCity === 'All Destinations' ||
      hotel.city.toLowerCase() === searchCity.toLowerCase();

    const matchesPrice = hotel.startingPrice <= priceMaxFilter;

    const matchesAmenity =
      selectedAmenityFilter === 'All' ||
      hotel.amenities.some(a => a.toLowerCase().includes(selectedAmenityFilter.toLowerCase()));

    return matchesCity && matchesPrice && matchesAmenity;
  });

  const handleBookingCompleted = (booking: Booking) => {
    setSelectedHotel(null);
    setBookingCategory(null);
    setBookingConfirmationNotice(booking);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'explore' ? (
          <div>
            {/* Hero & Search Engine */}
            <HeroSection
              onSearchSubmit={() => {
                const el = document.getElementById('hotels-listing-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Hotel Results Section */}
            <section id="hotels-listing-section" className="container mx-auto px-4 sm:px-6 py-12 space-y-8">
              {/* Filter & Sorting Controls */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    {searchCity === 'All Destinations' ? 'All Handpicked Indian Stays' : `Hotels & Resorts in ${searchCity}`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {filteredHotels.length} verified luxury properties • Prices in Indian Rupees (₹)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs w-full lg:w-auto">
                  {/* Filter by Amenity */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500 font-medium">Filter:</span>
                    <select
                      value={selectedAmenityFilter}
                      onChange={e => setSelectedAmenityFilter(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Features</option>
                      <option value="Spa">Ayurvedic Spa</option>
                      <option value="Pool">Swimming Pool</option>
                      <option value="Beach">Beach Access</option>
                      <option value="Lake">Lake View</option>
                      <option value="Wi-Fi">High-Speed Wi-Fi</option>
                    </select>
                  </div>

                  {/* Max Nightly Tariff Slider */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                    <span className="text-slate-500 font-medium">Max Tariff:</span>
                    <span className="font-bold text-slate-900 font-serif">{formatINR(priceMaxFilter)}</span>
                    <input
                      type="range"
                      min={5000}
                      max={45000}
                      step={1000}
                      value={priceMaxFilter}
                      onChange={e => setPriceMaxFilter(Number(e.target.value))}
                      className="w-24 accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Hotel Cards Grid */}
              {filteredHotels.length === 0 ? (
                <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-slate-800">No properties match your filter</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your maximum nightly budget or clearing feature filters to view all retreats.
                  </p>
                  <button
                    onClick={() => {
                      setPriceMaxFilter(50000);
                      setSelectedAmenityFilter('All');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.map(hotel => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onSelect={h => setSelectedHotel(h)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Role Specific Dashboards */
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {bookingConfirmationNotice && (
              <div className="mb-6 p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-emerald-950 text-base">
                      Reservation Confirmed! Reference: {bookingConfirmationNotice.bookingReference}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Stay at {bookingConfirmationNotice.hotelName} ({bookingConfirmationNotice.categoryName}) for {bookingConfirmationNotice.nights} Nights. Instant Tax Invoice generated.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForInvoice(bookingConfirmationNotice)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    View GST Tax Invoice
                  </button>
                  <button
                    onClick={() => setBookingConfirmationNotice(null)}
                    className="p-2 text-emerald-800 hover:text-emerald-950 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {currentUser.role === 'guest' && (
              <GuestDashboard
                onViewInvoice={bkg => setSelectedBookingForInvoice(bkg)}
                onExploreMore={() => setActiveTab('explore')}
              />
            )}

            {currentUser.role === 'staff' && <StaffDashboard />}

            {currentUser.role === 'manager' && <ManagerDashboard />}

            {currentUser.role === 'admin' && <AdminDashboard />}
          </div>
        )}
      </main>

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <HotelDetailsModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onBookRoomCategory={category => setBookingCategory(category)}
        />
      )}

      {/* Booking Checkout Modal */}
      {selectedHotel && bookingCategory && (
        <BookingModal
          hotel={selectedHotel}
          category={bookingCategory}
          onClose={() => setBookingCategory(null)}
          onBookingComplete={handleBookingCompleted}
        />
      )}

      {/* GST Compliant Tax Invoice Modal */}
      {selectedBookingForInvoice && (
        <GstInvoiceModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}

      {/* Footer */}
      <footer className="no-print bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-serif text-lg font-bold text-white">HotelPro India</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                India's premier academic portfolio hotel management & reservation platform. Complete MERN stack with certified GST invoices, Razorpay integration, and four authenticated roles.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Popular Destinations</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => { setActiveTab('explore'); }} className="hover:text-amber-400">Udaipur Lake Palaces</button></li>
                <li><button onClick={() => { setActiveTab('explore'); }} className="hover:text-amber-400">Goa Azure Beach Resorts</button></li>
                <li><button onClick={() => { setActiveTab('explore'); }} className="hover:text-amber-400">Jaipur Heritage Haveli</button></li>
                <li><button onClick={() => { setActiveTab('explore'); }} className="hover:text-amber-400">Mumbai Marine Drive Suites</button></li>
                <li><button onClick={() => { setActiveTab('explore'); }} className="hover:text-amber-400">Munnar Misty Hills Tea Retreats</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Compliance & Taxation</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>SAC Code: 9963 (Accommodation)</li>
                <li>CGST (6% or 9%) & SGST (6% or 9%)</li>
                <li>Sec 31 CGST Act 2017 compliant Tax Invoices</li>
                <li>Aadhaar / Indian Govt ID check-in verification</li>
                <li>Razorpay 256-bit encrypted gateway</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Concierge & Helpline</h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-1.5 text-white">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                  <span>+91 1800 209 8888 (Toll Free)</span>
                </p>
                <p className="flex items-center gap-1.5 text-white">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>reservations@hotelpro.in</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Customer Assistance Available 24x7 across all Indian Standard Time zones (IST).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 HotelPro India Systems. Academic Full-Stack Engineering Portfolio.
            </div>
            <div className="flex items-center gap-4">
              <span>MERN Stack Architecture</span>
              <span>•</span>
              <span>Node.js / Express</span>
              <span>•</span>
              <span>React 19 & Vite</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HotelProProvider>
      <HotelProAppContent />
    </HotelProProvider>
  );
}
