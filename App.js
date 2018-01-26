import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Provider, connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import PushNotification from 'react-native-push-notification';

import * as notificationActions from './src/actions/notificationActions';

import configureStore from './src/config/configureStore';
import RouterComponent from './src/Router';

export default class App extends Component<{}> {
  constructor() {
    super();
    this.store = configureStore();
  }

  componentDidMount() {
    PushNotification.configure({
      onRegister: function (token) {
        // void...
      },

      onNotification: async function (notification) {
        if (Platform.OS === 'android') {
          await dispatch(notificationActions.handleNotificationAndroid(notification));
        } else {
          await dispatch(notificationActions.handleNotificationIos(notification));
        }
      },

      permissions: {
        alert: true,
        badge: false,
        sound: true,
      },

      popInitialNotification: (Platform.OS === 'ios'),
      requestPermissions: true,
    });
  }

  render() {
    const RouterWithRedux = connect()(RouterComponent);
    return (
      <Provider store={this.store}>
        <RouterWithRedux />
      </Provider>
    );
  }
}
