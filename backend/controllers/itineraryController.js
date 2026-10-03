const Itinerary = require('../models/itineraryModel');

// @desc    Create a new itinerary
// @route   POST /api/itineraries
// @access  Private
const createItinerary = async (req, res) => {
  try {
    const { title, description, startDate, endDate, days, coverImage } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const itinerary = await Itinerary.create({
      user: req.user._id,
      title,
      description,
      startDate,
      endDate,
      days: days || [],
      coverImage,
    });

    res.status(201).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create itinerary', error: error.message });
  }
};

// @desc    Get all itineraries for the logged-in user
// @route   GET /api/itineraries
// @access  Private
const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itineraries', error: error.message });
  }
};

// @desc    Get a single itinerary by ID
// @route   GET /api/itineraries/:id
// @access  Private
const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this itinerary' });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itinerary', error: error.message });
  }
};

// @desc    Update itinerary details (title, dates, status, etc.)
// @route   PUT /api/itineraries/:id
// @access  Private
const updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this itinerary' });
    }

    const allowedFields = ['title', 'description', 'startDate', 'endDate', 'status', 'coverImage', 'days'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        itinerary[field] = req.body[field];
      }
    });

    const updated = await itinerary.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update itinerary', error: error.message });
  }
};

// @desc    Delete an itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private
const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this itinerary' });
    }

    await itinerary.deleteOne();
    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete itinerary', error: error.message });
  }
};

// @desc    Add a new day to an itinerary
// @route   POST /api/itineraries/:id/days
// @access  Private
const addDay = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { date, dayNotes } = req.body;
    const nextDayNumber = itinerary.days.length + 1;

    itinerary.days.push({
      dayNumber: nextDayNumber,
      date,
      dayNotes: dayNotes || '',
      destinations: [],
    });

    const updated = await itinerary.save();
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add day', error: error.message });
  }
};

// @desc    Delete a day from an itinerary
// @route   DELETE /api/itineraries/:id/days/:dayId
// @access  Private
const deleteDay = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    itinerary.days = itinerary.days.filter((day) => day._id.toString() !== req.params.dayId);

    // renumber remaining days sequentially
    itinerary.days.forEach((day, index) => {
      day.dayNumber = index + 1;
    });

    const updated = await itinerary.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete day', error: error.message });
  }
};

// @desc    Add a destination to a specific day
// @route   POST /api/itineraries/:id/days/:dayId/destinations
// @access  Private
const addDestination = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const day = itinerary.days.id(req.params.dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    const { name, description, location, category, startTime, endTime, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Destination name is required' });
    }

    day.destinations.push({
      name,
      description,
      location,
      category,
      startTime,
      endTime,
      notes,
      order: day.destinations.length,
    });

    const updated = await itinerary.save();
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add destination', error: error.message });
  }
};

// @desc    Update a destination within a day
// @route   PUT /api/itineraries/:id/days/:dayId/destinations/:destinationId
// @access  Private
const updateDestination = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const day = itinerary.days.id(req.params.dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    const destination = day.destinations.id(req.params.destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const allowedFields = ['name', 'description', 'location', 'category', 'startTime', 'endTime', 'notes', 'order'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        destination[field] = req.body[field];
      }
    });

    const updated = await itinerary.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update destination', error: error.message });
  }
};

// @desc    Remove a destination from a day
// @route   DELETE /api/itineraries/:id/days/:dayId/destinations/:destinationId
// @access  Private
const deleteDestination = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const day = itinerary.days.id(req.params.dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    day.destinations = day.destinations.filter(
      (dest) => dest._id.toString() !== req.params.destinationId
    );

    // reset order sequence
    day.destinations.forEach((dest, index) => {
      dest.order = index;
    });

    const updated = await itinerary.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete destination', error: error.message });
  }
};

// @desc    Reorder destinations within a day (drag-and-drop support)
// @route   PUT /api/itineraries/:id/days/:dayId/reorder
// @access  Private
const reorderDestinations = async (req, res) => {
  try {
    const { orderedDestinationIds } = req.body; // array of destination _ids in new order

    if (!Array.isArray(orderedDestinationIds)) {
      return res.status(400).json({ message: 'orderedDestinationIds must be an array' });
    }

    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const day = itinerary.days.id(req.params.dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    orderedDestinationIds.forEach((destId, index) => {
      const destination = day.destinations.id(destId);
      if (destination) {
        destination.order = index;
      }
    });

    // keep array sorted to match the new order
    day.destinations.sort((a, b) => a.order - b.order);

    const updated = await itinerary.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder destinations', error: error.message });
  }
};

module.exports = {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  addDay,
  deleteDay,
  addDestination,
  updateDestination,
  deleteDestination,
  reorderDestinations,
};