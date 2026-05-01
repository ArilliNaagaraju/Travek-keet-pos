const mongoose = require('mongoose');

const ExtraAmenitySchema = new mongoose.Schema({
  caravanId: { type: mongoose.Schema.Types.ObjectId, ref: 'CaravanDetail', required: true },
  category: { type: String, required: true }, // e.g., 'Bedroom', 'Bathroom', 'Kitchen', 'Living Room', 'Other'
  name: { type: String, required: true }, // e.g., 'AC', 'Pillows', 'Stove'
  isAvailable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ExtraAmenity', ExtraAmenitySchema);
