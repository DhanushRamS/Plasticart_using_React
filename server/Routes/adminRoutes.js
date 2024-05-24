const express = require("express");
const authenticateToken = require("../middleware/auth");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/completed-pickups",
  authenticateToken,
  adminController.getCompletedPickups
);
router.post("/assign-points", authenticateToken, adminController.assignPoints);

module.exports = router;
