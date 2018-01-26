import { change, formValueSelector, reset } from 'redux-form';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import TimerMixin from 'react-timer-mixin';

import {
  MEDICINES_LIST_SUCCESS, MEDICINES_LIST_FAIL, START_LOADING, STOP_LOADING,
  MEDICINE_UPDATE_CURRENT_INDEX, MEDICINE_CLEAN_FORM, NOTIFICATION_SCHEDULE_LOCAL,
  MEDICINE_REMOVE_FROM_REDUCER,
} from '../constants';

import { getMedicineRequest, addMedicineRequest, editMedicineRequest, deleteMedicineRequest } from '../api';
import RealmActions from '../database/realm';
import * as notificationActions from './notificationActions';

export const listMedicines = (silently) => async (dispatch) => {
  console.log('CALLING MEDICINES LIST', silently);
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Buscando medicamentos...' } });
  }
  const medicines = await RealmActions.get('Medication');
  if (medicines.length <= 0) {
    dispatch({
      type: MEDICINES_LIST_FAIL,
      payload: {
        medicines,
        isEmpty: true,
        hasError: false,
        message: 'Não existem medicamentos cadastrados.',
        submessage: 'Pressione o botão abaixo para adicionar.',
      },
    });
    if (!silently) {
      return dispatch({ type: STOP_LOADING });
    }
  }
  let finalMedicines = [];
  for (let i = 0; i < medicines.length; i++) {
    let medicine = medicines[i];
    finalMedicines.push({
      id: medicine.id,
      name: medicine.name,
      dose: medicine.dose,
      frequency: medicine.frequency,
      interval: medicine.interval,
      duration: medicine.duration,
      starts_at: medicine.starts_at,
      user_id: medicine.user_id,
      user_medication_alarms: medicine.user_medication_alarms,
    });
  }
  await dispatch({ type: MEDICINES_LIST_SUCCESS, payload: { medicines: finalMedicines } });
  console.log('FINALIZOU');
  if (!silently) {
    dispatch({ type: STOP_LOADING });
    console.log('DISPATCH NO LOADING');
  }
};

