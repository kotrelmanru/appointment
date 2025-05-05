const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment-timezone');

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const { title, description, participants = [], start, end } = req.body;

    // Convert usernames to user IDs
    const users = await User.find({ username: { $in: participants } });
    const participantIds = users.map(u => u._id); // Gunakan _id sebagai referensi
    
    // Validasi semua username valid
    if (users.length !== participants.length) {
      const missing = participants.filter(u => !users.some(dbUser => dbUser.username === u));
      return res.status(400).json({ message: `Invalid usernames: ${missing.join(', ')}` });
    }

    const allParticipants = [...new Set([...participantIds, creator_id])];

    const invalid = [];
    for (let userId of allParticipants) {
      const user = await User.findById(userId);
      if (!user) continue;
      const tz = user.preferred_timezone || 'UTC';
      const sLocal = moment.tz(start, tz);
      const eLocal = moment.tz(end, tz);
      if (sLocal.hour() < 9 || eLocal.hour() > 17) {
        invalid.push({ user: user.username, tz, start: sLocal.format(), end: eLocal.format() });
      }
    }
    if (invalid.length) {
      return res.status(400).json({
        message: 'Appointment outside working hours for some participants.',
        invalid
      });
    }

    const appointment = await Appointment.create({
      title,
      description,
      creator_id,
      participants: allParticipants,
      start: new Date(start),
      end: new Date(end)
    });

    res.status(201).json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating appointment', error: err.message });
  }
};

// Get all upcoming appointments (for everyone)
exports.getAllUpcomingAppointments = async (req, res) => {
  try {
    const now = new Date();

    // Hanya filter end >= now, tanpa membatasi peserta atau creator
    const appointments = await Appointment.find({
      end: { $gte: now }
    })
      // .populate('creator_id', 'id name username preferred_timezone')
      // .populate('participants', 'id name username preferred_timezone')
      // .sort({ start: 1 });

    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error fetching all upcoming appointments', error: err.message });
  }
};

// Get single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('creator_id', 'id name username preferred_timezone')
      .populate('participants', 'id name username preferred_timezone');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointment', error: err.message });
  }
};

// Invite additional users
exports.inviteParticipants = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { participants = [] } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.creator_id !== userId) {
      return res.status(403).json({ message: 'Only creator can invite participants' });
    }

    const allParticipants = Array.from(new Set([...appointment.participants, ...participants]));
    appointment.participants = allParticipants;
    await appointment.save();

    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error inviting participants', error: err.message });
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = (({ title, description, start, end }) => ({ title, description, start, end }))(req.body);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.creator_id !== userId) {
      return res.status(403).json({ message: 'Only creator can update this appointment' });
    }

    if (updates.title) appointment.title = updates.title;
    if (updates.description) appointment.description = updates.description;
    if (updates.start) appointment.start = new Date(updates.start);
    if (updates.end) appointment.end = new Date(updates.end);

    await appointment.save();
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment', error: err.message });
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.creator_id !== userId) {
      return res.status(403).json({ message: 'Only creator can delete this appointment' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting appointment', error: err.message });
  }
};
