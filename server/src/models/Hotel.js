import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    tagline: String,
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
      required: true, // Indian GST state code e.g. 08, 30, 27
    },
    postalCode: String,
    country: {
      type: String,
      default: 'India',
    },
    gstin: {
      type: String,
      required: [true, 'Indian GSTIN required'],
      uppercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    startingPrice: {
      type: Number,
      required: true, // in INR
    },
    featuredImage: String,
    images: [String],
    amenities: [String],
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    contactPhone: String,
    contactEmail: String,
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model('Hotel', hotelSchema);
