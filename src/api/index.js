import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { config as appConfig } from '../config/baseConfig';

let axiosAPI = axios.create({
  baseURL: appConfig.baseURL,
  timeout: 100000,
});

axiosAPI.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

const SIGNIN_POST_URL = '/signin';
const SIGNUP_POST_URL = '/signup';
const SIGNOUT_URL = '/signout';
const CHANGE_PASSWORD_URL = '/reset-password';
const CHECK_QUESTIONS_URL = '/validateQuestions';
const CONFIRM_CARD_URL = '/validate-card-number';

const LIST_APPOINTMENTS_URL = '/appointments';
const DETAIL_APPOINTMENT_URL = '/appointment/details';

const LIST_EXAMS_URL = '/exams';
const DETAIL_EXAM_URL = '/exam/details';
const DETAIL_EXAM_PDF_URL = '/exam/pdf';

const LIST_PRESCRIPTIONS_URL = '/prescriptions';
const DETAIL_PRESCRIPTION_URL = '/prescription/details';

const LIST_INDICATORS_URL = '/indicators';
const UPDATE_INDICATORS_URL = '/indicators';
const INDICATORS_DATA_URL = '/indicators/data';

const LIST_PROFILE_URL = '/profile';
const SEND_PROFILE_URL = '/insert-profile-value';
const SEND_PROFILE_PICTURE_URL = '/insert-profile-picture';
const REMOVE_PROFILE_PICTURE_URL = '/delete-profile-picture';
const LIST_PROFILE_ALLERGIES_URL = '/allergies';

const LIST_INTEGRATED_LOCAL = '/integrated-places';

const LIST_HISTORIC_URL = '/profile-value-history';

const DELETE_MEDICATION = '/medication/delete';

const MEDICINE_ADD_URL = '/medication/add';
const MEDICINE_EDIT_URL = '/medication/edit';
const MEDICINE_DELETE_URL = '/medication/delete';
const MEDICINE_LIST_URL = '/medications';

const CHRONIC_DISEASE_LIST_URL = '/chronic-diseases';
const CHRONIC_DISEASE_ADD_URL = '/chronic-diseases/add';
const CHRONIC_DISEASE_EDIT_URL = '/chronic-diseases/edit';

const FORGOT_PASSWORD_URL = '/recover-password';
const FORGOT_PASSWORD_VALIDATE_TOKEN_URL = '/validate-password-recover-token';
const FORGOT_PASSWORD_CHANGE_PASSWORD_URL = '/recover-password-token';

const NOTIFICATION_REGISTER_DEVICE_URL = '/notification/device';
const NOTIFICATION_GET_REMOTE_URL = '/notification';
const NOTIFICATION_DELETE_URL = '/notification/delete'
const NOTIFICATION_CHECK_READED = '/notification/read';

const SETTINGS_GET_URL = '/cache_settings';

const SHARED_ACCESS_GET_PROFILES_URL = '/shared-access';

const DOCTOR_AUTH_LIST_URL = '/doctor-auth-list';
const DOCTOR_AUTH_ADD_URL = '/doctor-auth';
const DOCTOR_AUTH_REMOVE_URL = '/remove-doctor-auth';

export function signinUserRequest(userData) {
  userData.company = appConfig.company;
  return axiosAPI.post(SIGNIN_POST_URL, userData);
}

export function signupUserRequest(userData) {
  userData.company = appConfig.company;
  return axiosAPI.post(SIGNUP_POST_URL, userData);
}

export function signoutUserRequest(userData) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(SIGNOUT_URL, userData, { headers: { token } });
  });
}

export function changeUserPassword(userData) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(CHANGE_PASSWORD_URL, userData, { headers: { token } });
  });
}

export function checkQuestionUserRequest(userData) {
  return AsyncStorage.getItem('tempToken').then((token) => {
    return axiosAPI.post(CHECK_QUESTIONS_URL, userData, { headers: { token } });
  });
}

export function getAppointments() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_APPOINTMENTS_URL, { headers: { token } });
  });
}

export function getAppointmentByCode(userData) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(DETAIL_APPOINTMENT_URL, userData, { headers: { token } });
  });
}

export function getExams() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_EXAMS_URL, { headers: { token } });
  });
}

export function getExamByCode(userData) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(DETAIL_EXAM_URL, userData, { headers: { token } });
  });
}

export function getExamPdfByCode(code, validate) {
  return AsyncStorage.getItem('token').then((token) => {
    if (validate) {
      return axiosAPI.get(`${DETAIL_EXAM_PDF_URL}?codes=${code}&token=${token}`, { headers: { token } });
    } else {
      return appConfig.baseURL + DETAIL_EXAM_PDF_URL + '?pdf=true&codes=' + code + '&token=' + token;
    }
  });
}

export function getExamPdfByCodes(codes, validate) {
  return AsyncStorage.getItem('token').then((token) => {
    if (validate) {
      return axiosAPI.get(DETAIL_EXAM_PDF_URL + '?codes=' + codes + '&token=' + token, { headers: { token } });
    } else {
      return appConfig.baseURL + DETAIL_EXAM_PDF_URL + '?pdf=true&codes=' + codes + '&token=' + token;
    }
  });
}

