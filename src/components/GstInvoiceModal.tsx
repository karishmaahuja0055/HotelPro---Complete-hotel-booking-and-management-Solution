import React from 'react';
import { Booking } from '../types';
import { formatINR, formatIndianDate } from '../utils/indianFormats';
import { X, Printer, ShieldCheck, Download, Building2 } from 'lucide-react';

interface GstInvoiceModalProps {
  booking: Booking | null;
  onClose: () => void;
}

// Convert numbers into Indian Rupee words (e.g. 48764 -> Rupees Forty-Eight Thousand Seven Hundred Sixty-Four Only)
function numberToIndianWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Rupees Zero Only';

  const inWords = (n: number): string => {
    let str = '';
    if (n > 9999999) {
      str += inWords(Math.floor(n / 10000000)) + 'Crore ';
      n %= 10000000;
    }
    if (n > 99999) {
      str += inWords(Math.floor(n / 100000)) + 'Lakh ';
      n %= 100000;
    }
    if (n > 999) {
      str += inWords(Math.floor(n / 1000)) + 'Thousand ';
      n %= 1000;
    }
    if (n > 99) {
      str += inWords(Math.floor(n / 100)) + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
      }
    }
    return str;
  };

  return `Rupees ${inWords(Math.round(num)).trim()} Only`;
}

export const GstInvoiceModal: React.FC<GstInvoiceModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-IND-${booking.bookingReference.replace('HP-IND-', '')}`;
  const invoiceDate = formatIndianDate(booking.createdAt);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base">GST Tax Invoice Preview</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
              SAC 9963
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div id="gst-invoice-printable" className="p-8 sm:p-10 overflow-y-auto font-sans text-slate-900 text-xs bg-white">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0">
                <Building2 className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                  {booking.hotelName}
                </h1>
                <p className="text-slate-600 text-xs mt-0.5">{booking.hotelAddress}, {booking.hotelCity}, India</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-1">
                  <span><strong>GSTIN:</strong> {booking.hotelGstin}</span>
                  <span><strong>State:</strong> {booking.hotelCity}</span>
                  <span><strong>SAC Code:</strong> 9963</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-sm tracking-wider uppercase rounded">
                Tax Invoice
              </span>
              <p className="text-[11px] text-slate-500 mt-1.5">(Issued under Sec 31 of CGST Act, 2017)</p>
              <div className="mt-2 space-y-0.5">
                <div className="font-mono font-bold text-slate-800">Invoice No: {invoiceNumber}</div>
                <div className="text-slate-600">Date: {invoiceDate}</div>
              </div>
            </div>
          </div>

          {/* Guest and Booking Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-stone-50 border border-stone-200 mb-6">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-500 mb-1.5">
                Billed To (Guest Details)
              </h3>
              <p className="font-bold text-sm text-slate-900">{booking.guestName}</p>
              <p className="text-slate-600">{booking.guestEmail}</p>
              <p className="text-slate-600 font-mono">{booking.guestPhone}</p>
              <p className="text-slate-600">{booking.guestCity || 'India'}</p>
              {booking.guestGstin && (
                <p className="mt-1 font-mono font-bold text-amber-800">
                  Recipient GSTIN: {booking.guestGstin} (B2B Credit)
                </p>
              )}
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-500 mb-1.5">
                Stay & Booking Specifics
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{booking.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Category:</span>
                  <span className="font-semibold text-slate-900">{booking.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Room:</span>
                  <span className="font-bold text-slate-900">{booking.roomNumber ? `Room ${booking.roomNumber}` : 'Allocated at Check-in'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Period of Stay:</span>
                  <span className="font-semibold text-slate-900">
                    {formatIndianDate(booking.checkIn)} to {formatIndianDate(booking.checkOut)} ({booking.nights} Nights)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {booking.paymentStatus.toUpperCase()} ({booking.paymentMethod})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Services</th>
                  <th className="py-2.5 px-2 text-center">SAC</th>
                  <th className="py-2.5 px-2 text-center">Nights</th>
                  <th className="py-2.5 px-3 text-right">Tariff / Night</th>
                  <th className="py-2.5 px-3 text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-500">1</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">
                      Hotel Room Accommodation - {booking.categoryName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {booking.hotelName} ({booking.hotelCity}) • {booking.guestsCount} Guests
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono">9963</td>
                  <td className="py-3 px-2 text-center font-semibold">{booking.nights}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    {formatINR(booking.priceBreakdown.basePricePerNight)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    {formatINR(booking.priceBreakdown.grossRoomTariff)}
                  </td>
                </tr>

                {booking.priceBreakdown.discountAmount > 0 && (
                  <tr className="bg-emerald-50/50 text-emerald-800">
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3 font-medium">
                      Less: Hospitality Promo Discount (NAMASTE10)
                    </td>
                    <td className="py-2 px-2 text-center">-</td>
                    <td className="py-2 px-2 text-center">-</td>
                    <td className="py-2 px-3 text-right font-mono">-</td>
                    <td className="py-2 px-3 text-right font-mono">
                      -{formatINR(booking.priceBreakdown.discountAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation Matrix */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-4 mb-6">
            <div className="space-y-2 flex-1">
              <div className="text-xs text-slate-600">
                <strong>Amount in Words:</strong> <br />
                <span className="font-serif italic font-semibold text-slate-900">
                  {numberToIndianWords(booking.priceBreakdown.grandTotal)}
                </span>
              </div>

              {booking.razorpayPaymentId && (
                <div className="text-[11px] text-slate-500 font-mono">
                  Gateway Transaction ID: {booking.razorpayPaymentId}
                </div>
              )}

              <div className="p-2.5 bg-stone-100 rounded-lg text-[10px] text-slate-600">
                <strong>Declaration:</strong> We declare that this invoice shows the actual price of the services described and that all particulars are true and correct. Hotel room accommodation is taxable under SAC 9963 as per GST Council notifications.
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Net Taxable Amount:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatINR(booking.priceBreakdown.netTaxableAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>CGST ({(booking.priceBreakdown.gstRate * 50).toFixed(0)}%):</span>
                <span className="font-mono">{formatINR(booking.priceBreakdown.cgstAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>SGST ({(booking.priceBreakdown.gstRate * 50).toFixed(0)}%):</span>
                <span className="font-mono">{formatINR(booking.priceBreakdown.sgstAmount)}</span>
              </div>

              <div className="flex justify-between font-bold border-t border-slate-300 pt-2 text-sm text-slate-900">
                <span>Total Invoice Value (INR):</span>
                <span className="font-serif text-base text-amber-700">
                  {formatINR(booking.priceBreakdown.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Thank you for staying with HotelPro.</p>
              <p className="text-[10px]">For queries: reservations@hotelpro.in | +91 1800 209 8888</p>
            </div>

            <div className="text-right">
              <div className="w-32 h-10 border-b border-dashed border-slate-400 mb-1 mx-auto flex items-end justify-center">
                <span className="font-serif italic text-[11px] text-slate-700 font-semibold">HotelPro Systems</span>
              </div>
              <p className="font-semibold text-slate-800">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">Digitally Generated Document</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
