import { createSlice } from '@reduxjs/toolkit';
import {
  fetchItineraries,
  fetchItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addDay,
  deleteDay,
  addDestination,
  updateDestination,
  deleteDestination,
  reorderDestinations,
} from '../actions/itineraryActions';

const initialState = {
  itineraries: [],
  currentItinerary: null,
  loading: false,
  error: null,
};

// Most day/destination thunks return the full updated itinerary from the backend —
// this helper keeps currentItinerary and the matching entry in the list array in sync.
const applyUpdatedItinerary = (state, updated) => {
  state.currentItinerary = updated;
  state.itineraries = state.itineraries.map((it) => (it._id === updated._id ? updated : it));
};

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    clearItineraryError: (state) => {
      state.error = null;
    },
    clearCurrentItinerary: (state) => {
      state.currentItinerary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchItineraries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItineraries.fulfilled, (state, action) => {
        state.loading = false;
        state.itineraries = action.payload;
      })
      .addCase(fetchItineraries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch one
      .addCase(fetchItineraryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItineraryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItinerary = action.payload;
      })
      .addCase(fetchItineraryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createItinerary.fulfilled, (state, action) => {
        state.itineraries.unshift(action.payload);
      })
      .addCase(createItinerary.rejected, (state, action) => {
        state.error = action.payload;
      })

      // update details
      .addCase(updateItinerary.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })
      .addCase(updateItinerary.rejected, (state, action) => {
        state.error = action.payload;
      })

      // delete
      .addCase(deleteItinerary.fulfilled, (state, action) => {
        state.itineraries = state.itineraries.filter((it) => it._id !== action.payload);
      })
      .addCase(deleteItinerary.rejected, (state, action) => {
        state.error = action.payload;
      })

      // day add/delete
      .addCase(addDay.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })
      .addCase(deleteDay.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })

      // destination add/update/delete/reorder
      .addCase(addDestination.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })
      .addCase(reorderDestinations.fulfilled, (state, action) => {
        applyUpdatedItinerary(state, action.payload);
      })

      // shared rejection handler for the day/destination thunks above
      .addMatcher(
        (action) =>
          action.type.startsWith('itinerary/') &&
          action.type.endsWith('/rejected') &&
          !['itinerary/fetchItineraries', 'itinerary/fetchItineraryById'].some((t) =>
            action.type.startsWith(t)
          ),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearItineraryError, clearCurrentItinerary } = itinerarySlice.actions;
export default itinerarySlice.reducer;