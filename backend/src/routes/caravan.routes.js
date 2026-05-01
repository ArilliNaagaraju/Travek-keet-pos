const express = require("express");
const multer = require("multer");
const { addCaravan, getCaravans } = require("../controllers/caravan.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.fields([
    { name: "displayImages", maxCount: 10 },
    { name: "registrationDetails", maxCount: 10 },
    { name: "seatingImages", maxCount: 10 },
  ]),
  addCaravan
);
router.get("/", getCaravans);

module.exports = router;
