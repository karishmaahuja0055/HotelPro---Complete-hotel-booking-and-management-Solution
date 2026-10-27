import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { formatINR } from '../utils/indianFormats';
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  hotelName: string;
  categoryName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (paymentId: string, paymentMethod: any) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  hotelName,
  categoryName,
  customerName,
  customerPhone,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'payathotel'>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedId = `pay_rzp_ind_${Math.floor(10000000 + Math.random() * 90000000)}`;
      
      // Fire festive celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      let method = 'Razorpay UPI';
      if (activeTab === 'card') method = 'Razorpay Card';
      if (activeTab === 'netbanking') method = `NetBanking (${selectedBank})`;
      if (activeTab === 'payathotel') method = 'Pay at Hotel';

      onPaymentSuccess(generatedId, method);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between border-b border-blue-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white flex items-center">
                Razorpay
                <span className="text-blue-400 font-extrabold ml-1">Secure</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700">
                INR Payments
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Paying <span className="font-semibold text-white">{hotelName}</span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-blue-300">Total Amount</div>
            <div className="font-bold text-xl text-amber-400">{formatINR(amount)}</div>
          </div>
        </div>

        {/* Security Bar */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-5 py-2 flex items-center justify-between text-xs text-blue-900">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-bit SSL Encrypted & RBI Compliant
          </span>
          <span className="text-[11px] text-slate-500">{customerPhone}</span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
          <button
            onClick={() => setActiveTab('upi')}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upi'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'card'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'netbanking'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>NetBanking</span>
          </button>

          <button
            onClick={() => setActiveTab('payathotel')}
            className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'payathotel'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Pay at Hotel</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 flex-1 space-y-4 min-h-[220px]">
          {activeTab === 'upi' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Select UPI App:</span>
                <span className="text-emerald-600 text-[11px] font-semibold">Zero Surcharge</span>
              </div>

              {/* UPI app logos representation */}
              <div className="grid grid-cols-4 gap-2">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                  <div
                    key={app}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-center hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all"
                  >
                    <div className="text-xs font-bold text-slate-800">{app}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-slate-600">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant payment confirmation with automated GST Tax Invoice generation.</span>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Card Number (RuPay, Visa, Mastercard)</label>
                <input
                  type="text"
                  defaultValue="4532 •••• •••• 8912"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    defaultValue="08/29"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">CVV</label>
                  <input
                    type="password"
                    defaultValue="•••"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue={customerName}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-600">Select Indian Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'State Bank of India (SBI)',
                  'HDFC Bank',
                  'ICICI Bank',
                  'Axis Bank',
                  'Punjab National Bank',
                  'Kotak Mahindra Bank',
                ].map(bank => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payathotel' && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs text-amber-900">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Guaranteed Reservation with Pay at Check-in
              </h4>
              <p>
                Your room will be held guaranteed. You can pay {formatINR(amount)} via UPI, Cash, or Credit Card directly at the front desk upon arrival.
              </p>
              <p className="text-[11px] text-amber-800">
                A valid Indian Government photo ID will be required at check-in.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Pay CTA and cancel */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing via Razorpay Gateway...
              </span>
            ) : (
              <>
                <span>
                  {activeTab === 'payathotel' ? 'Confirm Pay-at-Hotel Reservation' : `Pay ${formatINR(amount)}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
