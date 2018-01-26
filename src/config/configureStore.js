import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import appReducer from '../reducers';

const configureStore = () => {
  const middlewares = [thunk];
  let store = compose(applyMiddleware(...middlewares))(createStore)(appReducer);
  if (__DEV__) {
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('./reducers', () => {
        const nextRootReducer = require('../reducers');
        store.replaceReducer(nextRootReducer);
      });
    }
    middlewares.push(logger);
    store = compose(applyMiddleware(...middlewares))(createStore)(appReducer);
  }
  return store;
};

export default configureStore;
