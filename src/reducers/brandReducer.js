import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";
import update from "immutability-helper";

export default (state = initialState.brands, action) => {
  switch (action.type) {
    case ActionTypes.GET_BRANDS_SUCCESS:
      return action.brands;
    case ActionTypes.GET_BRAND_SUCCESS:
      return action.brands;
    case ActionTypes.ADD_BRAND_SUCCESS: {
      if (state.find(brand => brand.id === action.brand.id)) {
        return state.map(brand => {
          if (brand.id !== action.brand.id) return brand;
          return {
            ...brand,
            ...action.brand
          };
        });
      }
      return [...state, action.brand];
    }
    case ActionTypes.PUBLISH_BRAND_SUCCESS:
    case ActionTypes.UPDATE_BRAND_SUCCESS: {
      const existingIndex = state.findIndex(
        brand => brand.id === action.brand.id
      );
      if (existingIndex > -1) {
        return update(state, {
          [existingIndex]: {
            $set: action.brand
          }
        });
      }
      return state;
    }
    case ActionTypes.UPLOAD_BRAND_TEMP_PHOTO:
    case ActionTypes.UPLOAD_BRAND_PHOTO_SUCCESS:
      let brand = {
        ...state.filter(brand => brand.id === action.brandId)[0]
      };
      brand[action.name] = action.path;
      return [...state.filter(brand => brand.id !== action.brandId), brand];
    default:
      return state;
  }
};
