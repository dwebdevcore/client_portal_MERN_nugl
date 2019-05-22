import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import messageReducer from "./messageReducer";
import userReducer from "./userReducer";
import mapReducer from "./mapReducer";
import profileReducer from "./profileReducer";
import listingReducer from "./listingReducer";
import brandReducer from "./brandReducer";

const rootReducer = combineReducers({
  router: routerReducer,
  messages: messageReducer,
  user: userReducer,
  map: mapReducer,
  profile: profileReducer,
  listings: listingReducer,
  brands: brandReducer
});

export default rootReducer;
