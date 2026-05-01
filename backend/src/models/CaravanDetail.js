const mongoose = require('mongoose');

const CaravanDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true },
  caravanType: { type: String, required: true },
  manufacturer: { type: String },
  model: { type: String },
  yearOfManufacture: { type: Number },
  chassisNumber: { type: String },
  engineNumber: { type: String },
  color: { type: String },
  seatingCapacity: { type: Number },
  sleepingCapacity: { type: Number },
  grossVehicleWeight: { type: Number },
  pricePerDay: { type: Number },
  description: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('CaravanDetail', CaravanDetailSchema);
