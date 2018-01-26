import { AsyncStorage } from 'react-native';
import {
  SIGNIN_USER_SUCCESS, SIGNIN_USER_FAIL, SIGNUP_USER_SUCCESS,
  TOGGLE_REMEMBER_PASSWORD, UPDATE_USER,
  CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL,
  CLEAN_SUCCESS_USER, CLEAN_ERROR_USER, CONFIRM_CARD_FAIL,
  FORGOT_PASSWORD_SET_MSG, FORGOT_PASSWORD_SET_TOKEN, FORGOT_PASSWORD_FAIL_MSG,
  FORGOT_PASSWORD_CLEAR_FAIL_MSG, FORGOT_PASSWORD_SUCCESS_MSG, FORGOT_PASSWORD_CLEAR_SUCCESS_MSG,
  UPDATE_DEPENDENTS_LIST, SELECT_USER_DEPENDENT, RECORD_USER_HOLDER
} from '../constants';

const INITIAL_STATE = {
  token: null,
  isBlocked: false,
  isInRepLog: false,
  isAlreadyRegistered: false,
  mustAnswerQuestionnaire: false,
  previousAttempts: 0,
  card: null,
  configuration: {
    indicators: [],
    rememberPassword: false,
  },
  medications: [],
  error: { hasError: false },
  success: {
    hasSuccess: false,
  },
  forgotPasswordMsg: null,
  forgotPasswordToken: null,
  forgotPasswordErrorMsg: null,
  forgotPasswordSuccessMsg: null,
  additionalUsers: [],
  selectedUser: null,
};

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGNIN_USER_SUCCESS:
      return { ...state, ...action.payload };
    case SIGNIN_USER_FAIL: case CONFIRM_CARD_FAIL:
    return { ...state, error: { hasError: true, message: action.payload.message }};
    case SIGNUP_USER_SUCCESS:
      return {...state, ...action.payload};
    case TOGGLE_REMEMBER_PASSWORD:
      return {...state, ...{configuration: {rememberPassword: action.payload.status}}};
    case UPDATE_USER:
      let { isBlocked, isInRepLog, isAlreadyRegistered, card } = action.payload;
      return { ...state, isBlocked: isBlocked, isInRepLog: isInRepLog, isAlreadyRegistered: isAlreadyRegistered, card: card, };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, success: { hasSuccess: true, message: action.payload.message }};
    case CHANGE_PASSWORD_FAIL:
      return { ...state, error: { hasError: true, message: action.payload.message }};
    case CLEAN_SUCCESS_USER:
      return { ...state, success: { hasSuccess: false, }};
    case CLEAN_ERROR_USER:
      return { ...state, error: { hasError: false, }};
    case FORGOT_PASSWORD_SET_MSG:
      return { ...state, forgotPasswordMsg: action.payload.msg };
    case FORGOT_PASSWORD_SET_TOKEN:
      return { ...state, forgotPasswordToken: action.payload.token };
    case FORGOT_PASSWORD_FAIL_MSG:
      return { ...state, forgotPasswordErrorMsg: action.payload.message };
    case FORGOT_PASSWORD_CLEAR_FAIL_MSG:
      return { ...state, forgotPasswordErrorMsg: null };
    case FORGOT_PASSWORD_SUCCESS_MSG:
      return { ...state, forgotPasswordSuccessMsg: action.payload.message };
    case FORGOT_PASSWORD_CLEAR_SUCCESS_MSG:
      return { ...state, forgotPasswordSuccessMsg: null };
    case UPDATE_DEPENDENTS_LIST:
      return { ...state, additionalUsers: action.payload.data };
    case SELECT_USER_DEPENDENT:
      if (action.payload.data === null) {
        AsyncStorage.removeItem('selectedUser');
      } else {
        AsyncStorage.setItem('selectedUser', action.payload.data.toString());
      }
      return { ...state, selectedUser: action.payload.data };
    case RECORD_USER_HOLDER:
      AsyncStorage.setItem('holder', JSON.stringify(action.payload.data));
      return state;
    default:
      return state;
  }
}
