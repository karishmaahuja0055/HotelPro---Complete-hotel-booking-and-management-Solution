export type UserRole = 'guest' | 'staff' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // Indian format +91 XXXXX XXXXX
  role: UserRole;
  avatar?: string;
  hotelId?: string; // Assigned hotel for staff/manager
  hotelName?: string;
  department?: string; // For staff (e.g. Front Desk, Housekeeping)
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string; // Udaipur, Goa, Jaipur, Mumbai, Munnar, Varanasi, Manali, Bengaluru
  state: string;
  stateCode: string; // GST State Code (e.g. '08' for Rajasthan)
  postalCode: string;
  country: string; // 'India'
  gstin: string; // Indian GST Number
  rating: number;
  reviewCount: number;
  featuredImage: string;
  images: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  contactPhone: string;
  contactEmail: string;
  startingPrice: number; // in INR
  managerId: string;
}

export interface RoomCategory {
  id: string;
  hotelId: string;
  name: string;
  categoryType: 'Deluxe Heritage' | 'Royal Suite' | 'Executive Room' | 'Palace Villa' | 'Luxury Cottage';
  basePrice: number; // in INR per night
  maxGuests: number;
  bedType: string;
  sizeSqFt: number;
  description: string;
  amenities: string[];
  images: string[];
  totalRooms: number;
  availableRoomsCount?: number;
}

export type RoomOperationalStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';

export interface Room {
  id: string;
  hotelId: string;
  categoryId: string;
  roomNumber: string; // e.g. 101, 204
  floor: number;
  operationalStatus: RoomOperationalStatus;
  currentBookingId?: string;
  currentGuestName?: string;
  lastCleanedAt?: string;
}

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';
export type PaymentMethod = 'Razorpay' | 'UPI (GPay/PhonePe)' | 'Credit/Debit Card' | 'NetBanking' | 'Pay at Hotel';

export interface BookingPriceBreakdown {
  nights: number;
  roomsCount: number;
  basePricePerNight: number;
  grossRoomTariff: number;
  discountAmount: number;
  netTaxableAmount: number;
  gstRate: number; // 0.12 or 0.18
  cgstAmount: number;
  sgstAmount: number;
  totalGst: number;
  grandTotal: number;
  sacCode: string;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. HP-IND-2026-AB1234
  userId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestGstin?: string; // Optional B2B corporate GSTIN
  guestCity?: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelAddress: string;
  hotelGstin: string;
  categoryId: string;
  categoryName: string;
  roomNumber?: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  roomsCount: number;
  priceBreakdown: BookingPriceBreakdown;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayPaymentId?: string;
  specialRequests?: string;
  createdAt: string;
  cancellationReason?: string;
  refundStatus?: 'None' | 'Requested' | 'Approved' | 'Processed';
}

export type IdProofType = 'Aadhaar Card' | 'Passport' | 'Voter ID' | 'Driving License';

export interface CheckInRecord {
  id: string;
  bookingId: string;
  bookingReference: string;
  guestName: string;
  roomNumber: string;
  idProofType: IdProofType;
  idProofNumber: string; // Last 4 digits visible for privacy (e.g. XXXX-XXXX-4819)
  checkInTime: string;
  keyCardAssigned: string;
  frontDeskStaffName: string;
  luggageAssisted: boolean;
  notes?: string;
}

export interface CheckOutRecord {
  id: string;
  bookingId: string;
  bookingReference: string;
  guestName: string;
  roomNumber: string;
  checkOutTime: string;
  keyCardReturned: boolean;
  additionalChargesInr: number;
  feedbackRating: number;
  processedByStaff: string;
  notes?: string;
}

export type HousekeepingPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type HousekeepingStatus = 'Pending' | 'In Progress' | 'Completed';
export type HousekeepingType = 'Post Checkout Cleaning' | 'Daily Turndown & Linen' | 'Deep Sanitization' | 'Inspection' | 'Maintenance Repair';

export interface HousekeepingTask {
  id: string;
  hotelId: string;
  roomNumber: string;
  taskType: HousekeepingType;
  priority: HousekeepingPriority;
  status: HousekeepingStatus;
  assignedStaffId: string;
  assignedStaffName: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export type ServiceType =
  | 'In-Room Royal Dining (Thali & Beverages)'
  | 'Extra Towels & Ayurvedic Toiletries'
  | 'Airport / Railway Station Taxi'
  | 'Ayurvedic Spa & Wellness Booking'
  | 'Luggage & Bell Desk Assistance'
  | 'Ironing & Laundry Service'
  | 'Doctor on Call / Medical';

export interface ServiceRequest {
  id: string;
  bookingId: string;
  bookingReference: string;
  hotelId: string;
  roomNumber: string;
  guestName: string;
  guestPhone: string;
  serviceType: ServiceType;
  priority: 'Normal' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  details: string;
  ipAddress?: string;
}
