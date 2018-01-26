import moment from 'moment';
import TimerMixin from 'react-timer-mixin';
import { Actions } from 'react-native-router-flux';
import { AppState } from 'react-native';
import {
  START_LOADING, STOP_LOADING, NOTIFICATION_LIST_FAIL, NOTIFICATION_ADD_LOCAL,
  NOTIFICATION_RESET_LIST, NOTIFICATION_SET_COUNTER, NOTIFICATION_UPDATE_LAST_REQUEST,
  NOTIFICATION_CLEAR_ADD_MANY, NOTIFICATION_DELETE_FROM_REDUCER,
} from '../constants'
import RealmActions from '../database/realm';

import { getRemoteNotificationRequest, deleteNotificationRequest } from '../api';

export const getRemoteNotification = (silently) => async (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Carregando notificações...' } });
  }

  return getRemoteNotificationRequest({ date: null }).then(async (success) => {
    success = success.data.data;
    dispatch({
      type: NOTIFICATION_UPDATE_LAST_REQUEST,
      payload: {
        data: moment().unix(),
      },
    });
    let futureNotificationsForSave = [];
    let futureNotificationsForUpdate = [];
    for (let i = 0; i < success.length; i++) {
      const notification = success[i];
      const checkNotification = await RealmActions.get('Notification', `id = ${notification.id}`);
      let futureNotification = {
        id: notification.id,
        type: 1,
        alarm_time: notification.date,
        title: notification.message,
        message: notification.message,
        status: (notification.status === null) ? 1 : notification.status,
        additional_identifier: notification.data.code,
        additional_value: notification.data.local,
      };

      if (checkNotification.length <= 0) {
        await futureNotificationsForSave.push(futureNotification);
      } else {
        await futureNotificationsForUpdate.push(futureNotification);
      }
    }

    if (futureNotificationsForSave.length > 0) {
      await RealmActions.saveMany('Notification', futureNotificationsForSave);
    }

    if (futureNotificationsForUpdate.length > 0) {
      await RealmActions.updateMany('Notification', futureNotificationsForUpdate);
    }

    if (!silently) {
      dispatch({ type: STOP_LOADING });
    }
  }).catch((error) => {
    if (!silently) {
      dispatch({ type: STOP_LOADING });
    }
  });
};

export const listLocalNotifications = () => async (dispatch) => {
  dispatch({ type: START_LOADING, payload: { msg: 'Carregando notificações...' } });
  let notifications = await RealmActions.get('Notification', 'type = 0');
  if (notifications.length <= 0) {
    dispatch({ type: NOTIFICATION_LIST_FAIL, payload: { isEmpty: true, hasError: false, message: 'Você não possui notificações.', submessage: 'Acompanhe-as por aqui.' }});
    return dispatch({ type: STOP_LOADING });
  }

  notifications.map(async (notification) => {
    if (notification.alarm_time <= moment().unix() && notification.status === 0) {
      await RealmActions.update('Notification', {
        id: notification.id,
        type: notification.type,
        alarm_time: notification.alarm_time,
        title: notification.title,
        message: notification.message,
        submessage: notification.submessage,
        status: 1,
        user_medication_id: notification.user_medication_id,
        duration: notification.duration,
      });
    }
    dispatch({ type: NOTIFICATION_ADD_LOCAL, payload: { notification } });
  });
  dispatch({ type: STOP_LOADING });
};

export const listNotifications = (silently) => async (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Carregando notificações...' } });
  }
  await dispatch(getRemoteNotification(true));
  let notifications = await RealmActions.get('Notification');
  if (notifications.length <= 0) {
    dispatch({ type: NOTIFICATION_LIST_FAIL, payload: { isEmpty: true, hasError: false, message: 'Você não possui notificações.', submessage: 'Acompanhe-as por aqui.' }});
    return dispatch({ type: STOP_LOADING });
  }
  let notificationsToBeAdded = [];
  notifications.map((notification) => {
    if (notification.type === 0 || notification.type === 1) {
      let futureNotification = {
        id: notification.id,
        type: notification.type,
        alarm_time: notification.alarm_time,
        title: notification.title,
        message: notification.message,
        submessage: notification.submessage,
        status: notification.status,
        user_medication_id: notification.user_medication_id,
        additional_identifier: notification.additional_identifier,
        additional_value: notification.additional_value,
        duration: notification.duration,
      };
      notificationsToBeAdded.push(futureNotification);
    }
  });

  dispatch({ type: NOTIFICATION_CLEAR_ADD_MANY, payload: { notifications: notificationsToBeAdded } });
  if (!silently) {
    dispatch({ type: STOP_LOADING });
  }
}

