import * as ActionTypes from "../actions/actionTypes";
import GoogleApi from "../api/GoogleApi";

const setCurrentLocationSuccess = (location, city, state) => {
  return {
    type: ActionTypes.SET_CURRENT_LOCATION_SUCCESS,
    location,
    city,
    state
  };
};

export function setCenterMapLocation(location, markerId) {
  return { type: ActionTypes.SET_CENTER_MAP_LOCATION, location, markerId };
}

export function setCurrentLocation(location) {
  return dispatch => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentLocation = location || {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          GoogleApi.geocodeSearch(
            "address",
            `${currentLocation.lat},${currentLocation.lng}`
          ).then(results => {
            dispatch(
              setCurrentLocationSuccess({
                ...currentLocation,
                city: results[0].locality || results[0].neighborhood,
                state: results[0].administrative_area_level_1
              })
            );
          });
        },
        error => {
          console.log(error);
        },
        { timeout: 60000 }
      );
    }
  };
}
