import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; // your existing configured axios instance

// NOTE: assumes axios.js has baseURL already including '/api' and withCredentials: true set.
// If not, prefix these paths with '/api' or adjust axios.js accordingly.

// ---- Itinerary CRUD ----
export const fetchItineraries = createAsyncThunk(
  'itinerary/fetchItineraries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/itineraries');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch itineraries');
    }
  }
);

export const fetchItineraryById = createAsyncThunk(
  'itinerary/fetchItineraryById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/itineraries/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch itinerary');
    }
  }
);

export const createItinerary = createAsyncThunk(
  'itinerary/createItinerary',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/itineraries', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create itinerary');
    }
  }
);

export const updateItinerary = createAsyncThunk(
  'itinerary/updateItinerary',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/itineraries/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update itinerary');
    }
  }
);

export const deleteItinerary = createAsyncThunk(
  'itinerary/deleteItinerary',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/itineraries/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete itinerary');
    }
  }
);

// ---- Day management ----
export const addDay = createAsyncThunk(
  'itinerary/addDay',
  async ({ itineraryId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/itineraries/${itineraryId}/days`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add day');
    }
  }
);

export const deleteDay = createAsyncThunk(
  'itinerary/deleteDay',
  async ({ itineraryId, dayId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/itineraries/${itineraryId}/days/${dayId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete day');
    }
  }
);

// ---- Destination management ----
export const addDestination = createAsyncThunk(
  'itinerary/addDestination',
  async ({ itineraryId, dayId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/itineraries/${itineraryId}/days/${dayId}/destinations`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add destination');
    }
  }
);

export const updateDestination = createAsyncThunk(
  'itinerary/updateDestination',
  async ({ itineraryId, dayId, destinationId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/api/itineraries/${itineraryId}/days/${dayId}/destinations/${destinationId}`,
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update destination');
    }
  }
);

export const deleteDestination = createAsyncThunk(
  'itinerary/deleteDestination',
  async ({ itineraryId, dayId, destinationId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `/api/itineraries/${itineraryId}/days/${dayId}/destinations/${destinationId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete destination');
    }
  }
);

export const reorderDestinations = createAsyncThunk(
  'itinerary/reorderDestinations',
  async ({ itineraryId, dayId, orderedDestinationIds }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/itineraries/${itineraryId}/days/${dayId}/reorder`, {
        orderedDestinationIds,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reorder destinations');
    }
  }
);