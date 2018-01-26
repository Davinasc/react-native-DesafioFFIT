import {
  PROFILE_LIST_SUCCESS, PROFILE_LIST_FAIL,
  PROFILE_UPDATE_HEIGHT_SUCESS, PROFILE_UPDATE_HEIGHT_FAIL,
  PROFILE_UPDATE_WEIGHT_FAIL, PROFILE_UPDATE_WEIGHT_SUCESS,
  PROFILE_UPDATE_GLYCEMIA_SUCCESS, PROFILE_UPDATE_GLYCEMIA_FAIL,
  PROFILE_UPDATE_BLOOD_PRESSURE_SUCCESS, PROFILE_UPDATE_BLOOD_PRESSURE_FAIL,
  CLEAR_ERROR_PROFILE, CLEAR_SUCCESS_PROFILE, PROFILE_PICTURE_SEND_SUCCESS,
  PROFILE_PICTURE_SEND_FAIL, RESET_PROFILE, PROFILE_PICTURE_UPDATE,
  PROFILE_UPDATE_HEART_BEAT_SUCCESS, PROFILE_UPDATE_HEART_BEAT_FAIL,
  PROFILE_UPDATE_TEMPERATURE_SUCCESS, PROFILE_UPDATE_TEMPERATURE_FAIL,
  PROFILE_CHANGE_SELECTOR_VISIBILITY, PROFILE_UPDATE_IMC_SUCESS
} from '../constants';

const INITIAL_STATE = {
  name: null,
  cpf: null,
  email: null,
  weight: null,
  height: null,
  blood_pressure: {
    systolic: null,
    diastolic: null,
  },
  heart_beat: null,
  glycemia: null,
  temperature: null,
  error: {
    hasError: false,
  },
  success: {
    hasSuccess: false,
  },
  profile_picture: null,
  profileSelectorOpened: false,
  holderUser: {},
};

export default function profileReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    default:
      return state;
    case PROFILE_LIST_SUCCESS:
      return Object.assign({}, state, action.payload.data.data);
    case PROFILE_LIST_FAIL:
      return state;
    case PROFILE_UPDATE_WEIGHT_SUCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        weight: action.payload.data.value,
      };
    case PROFILE_UPDATE_HEIGHT_SUCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        height: action.payload.data.value,
      };
    case PROFILE_UPDATE_IMC_SUCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        imc: action.payload.data.value,
      };
    case PROFILE_UPDATE_GLYCEMIA_SUCCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        glycemia: action.payload.data.value,
      };
    case PROFILE_UPDATE_BLOOD_PRESSURE_SUCCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        blood_pressure: {
          systolic: action.payload.data.value.systolic,
          diastolic: action.payload.data.value.diastolic,
        },
      };
    case PROFILE_UPDATE_HEART_BEAT_SUCCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        heart_beat: action.payload.data.value,
      };
    case PROFILE_UPDATE_TEMPERATURE_SUCCESS:
      return {
        ...state,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
        temperature: action.payload.data.value,
      };
    case PROFILE_UPDATE_WEIGHT_FAIL:
    case PROFILE_UPDATE_HEIGHT_FAIL:
    case PROFILE_UPDATE_GLYCEMIA_FAIL:
    case PROFILE_UPDATE_BLOOD_PRESSURE_FAIL:
    case PROFILE_UPDATE_HEART_BEAT_FAIL:
    case PROFILE_UPDATE_TEMPERATURE_FAIL:
      return { ...state, error: { hasError: true, message: action.payload.data.message }};
    case PROFILE_PICTURE_SEND_SUCCESS:
      return {
        ...state,
        profile_picture: action.payload.data.profile_picture,
        success: {
          hasSuccess: true,
          message: action.payload.data.message,
        },
      };
    case PROFILE_PICTURE_UPDATE:
      return { ...state, profile_picture: action.payload.data.profile_picture };
    case PROFILE_PICTURE_SEND_FAIL:
      return { ...state, error: { hasError: true, message: action.payload.data.message } };
    case CLEAR_ERROR_PROFILE:
      return { ...state, error: { hasError: false } };
    case CLEAR_SUCCESS_PROFILE:
      return { ...state, success: { hasSuccess: false } };
    case RESET_PROFILE:
      return INITIAL_STATE;
    case PROFILE_CHANGE_SELECTOR_VISIBILITY:
      return { ...state, profileSelectorOpened: action.payload.data };
  }
}
