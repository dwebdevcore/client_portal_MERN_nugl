import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";
import configureStore from "./store/configureStore";
import createHistory from "history/createBrowserHistory";
//import registerServiceWorker from "./registerServiceWorker";
import { unregister } from "./registerServiceWorker";
import App from "./components/App";
import { auth } from "./firebase";
import { updateUser } from "./actions/userActions";
import { getProfile } from "./actions/profileActions";
import { getListings } from "./actions/listingActions";
import { getBrands } from "./actions/brandActions";
import { setCurrentLocation } from "./actions/mapActions";

import "./index.css";

const history = createHistory();

const store = configureStore({}, history);

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch(updateUser(user));
    store.dispatch(getProfile(user.uid));
    store.dispatch(getListings(user.uid));
    store.dispatch(getBrands(user.uid));
  }
});

store.dispatch(setCurrentLocation());

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById("root")
);

unregister();
// registerServiceWorker();
