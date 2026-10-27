import React from 'react';
import { Hotel } from '../types';
import { formatINR } from '../utils/indianFormats';
import { Star, MapPin, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col group">
      {/* Featured Photo with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={hotel.featuredImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* City and State Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{hotel.city}, {hotel.state}</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-md">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{hotel.rating.toFixed(1)}</span>
        </div>

        {/* Tagline overlay at bottom */}
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium drop-shadow-md truncate">
          {hotel.tagline}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
              {hotel.name}
            </h3>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[11px] text-slate-400 px-1 py-1 font-medium">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price in ₹ and Book Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-slate-900">
                {formatINR(hotel.startingPrice)}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
            <div className="text-[10px] text-amber-700 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> SAC 9963 (+ GST)
            </div>
          </div>

          <button
            onClick={() => onSelect(hotel)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm group/btn cursor-pointer"
          >
            <span>View Rooms</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
