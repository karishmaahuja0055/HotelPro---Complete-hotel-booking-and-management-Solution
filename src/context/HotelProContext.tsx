import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Hotel,
  RoomCategory,
  Room,
  Booking,
  HousekeepingTask,
  ServiceRequest,
  AdminLog,
  RoomOperationalStatus,
  HousekeepingStatus,
  IdProofType,
} from '../types';
import {
  SEED_USERS,
  SEED_HOTELS,
  SEED_ROOM_CATEGORIES,
  SEED_ROOMS,
  SEED_BOOKINGS,
  SEED_HOUSEKEEPING,
  SEED_SERVICE_REQUESTS,
  SEED_ADMIN_LOGS,
} from '../data/seedData';
import { generateBookingReference } from '../utils/indianFormats';

interface HotelProContextType {
  currentUser: User;
  users: User[];
  hotels: Hotel[];
  categories: RoomCategory[];
  rooms: Room[];
  bookings: Booking[];
  housekeeping: HousekeepingTask[];
  serviceRequests: ServiceRequest[];
  adminLogs: AdminLog[];
  searchCity: string;
  searchCheckIn: string;
  searchCheckOut: string;
  searchGuests: number;
  setSearchCity: (city: string) => void;
  setSearchCheckIn: (date: string) => void;
  setSearchCheckOut: (date: string) => void;
  setSearchGuests: (count: number) => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, password?: string) => boolean;
  logoutUser: () => void;
  createBooking: (newBookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt'>) => Booking;
  cancelBooking: (bookingId: string, reason: string) => boolean;
  requestRefund: (bookingId: string) => boolean;
  processCheckIn: (
    bookingId: string,
    details: { idProofType: IdProofType; idProofNumber: string; keyCardAssigned: string; notes?: string }
  ) => boolean;
  processCheckOut: (
    bookingId: string,
    details: { additionalChargesInr: number; feedbackRating: number; notes?: string }
  ) => boolean;
  updateRoomStatus: (roomId: string, status: RoomOperationalStatus) => void;
  createHousekeepingTask: (task: Omit<HousekeepingTask, 'id' | 'createdAt'>) => void;
  updateHousekeepingStatus: (taskId: string, status: HousekeepingStatus) => void;
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'requestedAt'>) => void;
  updateServiceRequestStatus: (requestId: string, status: 'Pending' | 'In Progress' | 'Completed') => void;
  updateCategoryTariff: (categoryId: string, newBasePrice: number) => void;
  addNewHotel: (hotelData: Omit<Hotel, 'id'>) => void;
  resetToDefaultData: () => void;
}

const STORAGE_KEY_PREFIX = 'hotelpro_v1_';

const HotelProContext = createContext<HotelProContextType | undefined>(undefined);

