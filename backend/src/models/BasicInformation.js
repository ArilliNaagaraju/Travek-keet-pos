const mongoose = require('mongoose');

const BasicInformationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  alternativeNumber: { type: String },
  ownerPhotoUrl: { type: String },
  aadhaarUrl: { type: String },
  panUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BasicInformation', BasicInformationSchema);
