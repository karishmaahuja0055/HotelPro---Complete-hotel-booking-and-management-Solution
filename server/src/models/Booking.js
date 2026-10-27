import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    guestGstin: String, // Optional B2B recipient GSTIN
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomCategory',
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    roomNumber: String,
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
    },
    guestsCount: {
      type: Number,
      required: true,
    },
    roomsCount: {
      type: Number,
      default: 1,
    },
    priceBreakdown: {
      nights: Number,
      roomsCount: Number,
      basePricePerNight: Number,
      grossRoomTariff: Number,
      discountAmount: Number,
      netTaxableAmount: Number,
      gstRate: Number,
      cgstAmount: Number,
      sgstAmount: Number,
      totalGst: Number,
      grandTotal: Number,
      sacCode: {
        type: String,
        default: '9963',
      },
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'],
      default: 'Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay',
    },
    razorpayPaymentId: String,
    specialRequests: String,
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
