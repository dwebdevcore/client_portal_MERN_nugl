import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import rootReducer from "../reducers";
import thunkMiddleware from "redux-thunk";

export default function configureStore(initialState, history) {
  const middlewares = [thunkMiddleware, routerMiddleware(history)];
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}
