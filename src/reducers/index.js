import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import loaderReducer from './loaderReducer';
import userReducer from './userReducer';
import profileReducer from './profileReducer';
import medicineReducer from './medicineReducer';

const appReducer = combineReducers({
  form: formReducer,

  loader: loaderReducer,
  user: userReducer,
  profile: profileReducer,
  medicine: medicineReducer,
});

export default appReducer;
