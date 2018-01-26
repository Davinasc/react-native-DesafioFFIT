import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { change } from 'redux-form';
import DeviceInfo from 'react-native-device-info';
import TimerMixin from 'react-timer-mixin';
import RealmActions from '../database/realm';

import * as profileActions from './profileActions';
// import * as medicineActions from './medicines';
// import * as notificationActions from './notification';
import {
  SIGNIN_USER_SUCCESS, SIGNIN_USER_FAIL,
  START_LOADING, STOP_LOADING, TOGGLE_REMEMBER_PASSWORD,
  CLEAN_SUCCESS_USER, CLEAN_ERROR_USER,
  RESET_TELA_INICIO, RESET_PROFILE, MEDICINES_LIST_FAIL,
  NOTIFICATION_SCHEDULE_LOCAL, INICIO_RESET, RESET_APPOINTMENTS,
  RESET_EXAMS, RESET_PRESCRIPTIONS, RESET_CHRONIC_DISEASES_LIST,
  RESET_INDICATORS, RESET_ALLERGIES, NOTIFICATION_UPDATE_LAST_REQUEST,
  DOCTOR_AUTH_RESET, NOTIFICATION_RESET_LIST,
} from '../constants'

import { signinUserRequest, signoutUserRequest } from '../api';

export const signinUser = (userData, rememberPassword) => (dispatch) => {
  dispatch({ type: START_LOADING, payload: { msg: 'Carregando...' } });
  return signinUserRequest(userData).then(res => {
    let { token, data, user } = res.data;
    let { mustAnswerQuestionary, previousAttempts, configuration, isBlocked, mustInformCard, } = user = data;

    dispatch({ type: SIGNIN_USER_SUCCESS, payload: user });
    dispatch({ type: CLEAN_ERROR_USER });
    dispatch({ type: CLEAN_SUCCESS_USER });

    onUserLoginSuccess(token, userData, rememberPassword).then(async (success) => {
      if (success) {
        if (user.medications.length > 0) {
          let medications = [], today = moment();
          user.medications.map(async medication => {
            let eachMedication = {
              id: medication.id,
              name: medication.name,
              dose: medication.dose,
              frequency: medication.frequency,
              interval: medication.interval,
              duration: medication.duration,
              starts_at: medication.starts_at,
              user_id: medication.user_id,
              updated_at: medication.updated_at,
              user_medication_alarms: [],
            };

            medication.user_medication_alarms.map(async (eachMedicationAlarm) => {
              let alarmTime = moment.unix(eachMedicationAlarm.alarm_time);
              let firstAlarmTime = moment.unix(medication.starts_at); firstAlarmTime.set({ hour: alarmTime.format('HH'), minute: alarmTime.format('mm'), second: '00' });
              let notificationId = parseInt(moment().unix() + ((Math.random() * (9999999 - 1)) + 1)); // ok, não me julgue por isso.
              let eachNotification = {
                id: notificationId,
                type: 0,
                alarm_time: firstAlarmTime.unix(),
                title: 'Lembre-se de tomar sua medicação',
                message: `${medication.name} às ${firstAlarmTime.format('HH:mm')}`,
                status: 2,
                user_medication_id: medication.id,
                duration: medication.duration,
              };
              let alarmProp = {
                id: eachNotification.id,
                title: 'Está na hora da sua medicação!',
                message: eachNotification.message,
                date: firstAlarmTime.toDate(),
                playSound: true,
                number: 10,
              };

              if (!eachNotification.duration) {
                alarmProp.repeatType = 'day';
                alarmProp.repeatTime = 86400000;
              } else {
                alarmProp.repeatType = 'day';
                alarmProp.repeatTime = (eachNotification.duration * 86400000);
              }

              if (firstAlarmTime.unix() > moment().unix()) {
                eachNotification.status = 0;
                await dispatch({
                  type: NOTIFICATION_SCHEDULE_LOCAL,
                  payload: {
                    notification: eachNotification,
                    alarm: alarmProp,
                  },
                });
              } else {
                // verifica a próxima ocorrencia
                let temporaryDate = firstAlarmTime.clone();
                let endDate = firstAlarmTime.clone().add((medication.duration - 1), 'days');

                if (endDate.unix() > moment().unix()) {
                  while (temporaryDate.unix() < endDate.unix()) {
                    if (temporaryDate.unix() > moment().unix()) {
                      eachNotification.alarm_time = temporaryDate.unix();
                      eachNotification.status = 0;
                      alarmProp.date = temporaryDate.toDate();
                      dispatch({
                        type: NOTIFICATION_SCHEDULE_LOCAL,
                        payload: {
                          notification: eachNotification,
                          alarm: alarmProp,
                        },
                      });

                      break;
                    }

                    temporaryDate.add((medication.interval) ? medication.interval : 1, 'days');
                  }
                }
              }

              eachMedicationAlarm.notification = eachNotification;
            });

            await RealmActions.save('Medication', medication);
          });
        } else {
          dispatch({
            type: MEDICINES_LIST_FAIL,
            payload: {
              isEmpty: true,
              hasError: false,
              message: 'Você não possui nenhum medicamento cadastrado.',
              submessage: '',
            },
          });
        }

        // getting user info
        await dispatch(profileActions.listProfile(true));
        dispatch({ type: STOP_LOADING });
        Actions.app()
      }
    }).catch(async (error) => {
      console.log('ERROR', error);
      console.log('ERROR', error.response);
      AsyncStorage.removeItem('token');
      await RealmActions.deleteAll();
      dispatch({ type: SIGNIN_USER_FAIL, payload: { message: error.msg } });
    });

  }).catch(async (error) => {
    console.log('ERROR', error);
    console.log('ERROR', error.response);
    AsyncStorage.removeItem('token');
    await RealmActions.deleteAll();
    let errorMessage;
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Falha de conexão com o servidor. Tempo limite atingido.';
    } else if (error.msg === 'Network Error') {
      errorMessage = 'Sem conexão com a internet.';
    } else {
      errorMessage = (error.response && error.response.data.message) ? error.response.data.message : 'Erro inesperado.';
    }

    dispatch({ type: STOP_LOADING });
    dispatch({ type: SIGNIN_USER_FAIL, payload: { message: errorMessage } });
  });
};