export const HotelProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved or seed data
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadInitial('users', SEED_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = loadInitial<User | null>('currentUser', null);
    return savedUser || SEED_USERS[0]; // Default Aarav Sharma (Guest)
  });
  const [hotels, setHotels] = useState<Hotel[]>(() => loadInitial('hotels', SEED_HOTELS));
  const [categories, setCategories] = useState<RoomCategory[]>(() => loadInitial('categories', SEED_ROOM_CATEGORIES));
  const [rooms, setRooms] = useState<Room[]>(() => loadInitial('rooms', SEED_ROOMS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadInitial('bookings', SEED_BOOKINGS));
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => loadInitial('housekeeping', SEED_HOUSEKEEPING));
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => loadInitial('services', SEED_SERVICE_REQUESTS));
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => loadInitial('adminLogs', SEED_ADMIN_LOGS));

  // Search state with sensible default Indian dates (next week)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutDay = new Date();
  checkoutDay.setDate(checkoutDay.getDate() + 4);

  const [searchCity, setSearchCity] = useState<string>('All Destinations');
  const [searchCheckIn, setSearchCheckIn] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [searchCheckOut, setSearchCheckOut] = useState<string>(checkoutDay.toISOString().split('T')[0]);
  const [searchGuests, setSearchGuests] = useState<number>(2);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'housekeeping', JSON.stringify(housekeeping));
  }, [housekeeping]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'services', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'adminLogs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  // Logging helper
  const addLog = (action: string, targetEntity: string, details: string) => {
    const newLog: AdminLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      targetEntity,
      details,
      ipAddress: '103.21.124.9 (India)',
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  // Switch Role
  const switchRole = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      addLog('ROLE_SWITCH', `User #${target.id}`, `Switched active session to role: ${role.toUpperCase()} (${target.name})`);
    }
  };

  // Login
  const loginUser = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      addLog('USER_LOGIN', `User #${found.id}`, `Successful authentication for ${found.name} (${found.role})`);
      return true;
    }
    return false;
  };

  // Logout
  const logoutUser = () => {
    const guest = users.find(u => u.role === 'guest') || users[0];
    setCurrentUser(guest);
  };

  // Create Booking
  const createBooking = (newBookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt'>): Booking => {
    const ref = generateBookingReference();
    const id = `bkg_${Date.now()}`;
    
    // Find available room for this category if possible
    const availableRoom = rooms.find(
      r => r.hotelId === newBookingData.hotelId &&
           r.categoryId === newBookingData.categoryId &&
           r.operationalStatus === 'Available'
    );
    const assignedRoomNumber = availableRoom ? availableRoom.roomNumber : undefined;

    const newBooking: Booking = {
      ...newBookingData,
      id,
      bookingReference: ref,
      roomNumber: assignedRoomNumber,
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    addLog(
      'BOOKING_CREATED',
      `Booking #${ref}`,
      `Reserved ${newBooking.categoryName} at ${newBooking.hotelName} for ₹${newBooking.priceBreakdown.grandTotal.toLocaleString('en-IN')}`
    );

    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string, reason: string): boolean => {
    let success = false;
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          success = true;
          return {
            ...b,
            bookingStatus: 'Cancelled',
            cancellationReason: reason,
            refundStatus: b.paymentStatus === 'Paid' ? 'Requested' : 'None',
          };
        }
        return b;
      })
    );
    if (success) {
      addLog('BOOKING_CANCELLED', `Booking #${bookingId}`, `Cancelled with reason: ${reason}`);
    }
    return success;
  };

  // Request Refund
  const requestRefund = (bookingId: string): boolean => {
    let success = false;
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          success = true;
          return {
            ...b,
            refundStatus: 'Processed',
            paymentStatus: 'Refunded',
          };
        }
        return b;
      })
    );
    if (success) {
      addLog('REFUND_PROCESSED', `Booking #${bookingId}`, `Refund processed back to customer source account via Razorpay`);
    }
    return success;
  };

  // Process Check-in (Front Desk)
  const processCheckIn = (
    bookingId: string,
    details: { idProofType: IdProofType; idProofNumber: string; keyCardAssigned: string; notes?: string }
  ): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    // Pick room or assign
    const targetRoom = rooms.find(
      r => r.hotelId === booking.hotelId &&
           (r.roomNumber === booking.roomNumber || (r.categoryId === booking.categoryId && r.operationalStatus === 'Available'))
    ) || rooms.find(r => r.hotelId === booking.hotelId && r.operationalStatus === 'Available');

    const roomNumberToUse = targetRoom ? targetRoom.roomNumber : (booking.roomNumber || '101');

    // Update booking
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, bookingStatus: 'Checked-in', roomNumber: roomNumberToUse } : b))
    );

    // Update room operational status to Occupied
    if (targetRoom) {
      setRooms(prev =>
        prev.map(r => (r.id === targetRoom.id ? { ...r, operationalStatus: 'Occupied', currentGuestName: booking.guestName, currentBookingId: booking.id } : r))
      );
    }

    addLog(
      'CHECK_IN_COMPLETED',
      `Booking #${booking.bookingReference}`,
      `Verified ${details.idProofType} for ${booking.guestName}. Assigned Room ${roomNumberToUse}, Keycard #${details.keyCardAssigned}`
    );

    return true;
  };

  // Process Check-Out (Front Desk / Staff)
  const processCheckOut = (
    bookingId: string,
    details: { additionalChargesInr: number; feedbackRating: number; notes?: string }
  ): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    // Update booking to Checked-out
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, bookingStatus: 'Checked-out' } : b))
    );

    // Free room and mark as 'Cleaning'
    const targetRoom = rooms.find(r => r.hotelId === booking.hotelId && r.roomNumber === booking.roomNumber);
    if (targetRoom) {
      setRooms(prev =>
        prev.map(r =>
          r.id === targetRoom.id
            ? { ...r, operationalStatus: 'Cleaning', currentGuestName: undefined, currentBookingId: undefined }
            : r
        )
      );

      // Auto-generate Housekeeping task for this room!
      const newHkTask: HousekeepingTask = {
        id: `hk_${Date.now()}`,
        hotelId: booking.hotelId,
        roomNumber: targetRoom.roomNumber,
        taskType: 'Post Checkout Cleaning',
        priority: 'High',
        status: 'Pending',
        assignedStaffId: 'usr_staff_01',
        assignedStaffName: 'Priya Verma',
        notes: `Guest checkout completed. Guest rating: ${details.feedbackRating}/5 stars. Perform deep sanitization, replace all linens and toiletries.`,
        createdAt: new Date().toISOString(),
      };
      setHousekeeping(prev => [newHkTask, ...prev]);
    }

    addLog(
      'CHECK_OUT_COMPLETED',
      `Booking #${booking.bookingReference}`,
      `Guest ${booking.guestName} completed checkout from Room ${booking.roomNumber}. Housekeeping cleaning task auto-assigned.`
    );

    return true;
  };

  // Update Room Status
  const updateRoomStatus = (roomId: string, status: RoomOperationalStatus) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            operationalStatus: status,
            lastCleanedAt: status === 'Available' ? new Date().toISOString() : r.lastCleanedAt,
          };
        }
        return r;
      })
    );
    addLog('ROOM_STATUS_CHANGED', `Room #${roomId}`, `Status updated to ${status}`);
  };

  // Housekeeping task management
  const createHousekeepingTask = (task: Omit<HousekeepingTask, 'id' | 'createdAt'>) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `hk_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHousekeeping(prev => [newTask, ...prev]);
    addLog('HOUSEKEEPING_CREATED', `Room #${task.roomNumber}`, `Created ${task.taskType} task with ${task.priority} priority`);
  };

  const updateHousekeepingStatus = (taskId: string, status: HousekeepingStatus) => {
    const task = housekeeping.find(t => t.id === taskId);
    if (!task) return;

    setHousekeeping(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status,
              completedAt: status === 'Completed' ? new Date().toISOString() : t.completedAt,
            }
          : t
      )
    );

    // If cleaning completed, auto-transition room to Available!
    if (status === 'Completed' && (task.taskType === 'Post Checkout Cleaning' || task.taskType === 'Deep Sanitization')) {
      setRooms(prev =>
        prev.map(r =>
          r.hotelId === task.hotelId && r.roomNumber === task.roomNumber
            ? { ...r, operationalStatus: 'Available', lastCleanedAt: new Date().toISOString() }
            : r
        )
      );
      addLog('ROOM_READY', `Room #${task.roomNumber}`, `Housekeeping finished; room is now marked Available for new guests.`);
    }

    addLog('HOUSEKEEPING_UPDATED', `Task #${taskId}`, `Status set to ${status}`);
  };

  // Service Request management
  const createServiceRequest = (req: Omit<ServiceRequest, 'id' | 'requestedAt'>) => {
    const newReq: ServiceRequest = {
      ...req,
      id: `srv_${Date.now()}`,
      requestedAt: new Date().toISOString(),
    };
    setServiceRequests(prev => [newReq, ...prev]);
    addLog('SERVICE_REQUESTED', `Room #${req.roomNumber}`, `Guest requested: ${req.serviceType}`);
  };

  const updateServiceRequestStatus = (requestId: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    setServiceRequests(prev =>
      prev.map(s =>
        s.id === requestId
          ? {
              ...s,
              status,
              completedAt: status === 'Completed' ? new Date().toISOString() : s.completedAt,
            }
          : s
      )
    );
    addLog('SERVICE_UPDATED', `Request #${requestId}`, `Status updated to ${status}`);
  };

  // Manager: Update Tariff
  const updateCategoryTariff = (categoryId: string, newBasePrice: number) => {
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, basePrice: newBasePrice } : c))
    );
    addLog('TARIFF_UPDATED', `Category #${categoryId}`, `Base nightly price updated to ₹${newBasePrice.toLocaleString('en-IN')}`);
  };

  // Admin: Add new hotel
  const addNewHotel = (hotelData: Omit<Hotel, 'id'>) => {
    const id = `htl_${Date.now()}`;
    const newHotel: Hotel = {
      ...hotelData,
      id,
    };
    setHotels(prev => [...prev, newHotel]);
    addLog('HOTEL_CREATED', `Hotel #${id}`, `Listed new property: ${newHotel.name} (${newHotel.city})`);
  };

  // Reset to default
  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(SEED_USERS);
    setCurrentUser(SEED_USERS[0]);
    setHotels(SEED_HOTELS);
    setCategories(SEED_ROOM_CATEGORIES);
    setRooms(SEED_ROOMS);
    setBookings(SEED_BOOKINGS);
    setHousekeeping(SEED_HOUSEKEEPING);
    setServiceRequests(SEED_SERVICE_REQUESTS);
    setAdminLogs(SEED_ADMIN_LOGS);
  };

  return (
    <HotelProContext.Provider
      value={{
        currentUser,
        users,
        hotels,
        categories,
        rooms,
        bookings,
        housekeeping,
        serviceRequests,
        adminLogs,
        searchCity,
        searchCheckIn,
        searchCheckOut,
        searchGuests,
        setSearchCity,
        setSearchCheckIn,
        setSearchCheckOut,
        setSearchGuests,
        switchRole,
        loginUser,
        logoutUser,
        createBooking,
        cancelBooking,
        requestRefund,
        processCheckIn,
        processCheckOut,
        updateRoomStatus,
        createHousekeepingTask,
        updateHousekeepingStatus,
        createServiceRequest,
        updateServiceRequestStatus,
        updateCategoryTariff,
        addNewHotel,
        resetToDefaultData,
      }}
    >
      {children}
    </HotelProContext.Provider>
  );
};

export const useHotelPro = () => {
  const context = useContext(HotelProContext);
  if (!context) {
    throw new Error('useHotelPro must be used within a HotelProProvider');
  }
  return context;
};
