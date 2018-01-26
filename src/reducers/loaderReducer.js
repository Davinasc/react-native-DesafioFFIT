import {
  START_LOADING, START_LOADING_APPOINTMENT, START_LOADING_EXAM,
  START_LOADING_PRESCRIPTION, START_LOADING_INDICATOR, STOP_LOADING_INDICATOR,
  STOP_LOADING, STOP_LOADING_APPOINTMENT, STOP_LOADING_EXAM,
  STOP_LOADING_PRESCRIPTION,
} from '../constants';

const INITIAL_STATE = {
  active: {
    status: false,
    msg: null,
  },
  appointment: {
    status: false,
    msg: null,
  },
  exam: {
    status: false,
    msg: null,
  },
  prescription: {
    status: false,
    msg: null,
  },
  indicator: {
    status: false,
    msg: null,
  },
}

export default function loaderReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        active: {
          status: true,
          msg: (action.payload && action.payload.msg) ? action.payload.msg : 'Carregando...',
        },
      };
    case START_LOADING_APPOINTMENT:
      return {
        ...state,
        appointment: {
          status: true,
          msg: (action.payload && action.payload.msg) ? action.payload.msg : 'Carregando...',
        },
      };
    case START_LOADING_EXAM:
      return {
        ...state,
        exam: {
          status: true,
          msg: (action.payload && action.payload.msg) ? action.payload.msg : 'Carregando...',
        },
      };
    case START_LOADING_PRESCRIPTION:
      return {
        ...state,
        prescription: {
          status: true,
          msg: (action.payload && action.payload.msg) ? action.payload.msg : 'Carregando...',
        },
      };
    case START_LOADING_INDICATOR:
      return {
        ...state,
        indicator: {
          status: true,
          msg: (action.payload && action.payload.msg) ? action.payload.msg : 'Carregando...',
        },
      };
    case STOP_LOADING:
      return {
        ...state,
        active: {
          status: false,
          msg: null,
        },
      };
    case STOP_LOADING_APPOINTMENT:
      return {
        ...state,
        appointment: {
          status: false,
          msg: null,
        },
      };
    case STOP_LOADING_EXAM:
      return {
        ...state,
        exam: {
          status: false,
          msg: null,
        },
      };
    case STOP_LOADING_PRESCRIPTION:
      return {
        ...state,
        prescription: {
          status: false,
          msg: null,
        },
      };
    case STOP_LOADING_INDICATOR:
      return {
        ...state,
        indicator: {
          status: false,
          msg: null,
        },
      };
    default:
      return state;
  }
}
