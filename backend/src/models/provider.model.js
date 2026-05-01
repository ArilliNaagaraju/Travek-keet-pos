const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    basicInfo: {
      ownerName: { type: String, required: true },
      email: { type: String, required: true },
      altNumber: { type: String },
      photo: { type: String }, // URL or path
      aadhaar: { type: String }, // URL or path
      pan: { type: String } // URL or path
    },
    brandInfo: {
      brandName: { type: String, required: true },
      company: { type: String },
      ownership: { type: String },
      officeAddress: { type: String },
      state: { type: String },
      zipCode: { type: String },
      city: { type: String },
      companyGst: { type: String }
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);
