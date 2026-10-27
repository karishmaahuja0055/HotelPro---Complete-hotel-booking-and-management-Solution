import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
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
    roomNumber: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    operationalStatus: {
      type: String,
      enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
      default: 'Available',
    },
    lastCleanedAt: Date,
  },
  { timestamps: true }
);

export const Room = mongoose.model('Room', roomSchema);
