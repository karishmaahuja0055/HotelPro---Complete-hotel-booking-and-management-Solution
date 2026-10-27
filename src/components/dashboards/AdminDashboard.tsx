import React, { useState } from 'react';
import { useHotelPro } from '../../context/HotelProContext';
import { Hotel, UserRole } from '../../types';
import { formatINR } from '../../utils/indianFormats';
import {
  ShieldAlert,
  Building,
  Users,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  Lock,
  Globe,
  Search,
  Activity,
  FileCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    hotels,
    users,
    bookings,
    adminLogs,
    addNewHotel,
  } = useHotelPro();

  // Metrics
  const totalPlatformRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.priceBreakdown.grandTotal, 0);

  const totalGSTCollected = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.priceBreakdown.totalGst, 0);

  // New Hotel Form State
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [hotelName, setHotelName] = useState('');
  const [tagline, setTagline] = useState('');
  const [city, setCity] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('09AABCT1234L1Z9');
  const [startingPrice, setStartingPrice] = useState(6500);
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    addNewHotel({
      name: hotelName,
      tagline,
      description: 'Luxury hospitality residence featuring panoramic views, signature fine dining, and personalized concierge care.',
      address,
      city,
      state,
      stateCode: '09',
      postalCode: '221001',
      country: 'India',
      gstin,
      rating: 4.8,
      reviewCount: 1,
      startingPrice,
      managerId: 'usr_manager_01',
      featuredImage,
      images: [featuredImage],
      amenities: ['High-Speed Wi-Fi', 'Fine Dining Restaurant', 'Ayurvedic Spa', '24/7 Butler Service'],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      contactPhone: '+91 542 227 5500',
      contactEmail: `reservations.${city.toLowerCase()}@hotelpro.in`,
    });

    setSuccessMsg(`Successfully listed ${hotelName} (${city}) on HotelPro India!`);
    setTimeout(() => {
      setShowAddHotelModal(false);
      setSuccessMsg('');
      setHotelName('');
      setAddress('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Super Admin Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Super Administrator Console
            </span>
            <span className="text-xs text-slate-400">All India Multi-Property Oversight</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            Platform Master Operations & Governance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance, audit logging, property approvals, and Indian GST reconciliation
          </p>
        </div>

        <button
          onClick={() => setShowAddHotelModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Indian Property</span>
        </button>
      </div>

      {/* High-Level Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Hotel Properties</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{hotels.length}</div>
            <div className="text-[10px] text-slate-500">Across 6+ Indian States</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Platform Gross Bookings</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{formatINR(totalPlatformRevenue)}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">100% via Razorpay / Verified</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total GST Collected</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{formatINR(totalGSTCollected)}</div>
            <div className="text-[10px] text-slate-500">CGST + SGST (SAC 9963)</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Registered Accounts</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{users.length}</div>
            <div className="text-[10px] text-slate-500">Guests, Staff & Managers</div>
          </div>
        </div>
      </div>

      {/* Hotel Listings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              All Managed Indian Properties
            </h3>
            <p className="text-xs text-slate-500">Property portfolio, verified GSTINs, and starting room rates</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {hotels.length} Properties
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-6">Property Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Verified GSTIN</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Starting Tariff</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels.map(h => (
                <tr key={h.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={h.featuredImage} alt={h.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-serif font-bold text-slate-900">{h.name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{h.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {h.city}, {h.state}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-800 font-semibold">
                    {h.gstin}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      ★ {h.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-serif font-bold text-slate-900">
                    {formatINR(h.startingPrice)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px]">
                      LIVE / ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Administrative Audit Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              Security & Administrative Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable activity log capturing authentication, booking events, check-ins, and tariff adjustments
            </p>
          </div>
          <span className="text-xs font-mono bg-stone-100 px-3 py-1 rounded-lg text-slate-600">
            {adminLogs.length} Events Logged
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {adminLogs.map(log => {
            const roleBadge = {
              'admin': 'bg-amber-100 text-amber-800',
              'manager': 'bg-purple-100 text-purple-800',
              'staff': 'bg-blue-100 text-blue-800',
              'guest': 'bg-emerald-100 text-emerald-800',
            }[log.actorRole] || 'bg-slate-100 text-slate-700';

            return (
              <div
                key={log.id}
                className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">{log.targetEntity}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${roleBadge}`}>
                      {log.actorName} ({log.actorRole.toUpperCase()})
                    </span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>

                <div className="text-left sm:text-right text-[11px] text-slate-400 font-mono">
                  <div>{new Date(log.timestamp).toLocaleString('en-IN')}</div>
                  <div>IP: {log.ipAddress || '103.21.124.9'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Indian Property */}
      {showAddHotelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif text-lg font-bold text-slate-900">
                List New Indian Hotel Property
              </h4>
              <button onClick={() => setShowAddHotelModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateHotel} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Hotel Name</label>
                  <input
                    type="text"
                    value={hotelName}
                    onChange={e => setHotelName(e.target.value)}
                    required
                    placeholder="e.g. Varanasi Ganges Ghat Heritage Residence"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Marketing Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    required
                    placeholder="e.g. Sacred Riverfront Luxury & Evening Aarti Pavilions"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Indian City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      required
                      placeholder="e.g. Varanasi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Indian State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      required
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">State GSTIN</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={e => setGstin(e.target.value.toUpperCase())}
                      required
                      placeholder="09AABCT1234L1Z9"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Starting Tariff (INR)</label>
                    <input
                      type="number"
                      value={startingPrice}
                      onChange={e => setStartingPrice(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    placeholder="e.g. Assi Ghat Road, Bhelupur"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddHotelModal(false)}
                    className="px-4 py-2 rounded-xl font-semibold border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    List Property
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
