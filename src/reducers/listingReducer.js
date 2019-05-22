import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";
import update from "immutability-helper";

export default (state = initialState.listings, action) => {
  switch (action.type) {
    case ActionTypes.GET_LISTINGS_SUCCESS:
      return action.listings;
    case ActionTypes.GET_LISTING_SUCCESS:
      return action.listings;
    case ActionTypes.ADD_LISTING_SUCCESS: {
      if (state.find(listing => listing.id === action.listing.id)) {
        return state.map(listing => {
          if (listing.id !== action.listing.id) return listing;
          return {
            ...listing,
            ...action.listing
          };
        });
      }
      return [...state, action.listing];
    }
    case ActionTypes.PUBLISH_LISTING_SUCCESS:
    case ActionTypes.UPDATE_LISTING_SUCCESS: {
      const existingIndex = state.findIndex(
        listing => listing.id === action.listing.id
      );
      if (existingIndex > -1) {
        return update(state, {
          [existingIndex]: {
            $set: action.listing
          }
        });
      }
      return state;
    }
    case ActionTypes.UPLOAD_LISTING_TEMP_PHOTO:
    case ActionTypes.UPLOAD_LISTING_PHOTO_SUCCESS:
      let listing = {
        ...state.filter(listing => listing.id === action.listingId)[0]
      };
      listing[action.name] = action.path;
      return [
        ...state.filter(listing => listing.id !== action.listingId),
        listing
      ];
    default:
      return state;
  }
};