export const listMedicinesRemotely = (silently) => async (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Buscando medicamentos...' } });
  }

  return getMedicineRequest().then((res) => {
    const medications = res.data.data;
    medications.map(async medication => {
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
    if (!silently) {
      return dispatch({type: STOP_LOADING});
    }
  }).catch((error) => {
    dispatch({
      type: MEDICINES_LIST_FAIL,
      payload: {
        medicines: [],
        isEmpty: true,
        hasError: false,
        message: 'Não foi possível listar seus medicamentos.',
        submessage: '',
      },
    });
    if (!silently) {
      return dispatch({type: STOP_LOADING});
    }
  });
}

export const addMedicinesForDependent = (medications, silently) => async (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Buscando medicamentos...' } });
  }

  if (medications.length <= 0) {
    dispatch({
      type: MEDICINES_LIST_FAIL,
      payload: {
        medicines: medications,
        isEmpty: true,
        hasError: false,
        message: 'Não existem medicamentos cadastrados.',
        submessage: 'Pressione o botão abaixo para adicionar.',
      },
    });
  }

  medications.map(async medication => {
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
  if (!silently) {
    return dispatch({type: STOP_LOADING});
  }
}

export const checkMedicinesStateCount = () => (dispatch, getState) => {
  return (getState().medicines.medicines.length > 0);
};

export const changeFormValue = (formFieldName, newValue) => (dispatch) => {
  dispatch(change('medicineForm', formFieldName, newValue));
};

export const getFormValue = formFieldName => (dispatch, getState) => {
  const formSelector = formValueSelector('medicineForm');
  return formSelector(getState(), formFieldName);
};

export const sendMedicine = medication => (dispatch) => {
  dispatch({ type: START_LOADING });
  if (medication.id) {
    medication.user_medication_alarms.map((alarm) => {
      alarm.user_medication_id = medication.id;
    });

    return editMedicineRequest(medication).then(async (success) => {
      const registeredMedication = success.data.medication;
      const notifications = await RealmActions.get('Notification', 'user_medication_id = ' + registeredMedication.id);

      for (let i = notifications.length - 1; i >= 0; i--) {
        PushNotification.cancelLocalNotifications({ id: String(notifications[i].id) });
        await RealmActions.deleteOne(notifications[i]);
      }

      registeredMedication.user_medication_alarms.map(async eachMedicationAlarm => {
        const alarmTime = moment.unix(eachMedicationAlarm.alarm_time);
        let eachAlarmTime = moment.unix(registeredMedication.starts_at); eachAlarmTime.set({ hour: alarmTime.format('HH'), minute: alarmTime.format('mm'), second: '00' });
        if (eachAlarmTime.unix() < moment().unix()) {
          eachAlarmTime.add(1, 'days');
        }

        const notificationId = parseInt(moment().unix() + ((Math.random() * (9999999 - 1)) + 1)); // ok, não me julgue por isso.
        let eachNotification = {
          id: notificationId,
          type: 0,
          alarm_time: eachAlarmTime.unix(),
          created_at: eachMedicationAlarm.created_at,
          title: 'Lembre-se de tomar sua medicação',
          message: registeredMedication.name + ' às ' + eachAlarmTime.format('HH:mm'),
          status: 0,
          user_medication_id: registeredMedication.id,
          duration: registeredMedication.duration,
        };
        let alarmProp = {
          id: eachNotification.id,
          title: 'Está na hora da sua medicação!',
          message: eachNotification.message,
          date: eachAlarmTime.toDate(),
          playSound: true,
          number: 10,
          userInfo: {
            id: eachNotification.id,
          },
        };

        if (!eachNotification.duration) {
          alarmProp.repeatType = 'day';
          alarmProp.repeatTime = 86400000;
        } else {
          alarmProp.repeatType = 'day';
          alarmProp.repeatTime = (eachNotification.duration * 86400000);
        }

        let actualDate = moment(); actualDate.set({ second: 0, milisecond: 0 });
        if (actualDate.unix() !== eachAlarmTime.unix()) {
          dispatch({
            type: NOTIFICATION_SCHEDULE_LOCAL,
            payload: {
              notification: eachNotification,
              alarm: alarmProp,
            },
          });
        }
        eachMedicationAlarm.notification = eachNotification;
      });

      await RealmActions.update('Medication', registeredMedication);
      await dispatch({ type: STOP_LOADING });
      await dispatch({ type: MEDICINE_UPDATE_CURRENT_INDEX, payload: { currentIndex: -1 } });
      return Actions.medicines_list();
    }).catch((error) => {
      dispatch({ type: STOP_LOADING });
    });
  }

  return addMedicineRequest(medication).then(async success => {
    const registeredMedication = success.data.medication;
    registeredMedication.user_medication_alarms.map(async (eachMedicationAlarm) => {
      const alarmTime = moment.unix(eachMedicationAlarm.alarm_time);
      let eachAlarmTime = moment.unix(registeredMedication.starts_at); eachAlarmTime.set({ hour: alarmTime.format('HH'), minute: alarmTime.format('mm'), second: '00' });
      if (eachAlarmTime.unix() < moment().unix()) {
        eachAlarmTime.add(1, 'days');
      }

      const notificationId = parseInt(moment().unix() + ((Math.random() * (9999999 - 1)) + 1)); // ok, não me julgue por isso.
      let eachNotification = {
        id: notificationId,
        type: 0,
        alarm_time: eachAlarmTime.unix(),
        created_at: eachMedicationAlarm.created_at,
        title: 'Lembre-se de tomar sua medicação',
        message: registeredMedication.name + ' às ' + eachAlarmTime.format('HH:mm'),
        status: 0,
        user_medication_id: registeredMedication.id,
        duration: registeredMedication.duration,
      };
      let alarmProp = {
        id: eachNotification.id,
        title: 'Está na hora da sua medicação!',
        message: eachNotification.message,
        date: eachAlarmTime.toDate(),
        playSound: true,
        number: 10,
        userInfo: {
          id: eachNotification.id,
        },
      };

      if (!eachNotification.duration) {
        alarmProp.repeatType = 'day';
        alarmProp.repeatTime = 86400000;
      } else {
        alarmProp.repeatType = 'day';
        alarmProp.repeatTime = (eachNotification.duration * 86400000);
      }
      let actualDate = moment(); actualDate.set({ second: 0, milisecond: 0 });
      if (actualDate.unix() !== eachAlarmTime.unix()) {
        await dispatch({
          type: NOTIFICATION_SCHEDULE_LOCAL,
          payload: {
            notification: eachNotification,
            alarm: alarmProp,
          },
        });
      }
      eachMedicationAlarm.notification = eachNotification;
    });

    await RealmActions.save('Medication', registeredMedication);
    dispatch({ type: STOP_LOADING });
    Actions.medicines_list();
  }).catch(error => {
    dispatch({ type: STOP_LOADING });
  });
};

export const editMedicine = (id, comingFromNotificationScreen) => (dispatch) => {
  dispatch({ type: START_LOADING, payload: { msg: 'Carregando medicamento...' } });

  dispatch({ type: MEDICINE_UPDATE_CURRENT_INDEX, payload: { currentIndex: id } });
  Actions.medicine_form({ comingFromNotificationScreen });

  dispatch({ type: STOP_LOADING });
};

export const deleteMedicineFromReducer = (medicine) => (dispatch) => {
  dispatch({
    type: MEDICINE_REMOVE_FROM_REDUCER,
    payload: {
      medicine
    }
  });
}

export const deleteMedicine = (medicines, backToList) => (dispatch) => {
  dispatch({ type: START_LOADING });
  return deleteMedicineRequest(medicines).then(async (success) => {
    await medicines.map(async (medicine) => {
      let medicineObject = await RealmActions.get('Medication', `id = ${medicine}`);
      let notifications = await RealmActions.get('Notification', `user_medication_id = ${medicine}`);
      await dispatch(deleteMedicineFromReducer(medicineObject[0].id));
      for (let i = notifications.length - 1; i >= 0; i--) {
        await dispatch(notificationActions.deleteNotificationFromReducer(notifications[i].id, 'local'));
        PushNotification.cancelLocalNotifications({ id: '' + notifications[i].id });
        await RealmActions.deleteOne(notifications[i]);
      }
      await RealmActions.deleteOne(medicineObject[0]);
    });

    if (backToList) {
      dispatch({ type: MEDICINE_CLEAN_FORM });
      dispatch(reset('medicineForm'));
      dispatch({ type: STOP_LOADING });
      TimerMixin.setTimeout(() => {
        Actions.medicines_list({ fromDeleteNotification: true });
        dispatch({ type: STOP_LOADING });
      }, 500);
    } else {
      TimerMixin.setTimeout(async () => {
        await dispatch(listMedicines());
      }, 500);
      dispatch({ type: STOP_LOADING });
    }

  }).catch((error) => {
    dispatch({ type: STOP_LOADING });
  });
};

export const clearMedicineForm = () => (dispatch) => {
  dispatch({ type: MEDICINE_CLEAN_FORM });
  dispatch(reset('medicineForm'));
};
