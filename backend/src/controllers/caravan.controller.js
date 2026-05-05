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

    // upload.any() gives req.files as a flat array; group by fieldname
    const filesArray = req.files || [];
    const filesByField = {};
    filesArray.forEach((f) => {
      if (!filesByField[f.fieldname]) filesByField[f.fieldname] = [];
      filesByField[f.fieldname].push(f);
    });

    const toDataUrls = (fieldName) =>
      (filesByField[fieldName] || []).map(fileToDataUrl);

    if (!parsedBody.details) parsedBody.details = {};

    // Standard image fields
    const displayImages = toDataUrls("displayImages");
    const registrationDetails = toDataUrls("registrationDetails");
    const seatingImages = toDataUrls("seatingImages");

    if (displayImages.length) parsedBody.details.displayImages = displayImages;
    if (registrationDetails.length) parsedBody.details.registrationDetails = registrationDetails;
    if (seatingImages.length) parsedBody.details.seatingImages = seatingImages;

    // Amenity photo fields (any field ending with "Photo")
    const amenityPhotos = {};
    Object.keys(filesByField).forEach((fieldName) => {
      if (fieldName.endsWith("Photo")) {
        amenityPhotos[fieldName] = fileToDataUrl(filesByField[fieldName][0]);
      }
    });
    if (Object.keys(amenityPhotos).length > 0) {
      parsedBody.amenityPhotos = amenityPhotos;
    }

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
