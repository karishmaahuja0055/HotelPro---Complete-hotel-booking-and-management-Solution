import React, { useState } from 'react';
import { useHotelPro } from '../../context/HotelProContext';
import { RoomCategory, RoomOperationalStatus } from '../../types';
import { formatINR } from '../../utils/indianFormats';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Percent,
  Bed,
  IndianRupee,
  Layers,
  Sparkles,
  Edit3,
  Check,
  Building,
  AlertCircle,
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const {
    currentUser,
    hotels,
    categories,
    rooms,
    bookings,
    updateCategoryTariff,
    updateRoomStatus,
  } = useHotelPro();

  // Manager's assigned hotel
  const assignedHotelId = currentUser.hotelId || 'htl_udaipur_01';
  const assignedHotel = hotels.find(h => h.id === assignedHotelId) || hotels[0];

  const hotelRooms = rooms.filter(r => r.hotelId === assignedHotelId);
  const hotelCategories = categories.filter(c => c.hotelId === assignedHotelId);
  const hotelBookings = bookings.filter(b => b.hotelId === assignedHotelId);

  // Metrics
  const totalGrossRevenue = hotelBookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.priceBreakdown.grandTotal, 0);

  const occupiedRoomsCount = hotelRooms.filter(r => r.operationalStatus === 'Occupied').length;
  const occupancyRate = hotelRooms.length > 0 ? Math.round((occupiedRoomsCount / hotelRooms.length) * 100) : 0;
  const availableRoomsCount = hotelRooms.filter(r => r.operationalStatus === 'Available').length;

  // Tariff Editing state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedTariff, setEditedTariff] = useState<number>(0);
  const [tariffFeedback, setTariffFeedback] = useState('');

  // Recharts Monthly Revenue Mock Data
  const monthlyRevenueData = [
    { month: 'Jun', revenue: 420000 },
    { month: 'Jul', revenue: 380000 },
    { month: 'Aug', revenue: 490000 },
    { month: 'Sep', revenue: 560000 },
    { month: 'Oct', revenue: totalGrossRevenue > 0 ? totalGrossRevenue : 680000 },
    { month: 'Nov (Proj)', revenue: 750000 },
  ];

  // Room Status Distribution for PieChart
  const roomStatusData = [
    { name: 'Available', value: hotelRooms.filter(r => r.operationalStatus === 'Available').length, color: '#10b981' },
    { name: 'Occupied', value: hotelRooms.filter(r => r.operationalStatus === 'Occupied').length, color: '#3b82f6' },
    { name: 'Cleaning', value: hotelRooms.filter(r => r.operationalStatus === 'Cleaning').length, color: '#f59e0b' },
    { name: 'Maintenance', value: hotelRooms.filter(r => r.operationalStatus === 'Maintenance').length, color: '#ef4444' },
  ];

  const handleSaveTariff = (catId: string) => {
    if (editedTariff > 0) {
      updateCategoryTariff(catId, editedTariff);
      setEditingCategoryId(null);
      setTariffFeedback('Base tariff updated successfully!');
      setTimeout(() => setTariffFeedback(''), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Manager Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40">
              General Manager Operations Portal
            </span>
            <span className="text-xs text-slate-400">Hospitality Property:</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            {assignedHotel.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {assignedHotel.city}, {assignedHotel.state} • GSTIN: <span className="font-mono">{assignedHotel.gstin}</span>
          </p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs text-slate-400">Total Hotel Revenue (Bookings)</div>
          <div className="font-serif text-3xl font-bold text-amber-400">
            {formatINR(totalGrossRevenue)}
          </div>
        </div>
      </div>

      {tariffFeedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{tariffFeedback}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Reservations</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{hotelBookings.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">+18% this month</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Occupancy Rate</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{occupancyRate}%</div>
            <div className="text-[10px] text-slate-500 font-medium">Target: 75%</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Available Rooms</div>
            <div className="text-2xl font-bold font-serif text-slate-900">{availableRoomsCount}</div>
            <div className="text-[10px] text-slate-500 font-medium">out of {hotelRooms.length} total</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Average Daily Rate (ADR)</div>
            <div className="text-2xl font-bold font-serif text-slate-900">
              {formatINR(hotelCategories[0]?.basePrice || 14500)}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">Healthy Yield</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Monthly Hospitality Revenue Trend (INR)
              </h3>
              <p className="text-xs text-slate-500">Gross revenue performance across rooms & suites</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-lg text-slate-700">
              FY 2026-27
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val: number) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value) || 0), 'Gross Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Operational Distribution Donut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900">Room Status Distribution</h3>
            <p className="text-xs text-slate-500">Current live operational status</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} rooms`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-center text-slate-500 border-t border-slate-100 pt-3">
            Real-time status synchronized with front desk & housekeeping.
          </div>
        </div>
      </div>

      {/* Room Inventory & Operational Status Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Live Room Inventory Status Grid
            </h3>
            <p className="text-xs text-slate-500">
              Click status badges to manually adjust operational states (e.g. for maintenance or inspection)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Occupied</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Maintenance</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {hotelRooms.map(room => {
            const statusConfig = {
              'Available': { bg: 'bg-emerald-50 border-emerald-300 text-emerald-900', dot: 'bg-emerald-500' },
              'Occupied': { bg: 'bg-blue-50 border-blue-300 text-blue-900', dot: 'bg-blue-500' },
              'Cleaning': { bg: 'bg-amber-50 border-amber-300 text-amber-900', dot: 'bg-amber-500' },
              'Maintenance': { bg: 'bg-red-50 border-red-300 text-red-900', dot: 'bg-red-500' },
            }[room.operationalStatus];

            return (
              <div
                key={room.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-2 ${statusConfig.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Room {room.roomNumber}</span>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                </div>

                <div className="text-[10px] truncate text-slate-600">
                  {room.currentGuestName ? `Guest: ${room.currentGuestName}` : `Floor ${room.floor}`}
                </div>

                {/* Status Switcher Select */}
                <select
                  value={room.operationalStatus}
                  onChange={e => updateRoomStatus(room.id, e.target.value as RoomOperationalStatus)}
                  className="w-full text-[10px] font-semibold bg-white border border-slate-300 rounded-lg px-1.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Category Tariff Rates Manager */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-amber-600" />
              Dynamic Room Category Tariffs & Seasonal Pricing
            </h3>
            <p className="text-xs text-slate-500">
              Update nightly base rates in Indian Rupees. GST (12% or 18%) applies automatically based on slab.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {hotelCategories.map(cat => (
            <div
              key={cat.id}
              className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-stone-50/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-slate-900">{cat.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                    {cat.categoryType}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {cat.bedType} • {cat.sizeSqFt} sq.ft • Max {cat.maxGuests} Guests • Total inventory: {cat.totalRooms} rooms
                </p>
                <div className="text-[11px] text-amber-800 font-medium">
                  Applicable GST Slab: {cat.basePrice > 7500 ? '18% GST (Luxury Slab)' : '12% GST (Standard Slab)'}
                </div>
              </div>

              {/* Price adjustment input */}
              <div className="flex items-center gap-3">
                {editingCategoryId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        value={editedTariff}
                        onChange={e => setEditedTariff(Number(e.target.value))}
                        className="pl-6 pr-3 py-1.5 w-32 text-xs font-bold border border-amber-500 rounded-xl focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveTariff(cat.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="px-2 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">Current Base Rate</div>
                      <div className="font-serif text-lg font-bold text-slate-900">
                        {formatINR(cat.basePrice)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCategoryId(cat.id);
                        setEditedTariff(cat.basePrice);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-stone-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Adjust Tariff</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
