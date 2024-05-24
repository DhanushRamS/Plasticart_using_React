const express = require("express");
const authenticateToken = require("../middleware/auth");
const vendorController = require("../controllers/vendorController");

const router = express.Router();

router.post(
  "/update-location",
  authenticateToken,
  vendorController.updateLocation
);
router.get("/:email", vendorController.getVendor);
router.get("/me", authenticateToken, vendorController.getMe);
router.post(
  "/:email/pickups/:pickupId/complete",
  authenticateToken,
  vendorController.completePickup
);

module.exports = router;
