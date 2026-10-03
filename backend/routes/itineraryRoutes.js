const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/authenticate');

const {
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
} = require('../controllers/itineraryController');

// All itinerary routes require a logged-in user
router.use(isAuthenticatedUser);

// Itinerary CRUD
router.route('/')
  .post(createItinerary)
  .get(getUserItineraries);

router.route('/:id')
  .get(getItineraryById)
  .put(updateItinerary)
  .delete(deleteItinerary);

// Day management
router.route('/:id/days')
  .post(addDay);

router.route('/:id/days/:dayId')
  .delete(deleteDay);

// Destination management within a day
router.route('/:id/days/:dayId/destinations')
  .post(addDestination);

router.route('/:id/days/:dayId/destinations/:destinationId')
  .put(updateDestination)
  .delete(deleteDestination);

// Reorder destinations (drag-and-drop)
router.route('/:id/days/:dayId/reorder')
  .put(reorderDestinations);

module.exports = router;