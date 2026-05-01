const Caravan = require("../models/caravan.model");
const { success } = require("../utils/response");

function fileToDataUrl(file) {
  const mimeType = file.mimetype || "application/octet-stream";
  const base64 = file.buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

async function addCaravan(req, res, next) {
  try {
    const parsedBody = req.body?.payload ? JSON.parse(req.body.payload) : req.body;
    const files = req.files || {};

    const uploadFilesByField = (fieldName) => {
      const fieldFiles = files[fieldName] || [];
      return fieldFiles.map(fileToDataUrl);
    };

    if (!parsedBody.details) parsedBody.details = {};

    const displayImages = uploadFilesByField("displayImages");
    const registrationDetails = uploadFilesByField("registrationDetails");
    const seatingImages = uploadFilesByField("seatingImages");

    if (displayImages.length) parsedBody.details.displayImages = displayImages;
    if (registrationDetails.length) parsedBody.details.registrationDetails = registrationDetails;
    if (seatingImages.length) parsedBody.details.seatingImages = seatingImages;

    const caravan = new Caravan(parsedBody);
    await caravan.save();
    return success(res, caravan, 201);
  } catch (error) {
    return next(error);
  }
}

async function getCaravans(req, res, next) {
  try {
    const caravans = await Caravan.find().populate("providerId");
    return success(res, caravans);
  } catch (error) {
    return next(error);
  }
}

module.exports = { addCaravan, getCaravans };
