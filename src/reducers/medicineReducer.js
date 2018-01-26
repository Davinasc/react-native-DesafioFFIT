import _ from 'lodash';
import {
  MEDICINES_LIST_SUCCESS, MEDICINES_LIST_FAIL, MEDICINE_UPDATE_CURRENT_INDEX,
  CLEAR_ERROR_MEDICINES, MEDICINE_CLEAN_FORM, MEDICINE_REMOVE_FROM_REDUCER,
  RESET_MEDICINES_LIST
} from '../constants';

const INITIAL_STATE = {
  medicines: [],
  currentIndex: -1,
  errorMedicine: { isEmpty: false, hasError: false, message: '', submessage: '' }
};

const removeMedicineFromReducer = (medicineId, state) => {
  let medicineIndex = _.findIndex(state.medicines, (medicine) => {
    return (medicine.id === medicineId);
  });
  if (medicineIndex !== undefined) {
    state.medicines.splice(medicineIndex, 1);
  }
  return state;
};

export default function medicinesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MEDICINES_LIST_SUCCESS:
      return { ...state, medicines: action.payload.medicines };
    case MEDICINES_LIST_FAIL:
      return { ...state, errorMedicine: {isEmpty: action.payload.isEmpty, hasError: action.payload.hasError,
          message: action.payload.message, submessage: action.payload.submessage}, medicines: action.payload.medicines};
    case MEDICINE_UPDATE_CURRENT_INDEX:
      return { ...state, currentIndex: action.payload.currentIndex };
    case MEDICINE_CLEAN_FORM:
      return { ...state, currentIndex: -1 };
    case CLEAR_ERROR_MEDICINES:
      return { ...state, errorMedicine: { hasError: false }};
    case MEDICINE_REMOVE_FROM_REDUCER:
      return Object.assign({}, state, removeMedicineFromReducer(action.payload.medicine, state));
    case RESET_MEDICINES_LIST:
      return INITIAL_STATE;
    default:
      return state;
  }
};

