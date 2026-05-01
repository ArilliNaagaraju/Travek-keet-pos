const mongoose = require("mongoose");

const caravanSchema = new mongoose.Schema(
  {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    details: {
      vehicleType: { type: String },
      sleepingCapacity: { type: String },
      vehicleNumber: { type: String },
      displayImages: [{ type: String }],
      registrationDetails: [{ type: String }],
      state: { type: String },
      seatingCapacity: { type: String },
      city: { type: String },
      seatingImages: [{ type: String }],
      description: { type: String }
    },
    amenities: {
      bedroom: {
        sleepingBedInBuild: { type: String },
        moonRoof: { type: String },
        sleepingBedPopUp: { type: String },
        fan: { type: String },
        sleepingSofa: { type: String },
        airConditioner: { type: String },
        mobileCharging: { type: String }
      },
      bathroom: {
        bathroom: { type: String },
        freshWaterTank: { type: String },
        geyser: { type: String },
        freshWater: { type: String },
        wasteWaterDisposal: { type: String },
        greyWater: { type: String }
      },
      kitchen: {
        microwave: { type: String },
        refrigerator: { type: String },
        kitchenInside: { type: String },
        kitchenExternal: { type: String }
      },
      livingRoom: {
        entertainmentSystem: { type: String },
        dinnerTable: { type: String },
        television: { type: String },
        coupleFriendly: { type: String },
        petFriendly: { type: String }
      },
      other: {
        wifi: { type: String },
        batteryInverter: { type: String },
        securityCamera: { type: String },
        ironBox: { type: String },
        parkingAssist: { type: String },
        solarPanel: { type: String },
        campingTent: { type: String },
        campingAccessories: { type: String },
        chautterDriver: { type: String },
        awning: { type: String }
      }
    },
    pricing: {
      fixedKms: { type: String },
      pricePerNight: { type: String },
      extraKmsRate: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Caravan", caravanSchema);