export function getPrescriptions() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_PRESCRIPTIONS_URL, { headers: { token } });
  });
}

export function getPrescriptionByCode(userData) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(DETAIL_PRESCRIPTION_URL, userData, { headers: { token } });
  });
}

export function getIndicatorsRequest() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_INDICATORS_URL, { headers: { token } });
  });
}

export function updateIndicatorsSelectionRequest(indicatorIds) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.put(UPDATE_INDICATORS_URL, { indicatorIds }, { headers: { token } });
  });
}

export function getProfile() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_PROFILE_URL, { headers: { token } });
  });
}

export async function sendProfileInfo(profileData) {
  await AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(SEND_PROFILE_URL, profileData, { headers:{ token } });
  });
}

export function sendProfilePictureRequest(profileData) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(SEND_PROFILE_PICTURE_URL, profileData, { headers: { token } });
  });
}

export function removeProfilePictureRequest() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.delete(REMOVE_PROFILE_PICTURE_URL, { headers: { token } });
  });
}

export function getIntegratedLocal() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_INTEGRATED_LOCAL, { headers: { token } });
  });
}

export function getAllergies() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_PROFILE_ALLERGIES_URL, { headers: { token } });
  });
}

export function getHistoric(type) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(LIST_HISTORIC_URL + '/' + type, { headers: { token } });
  });
}

export function validateCardNumber(cardData) {
  return AsyncStorage.getItem('tempToken').then((token) => {
    return axiosAPI.post(CONFIRM_CARD_URL, cardData, { headers: { token } });
  });
}

export function getIndicatorsDataRequest(indicatorIds, calendarType, data) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(INDICATORS_DATA_URL, { indicatorIds, calendarType, data }, { headers: { token } });
  });
}

export function getIndicatorsRangeRequest(data) {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.post(INDICATORS_DATA_URL, data, { headers: { token } });
  });
}

export function getMedicineRequest() {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.get(MEDICINE_LIST_URL, { headers: { token } });
  });
}

export function addMedicineRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(MEDICINE_ADD_URL, data, { headers: { token } });
  });
}

export function editMedicineRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.put(MEDICINE_EDIT_URL, data, { headers: { token } });
  });
}

export function deleteMedicineRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(MEDICINE_DELETE_URL, data, { headers: { token } });
  });
}

export function addChronicDiseaseRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(CHRONIC_DISEASE_ADD_URL, data, { headers: { token } }).then((response) => {
      return response.data.data;
    });
  });
}

export function editChronicDiseaseRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.put(CHRONIC_DISEASE_EDIT_URL, data, { headers: { token } }).then(response => {
      return response.data.data;
    });
  });
}

export function getChronicDiseasesRequest() {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.get(CHRONIC_DISEASE_LIST_URL, { headers: { token } }).then(response => {
      return response.data.data;
    });
  });
}

export function forgotPasswordRequest(data) {
  data.company = appConfig.company;
  return axiosAPI.post(FORGOT_PASSWORD_URL, data);
}

export function forgotPasswordValidateTokenRequest(data) {
  data.company = appConfig.company;
  return axiosAPI.post(FORGOT_PASSWORD_VALIDATE_TOKEN_URL, data);
}

export function forgotPasswordChangePasswordRequest(data) {
  data.company = appConfig.company;
  return axiosAPI.post(FORGOT_PASSWORD_CHANGE_PASSWORD_URL, data);
}

export function registerDeviceForNotificationsRequest(data, token) {
  return axiosAPI.post(NOTIFICATION_REGISTER_DEVICE_URL, data, { headers: { token } });
}

export function getRemoteNotificationRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(NOTIFICATION_GET_REMOTE_URL, data, { headers: { token } });
  });
}

export function deleteNotificationRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(NOTIFICATION_DELETE_URL, data, { headers: { token } });
  });
}

export function checkNotificationAsReadedRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(NOTIFICATION_CHECK_READED, data, { headers: { token } });
  });
}

export function getSettingsRequest() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(SETTINGS_GET_URL, { headers: { token } });
  });
}

export function getUserDependentsRequest() {
  return AsyncStorage.getItem('holder').then((holderJson) => {
    const holder = JSON.parse(holderJson);
    return axiosAPI.get(SHARED_ACCESS_GET_PROFILES_URL, { headers: { token: holder.token } });
  });
}

export function getDoctorAuthRequest() {
  return AsyncStorage.getItem('token').then((token) => {
    return axiosAPI.get(DOCTOR_AUTH_LIST_URL, { headers: { token } });
  });
}

export function addDoctorAuthRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(DOCTOR_AUTH_ADD_URL, data, { headers: { token } });
  });
}

export function removeDoctorAuthRequest(data) {
  return AsyncStorage.getItem('token').then(token => {
    return axiosAPI.post(DOCTOR_AUTH_REMOVE_URL, data, { headers: { token } });
  });
}
