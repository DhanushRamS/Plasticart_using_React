const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Get pending pickups within 10 km
router.get('/:vendorId/pickups', async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    const pendingPickups = vendor.pickups.filter(pickup => pickup.status === 'pending');

    res.json(pendingPickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get accepted pickups
router.get('/:vendorId/accepted-pickups', async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    const acceptedPickups = vendor.pickups.filter(pickup => pickup.status === 'accepted');

    res.json(acceptedPickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get rejected pickups
router.get('/:vendorId/rejected-pickups', async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    const rejectedPickups = vendor.pickups.filter(pickup => pickup.status === 'rejected');

    res.json(rejectedPickups);
  } catch (err) {
    res.status{.json({ error: err.message });
  }
});

// Accept pickup
router.post('/:vendorId/pickups/:pickupId/accept', async (req, res) => {
  const { vendorId, pickupId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    const pickup = vendor.pickups.id(pickupId);
    if (pickup) {
      pickup.status = 'accepted';
      await vendor.save();
      res.json(pickup);
    } else {
      res.status(404).json({ error: 'Pickup not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject pickup
router.post('/:vendorId/pickups/:pickupId/reject', async (req, res) => {
  const { vendorId, pickupId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    const pickup = vendor.pickups.id(pickupId);
    if (pickup) {
      pickup.status = 'rejected';
      await vendor.save();
      res.json(pickup);
    } else {
      res.status(404).json({ error: 'Pickup not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