export const signoutUser = () => async (dispatch) => {
  dispatch({ type: START_LOADING, payload: { msg: 'Carregando...' } });
  return signoutUserRequest({ identifier: DeviceInfo.getUniqueID() }).then(async (success) => {
    AsyncStorage.removeItem('token');
    await RealmActions.deleteAll();
    PushNotification.cancelAllLocalNotifications();

    await dispatch({ type: RESET_TELA_INICIO });
    await dispatch({ type: INICIO_RESET });
    await dispatch({ type: STOP_LOADING });
    await dispatch({ type: RESET_PROFILE });
    await dispatch({ type: RESET_APPOINTMENTS });
    await dispatch({ type: RESET_EXAMS });
    await dispatch({ type: RESET_PRESCRIPTIONS });
    await dispatch({ type: RESET_CHRONIC_DISEASES_LIST });
    await dispatch({ type: RESET_INDICATORS });
    await dispatch({ type: RESET_ALLERGIES });
    await dispatch({ type: DOCTOR_AUTH_RESET });
    await dispatch({ type: NOTIFICATION_RESET_LIST });
    await dispatch({ type: NOTIFICATION_UPDATE_LAST_REQUEST, payload: { data: null } });

    Actions.launch();
  }).catch((error) => {
    // TODO: exibir erro para o usuário.
  });
};

export const toggleRememberPassword = status => async (dispatch, getState) => {
  status = status ? status : !getState().user.configuration.rememberPassword;
  if (!status) {
    await AsyncStorage.removeItem('identifier');
    await AsyncStorage.removeItem('password');
  }
  return dispatch({ type: TOGGLE_REMEMBER_PASSWORD, payload: { status } });
};

export const cleanUserErrorMessage = () => (dispatch) => {
  dispatch({ type: CLEAN_ERROR_USER });
};

export const cleanUserSuccessMessage = () => (dispatch) => {
  dispatch({ type: CLEAN_SUCCESS_USER });
};

const onUserLoginSuccess = (token, userData, rememberPassword) => {
  let asyncStorageData = [['token', token],];
  if (rememberPassword) {
    asyncStorageData.push(['identifier', userData.identifier]);
    asyncStorageData.push(['password', userData.password]);
  } else {
    AsyncStorage.removeItem('identifier');
    AsyncStorage.removeItem('password');
  }

  return new Promise((resolve, reject) => {
    AsyncStorage.multiSet(asyncStorageData, (success, err) => {
      if (err) {
        reject({ msg: 'Ocorreu um erro interno. Por favor, tente novamente.' });
      } else {
        resolve(true);
      }
    });
  });
};
