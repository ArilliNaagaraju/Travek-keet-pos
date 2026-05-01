const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  caravanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caravan',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caravanBooking: {
    pickupDate: String,
    dropDate: String,
    pickupLocation: String,
    destination: String,
    dropLocation: String
  },
  nestBooking: {
    booked: { type: Boolean, default: false },
    checkInDate: String,
    checkOutDate: String,
    adults: Number,
    children: Number
  },
  personalDetails: {
    guestName: String,
    paxCount: Number,
    guestAge: Number,
    aadharNumber: String
  },
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
