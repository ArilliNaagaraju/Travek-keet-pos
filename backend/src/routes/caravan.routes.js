const express = require("express");
const multer = require("multer");
const { addCaravan, getCaravans } = require("../controllers/caravan.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// upload.any() accepts all file fields (displayImages, amenity photos, etc.)
router.post("/", upload.any(), addCaravan);
router.get("/", getCaravans);

module.exports = router;
