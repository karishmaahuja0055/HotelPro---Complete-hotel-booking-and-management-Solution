import React, { useState } from 'react';
import { useHotelPro } from '../../context/HotelProContext';
import { Booking, HousekeepingTask, ServiceRequest, IdProofType, HousekeepingStatus } from '../../types';
import { formatIndianDate } from '../../utils/indianFormats';
import {
  UserCheck,
  LogOut,
  Sparkles,
  BedDouble,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  KeyRound,
  Utensils,
  ChevronRight,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const {
    currentUser,
    hotels,
    bookings,
    rooms,
    housekeeping,
    serviceRequests,
    processCheckIn,
    processCheckOut,
    updateHousekeepingStatus,
    updateServiceRequestStatus,
    updateRoomStatus,
  } = useHotelPro();

  // Assigned hotel
  const assignedHotelId = currentUser.hotelId || 'htl_udaipur_01';
  const assignedHotel = hotels.find(h => h.id === assignedHotelId) || hotels[0];

  // Filter bookings for this hotel
  const hotelBookings = bookings.filter(b => b.hotelId === assignedHotelId);
  const hotelRooms = rooms.filter(r => r.hotelId === assignedHotelId);
  const hotelHousekeeping = housekeeping.filter(h => h.hotelId === assignedHotelId);
  const hotelServices = serviceRequests.filter(s => s.hotelId === assignedHotelId);

  // Today's queues
  const arrivalsQueue = hotelBookings.filter(b => b.bookingStatus === 'Confirmed');
  const departuresQueue = hotelBookings.filter(b => b.bookingStatus === 'Checked-in');

  // Check-in modal state
  const [checkInBooking, setCheckInBooking] = useState<Booking | null>(null);
  const [idProofType, setIdProofType] = useState<IdProofType>('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('XXXX-XXXX-4819');
  const [keyCard, setKeyCard] = useState('KC-104');

  // Checkout modal state
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [extraCharges, setExtraCharges] = useState(0);
  const [rating, setRating] = useState(5);
  const [actionSuccess, setActionSuccess] = useState('');

  const handleExecuteCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInBooking) return;

    processCheckIn(checkInBooking.id, {
      idProofType,
      idProofNumber,
      keyCardAssigned: keyCard,
    });

    setActionSuccess(`Check-in complete for ${checkInBooking.guestName}! Room key issued.`);
    setTimeout(() => {
      setCheckInBooking(null);
      setActionSuccess('');
    }, 1500);
  };

  const handleExecuteCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkOutBooking) return;

    processCheckOut(checkOutBooking.id, {
      additionalChargesInr: extraCharges,
      feedbackRating: rating,
    });

    setActionSuccess(`Check-out recorded for Room ${checkOutBooking.roomNumber}. Cleaning task spawned!`);
    setTimeout(() => {
      setCheckOutBooking(null);
      setActionSuccess('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Front Desk Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
              Front Desk & Housekeeping Console
            </span>
            <span className="text-xs text-slate-400">Assigned Property:</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            {assignedHotel.name} ({assignedHotel.city})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Staff Operator: <strong>{currentUser.name}</strong> • {currentUser.department}
          </p>
        </div>

        {/* Quick Room Count Status */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-xs">
          <div className="text-center px-3 border-r border-slate-700">
            <div className="text-emerald-400 font-bold text-lg">
              {hotelRooms.filter(r => r.operationalStatus === 'Available').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase">Available</div>
          </div>
          <div className="text-center px-3 border-r border-slate-700">
            <div className="text-blue-400 font-bold text-lg">
              {hotelRooms.filter(r => r.operationalStatus === 'Occupied').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase">Occupied</div>
          </div>
          <div className="text-center px-3">
            <div className="text-amber-400 font-bold text-lg">
              {hotelRooms.filter(r => r.operationalStatus === 'Cleaning').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase">Cleaning</div>
          </div>
        </div>
      </div>

      {/* Arrival & Departure Front Desk Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-700" />
              <h3 className="font-serif text-base font-bold text-slate-900">
                Today's Arrivals Queue ({arrivalsQueue.length})
              </h3>
            </div>
            <span className="text-[11px] text-blue-800 font-medium">Verify Govt ID & Key Issue</span>
          </div>

          <div className="p-4 flex-1 space-y-3">
            {arrivalsQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No pending arrivals for today. All guests checked in!
              </div>
            ) : (
              arrivalsQueue.map(bkg => (
                <div
                  key={bkg.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{bkg.guestName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                        {bkg.bookingReference}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Category: <strong>{bkg.categoryName}</strong> • {bkg.guestsCount} Guests • {bkg.nights}N
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{bkg.guestPhone}</div>
                  </div>

                  <button
                    onClick={() => { setCheckInBooking(bkg); setActionSuccess(''); }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Check-In</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Departures Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif text-base font-bold text-slate-900">
                Occupied & Departures ({departuresQueue.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">Auto-creates Cleaning Task</span>
          </div>

          <div className="p-4 flex-1 space-y-3">
            {departuresQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No occupied rooms currently checked in.
              </div>
            ) : (
              departuresQueue.map(bkg => (
                <div
                  key={bkg.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Room {bkg.roomNumber}
                      </span>
                      <span className="font-semibold text-xs text-slate-900">{bkg.guestName}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Check-out Date: {formatIndianDate(bkg.checkOut)} ({bkg.nights}N)
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{bkg.bookingReference}</div>
                  </div>

                  <button
                    onClick={() => { setCheckOutBooking(bkg); setActionSuccess(''); }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Check-Out</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Housekeeping Tasks Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Housekeeping & Room Sanitation Tasks
            </h3>
            <p className="text-xs text-slate-500">
              When cleaning is marked 'Completed', room automatically resets to 'Available' for new guests
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {hotelHousekeeping.filter(t => t.status !== 'Completed').length} Pending Tasks
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {hotelHousekeeping.map(task => {
            const priorityColors = {
              'Urgent': 'bg-red-100 text-red-800 border-red-200',
              'High': 'bg-amber-100 text-amber-800 border-amber-200',
              'Medium': 'bg-blue-100 text-blue-800 border-blue-200',
              'Low': 'bg-slate-100 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={task.id}
                className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                      Room {task.roomNumber}
                    </span>
                    <span className="font-semibold text-xs text-slate-900">{task.taskType}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{task.notes}</p>
                  <div className="text-[11px] text-slate-400">
                    Assigned to: <strong>{task.assignedStaffName}</strong> • Created at {new Date(task.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateHousekeepingStatus(task.id, 'In Progress')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      task.status === 'In Progress'
                        ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 text-slate-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() => updateHousekeepingStatus(task.id, 'Completed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      task.status === 'Completed'
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 text-slate-700 border-stone-200 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    ✓ Mark Cleaned & Ready
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest Service Requests Console */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              In-Room Service & Concierge Orders
            </h3>
            <p className="text-xs text-slate-500">Live guest requests for room dining, Ayurvedic amenities, and cabs</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {hotelServices.map(req => (
            <div
              key={req.id}
              className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                    Room {req.roomNumber}
                  </span>
                  <span className="font-semibold text-xs text-slate-900">{req.serviceType}</span>
                  <span className="text-[11px] text-slate-500">• Guest: {req.guestName}</span>
                </div>
                <p className="text-xs text-slate-600">{req.notes}</p>
                <div className="text-[11px] text-slate-400 font-mono">Contact: {req.guestPhone}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateServiceRequestStatus(req.id, 'In Progress')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    req.status === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-slate-700'
                  }`}
                >
                  Preparing / Out for Delivery
                </button>
                <button
                  onClick={() => updateServiceRequestStatus(req.id, 'Completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    req.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-slate-700'
                  }`}
                >
                  ✓ Fulfilled
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Process Indian Check-in */}
      {checkInBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-900">
                  Guest Arrival & Check-In Verification
                </h4>
                <p className="text-xs text-slate-500">Ref: {checkInBooking.bookingReference}</p>
              </div>
              <button onClick={() => setCheckInBooking(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {actionSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteCheckIn} className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div><strong>Guest:</strong> {checkInBooking.guestName}</div>
                  <div><strong>Category:</strong> {checkInBooking.categoryName}</div>
                  <div><strong>Period:</strong> {checkInBooking.checkIn} to {checkInBooking.checkOut} ({checkInBooking.nights}N)</div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Indian Govt ID Verification Type</label>
                  <select
                    value={idProofType}
                    onChange={e => setIdProofType(e.target.value as IdProofType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (UIDAI Verified)</option>
                    <option value="Passport">Indian Passport</option>
                    <option value="Voter ID">Voter Election ID</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ID Proof Number (Masked)</label>
                  <input
                    type="text"
                    value={idProofNumber}
                    onChange={e => setIdProofNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    placeholder="XXXX-XXXX-4819"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Assign Key Card #</label>
                  <input
                    type="text"
                    value={keyCard}
                    onChange={e => setKeyCard(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    placeholder="KC-104"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckInBooking(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirm & Complete Check-In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Process Check-Out */}
      {checkOutBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-900">
                  Process Guest Departure & Check-Out
                </h4>
                <p className="text-xs text-slate-500">Room {checkOutBooking.roomNumber} • {checkOutBooking.guestName}</p>
              </div>
              <button onClick={() => setCheckOutBooking(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {actionSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteCheckOut} className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  Completing checkout will release <strong>Room {checkOutBooking.roomNumber}</strong>, transition its status to <em>Cleaning</em>, and trigger an automated housekeeping sanitization order.
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Guest Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Additional Incidentals / Charges (INR)</label>
                  <input
                    type="number"
                    value={extraCharges}
                    onChange={e => setExtraCharges(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    placeholder="₹0"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckOutBooking(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Complete Checkout
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
