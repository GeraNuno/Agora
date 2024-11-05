const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true // Agrega esta opción para habilitar las marcas de tiempo
});

module.exports = mongoose.model('Community', CommunitySchema);
