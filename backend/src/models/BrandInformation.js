const mongoose = require('mongoose');

const BrandInformationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandName: { type: String, required: true },
  company: { type: String },
  ownership: { type: String },
  officeAddress: { type: String },
  state: { type: String },
  zipCode: { type: String },
  city: { type: String },
  companyGst: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BrandInformation', BrandInformationSchema);
