const express = require('express');
const {
  createAppointment,
  // getUserAppointments,    // ← hapus atau jadikan comment
  getAllUpcomingAppointments,  // ← import handler baru
  getAppointmentById,
  inviteParticipants,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new appointment
router.post('/', protect, createAppointment);

// Get all upcoming appointments (bukan cuma milik user)
router.get('/', protect, getAllUpcomingAppointments);

// Get single appointment details
router.get('/:id', protect, getAppointmentById);

// Invite additional users to an appointment
router.post('/:id/invite', protect, inviteParticipants);

// Update an existing appointment (only creator)
router.put('/:id', protect, updateAppointment);

// Delete an appointment (only creator)
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
