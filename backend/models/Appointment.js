const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  creator_id: { type: String, ref: 'User', required: true },
  participants: [{ type: String, ref: 'User' }], // Reference by _id (UUID)
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
