/**
 * Indian Hospitality Pricing and GST Calculation Engine
 * Service Accounting Code (SAC): 9963 (Accommodation services)
 */

export interface PriceBreakdown {
  nights: number;
  roomsCount: number;
  basePricePerNight: number;
  grossRoomTariff: number; // base * nights * rooms
  discountAmount: number;
  netTaxableAmount: number;
  gstRate: number; // 0.12 or 0.18
  cgstAmount: number;
  sgstAmount: number;
  totalGst: number;
  grandTotal: number;
  sacCode: string;
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  // Normalize to UTC midnight to avoid DST issues
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diffTime = utcEnd - utcStart;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
}

export function calculateHotelBookingPrice(
  basePricePerNight: number,
  checkIn: string | Date,
  checkOut: string | Date,
  roomsCount: number = 1,
  discountPercentage: number = 0
): PriceBreakdown {
  const nights = calculateNights(checkIn, checkOut);
  const safeRooms = Math.max(1, roomsCount);
  const safeBasePrice = Math.max(0, basePricePerNight);
  
  const grossRoomTariff = safeBasePrice * nights * safeRooms;
  const safeDiscountPct = Math.min(100, Math.max(0, discountPercentage));
  const discountAmount = Math.round(grossRoomTariff * (safeDiscountPct / 100));
  const netTaxableAmount = Math.max(0, grossRoomTariff - discountAmount);
  
  // Under Indian GST laws for Hotel Accommodations:
  // Tariff <= 7500 per room per night: 12% GST
  // Tariff > 7500 per room per night: 18% GST
  const effectiveNightlyRatePerRoom = safeBasePrice * (1 - safeDiscountPct / 100);
  const gstRate = effectiveNightlyRatePerRoom > 7500 ? 0.18 : 0.12;
  
  const totalGst = Math.round(netTaxableAmount * gstRate);
  const cgstAmount = Math.round(totalGst / 2);
  const sgstAmount = totalGst - cgstAmount;
  const grandTotal = netTaxableAmount + totalGst;
  
  return {
    nights,
    roomsCount: safeRooms,
    basePricePerNight: safeBasePrice,
    grossRoomTariff,
    discountAmount,
    netTaxableAmount,
    gstRate,
    cgstAmount,
    sgstAmount,
    totalGst,
    grandTotal,
    sacCode: '9963',
  };
}
