const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'accommodation', 'activity', 'transport', 'other'],
      default: 'sightseeing',
    },
    startTime: { type: String, default: '' }, // e.g. "09:00"
    endTime: { type: String, default: '' },
    notes: { type: String, default: '' },
    order: {
      type: Number,
      default: 0, // position of this destination within the day
    },
  },
  { _id: true, timestamps: false }
);

const daySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
    },
    destinations: {
      type: [destinationSchema],
      default: [],
    },
    dayNotes: {
      type: String,
      default: '',
    },
  },
  { _id: true, timestamps: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Itinerary title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    days: {
      type: [daySchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'planned', 'completed', 'archived'],
      default: 'draft',
    },
    coverImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

itinerarySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);