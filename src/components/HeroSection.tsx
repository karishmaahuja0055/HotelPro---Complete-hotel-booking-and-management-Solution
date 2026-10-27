import React from 'react';
import { useHotelPro } from '../context/HotelProContext';
import { Search, MapPin, Calendar, Users, Sparkles, Award } from 'lucide-react';

interface HeroSectionProps {
  onSearchSubmit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit }) => {
  const {
    searchCity,
    setSearchCity,
    searchCheckIn,
    setSearchCheckIn,
    searchCheckOut,
    setSearchCheckOut,
    searchGuests,
    setSearchGuests,
  } = useHotelPro();

  const indianDestinations = [
    'All Destinations',
    'Udaipur',
    'Goa',
    'Jaipur',
    'Mumbai',
    'Munnar',
    'Bengaluru',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background with luxury palace & beach imagery overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&auto=format&fit=crop&q=80"
          alt="Indian Luxury Palace Resort"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>India’s Premier Heritage & Business Stays</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Experience Royal Indian <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              Hospitality & Serenity
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From majestic Mewari lake palaces and sun-kissed Goan beach villas to misty Western Ghats tea retreats and high-tech Silicon Valley suites. All rates in Indian Rupees with certified GST invoices.
          </p>
        </div>

        {/* Floating Search Engine Box */}
        <div className="mt-10 max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/50 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Destination Selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> Destination
              </label>
              <select
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              >
                {indianDestinations.map(city => (
                  <option key={city} value={city}>
                    {city === 'All Destinations' ? 'All India (Explore All)' : `${city}, India`}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-In Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Check-In
              </label>
              <input
                type="date"
                value={searchCheckIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setSearchCheckIn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                required
              />
            </div>

            {/* Check-Out Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Check-Out
              </label>
              <input
                type="date"
                value={searchCheckOut}
                min={searchCheckIn || new Date().toISOString().split('T')[0]}
                onChange={e => setSearchCheckOut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                required
              />
            </div>

            {/* Guests & Search Button */}
            <div className="space-y-1 flex flex-col justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" /> Guests
              </label>
              <div className="flex gap-2">
                <select
                  value={searchGuests}
                  onChange={e => setSearchGuests(Number(e.target.value))}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>

                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-sm px-4 py-2.5 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/30 transition-all cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Destination Pill Highlights */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Sparkles className="w-3 h-3" /> Popular Destinations:
            </span>
            {['Udaipur', 'Goa', 'Jaipur', 'Mumbai', 'Munnar', 'Bengaluru'].map(dest => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  setSearchCity(dest);
                  onSearchSubmit();
                }}
                className={`px-3 py-1 rounded-full transition-all ${
                  searchCity === dest
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