export const updateNotificationsList = (silently) => async (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Carregando notificações...' } });
  }
  let notifications = await RealmActions.get('Notification');
  if (notifications.length <= 0) {
    dispatch({ type: NOTIFICATION_LIST_FAIL, payload: { isEmpty: true, hasError: false, message: 'Você não possui notificações.', submessage: 'Acompanhe-as por aqui.' }});
    return dispatch({ type: STOP_LOADING });
  }
  let notificationsToBeAdded = [];
  notifications.map((notification) => {
    notificationsToBeAdded.push(notification);
  });
  dispatch({ type: NOTIFICATION_CLEAR_ADD_MANY, payload: { notifications: notificationsToBeAdded } });
  if (!silently) {
    dispatch({ type: STOP_LOADING });
  }
}

export const handleNotificationAndroid = notification => async (dispatch) => {
  if (!notification.custom) { // local notification
    if (notification.data) {
      switch (notification.data.type) {
        default: case 1:
        Actions.notifications_group();
      }
    } else if (notification.userInteraction) {
      if (notification.userInfo && notification.userInfo.type) {
        switch (notification.userInfo.type) {
          case 2:
            TimerMixin.setTimeout(async () => {
              await dispatch(doctorAuthActions.listDoctorAuths(false));
              Actions.doctor_auth({
                fromNotification: true,
                doctorAuthId: notification.userInfo.id,
              });
            }, ((AppState.currentState === 'background') ? 1 : 8000));
            break;
        }
      } else {
        TimerMixin.setTimeout(() => {
          Actions.notifications_group();
        }, ((AppState.currentState === 'background') ? 1 : 7000));
      }
    } else if (notification.userInfo && notification.userInfo.type) {
      switch (notification.userInfo.type) {
        default: case 2:
        // TODO: alguma ação ao receber a notificação sem que o usuário pressione?
        break;
      }
    }
  }
};

export const handleNotificationIos = notification => async (dispatch) => {
  if (notification.data.remote) {
    let notificationData = notification.data.custom.a;
    switch (notificationData.type) {
      default: case 'exame':
      const notificationDetail = JSON.parse(notificationData.data);
      const futureNotification = {
        id: parseInt(notificationData.id),
        type: 1,
        alarm_time: notificationData.date,
        title: notificationData.message,
        message: notificationData.message,
        status: 1,
        additional_identifier: notificationDetail.code,
        additional_value: notificationDetail.local,
      };
      await RealmGeneralModel.save('Notification', futureNotification);
      dispatch(examAction.listExams((Actions.currentScene !== 'start_exames')));
      break;
    }
  } else if (notification.userInteraction) {
    if (notification.data && notification.data.type) {
      switch (notification.data.type) {
        case 2:
          TimerMixin.setTimeout(async () => {
            await dispatch(doctorAuthActions.listDoctorAuths(false));
            Actions.doctor_auth({
              fromNotification: true,
              doctorAuthId: notification.data.id,
            });
          }, (AppState.currentState === 'background') ? 1 : 10500);
          break;
        default:
          Actions.notifications_group();
          break;
      }
    } else {
      Actions.notifications_group();
    }
  } else {
    if (notification.foreground) {
      await dispatch(doctorAuthActions.listDoctorAuths(true));
      Actions.doctor_auth({
        fromNotification: true,
        doctorAuthId: notification.data.id,
      });
    }
  }
};

export const deleteNotificationFromReducer = (notification, type) => (dispatch) => {
  dispatch({
    type: NOTIFICATION_DELETE_FROM_REDUCER,
    payload: { notification, type }
  });
};
