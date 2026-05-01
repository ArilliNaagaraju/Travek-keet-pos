const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const providerRoutes = require("./provider.routes");
const caravanRoutes = require("./caravan.routes");
const bookingRoutes = require("./booking.routes");
const paymentRoutes = require("./payment.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/providers", providerRoutes);
router.use("/caravans", caravanRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
