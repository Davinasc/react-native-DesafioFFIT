import React, { PureComponent } from 'react';
import { AsyncStorage, Image, View, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import SplashScreenPlugin from 'react-native-splash-screen';
import FLAnimatedImage from 'react-native-flanimatedimage';
import TimerMixin from 'react-timer-mixin';
import { connect } from 'react-redux';
import to from 'await-to-js';

import CustomStatusBar from './components/common/statusbar/CustomStatusBar';
import Style from './utils/responsiveFactor';

import * as profileActions from './actions/profileActions';
// import * as userActions from './actions/userActions';

class SplashScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  async checkTokenLazily() {
    const response = await to(AsyncStorage.getItem('token'));
    return response[1] ? Actions.app() : Actions.launch();
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      SplashScreenPlugin.hide();
      TimerMixin.setTimeout(() => {
        this.checkTokenLazily();
      }, Platform.OS === 'android' ? 5000 : 10500);
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then(async token => {
      if (token) {
        this.props.profileActions.getProfileInfo(true);
      }
    }).catch(error => {
      // void
    });
  }

  render() {
    return (
      <View>
        <CustomStatusBar
          bgColor="#5C6BC0"
          theme={(Platform.OS === 'ios') ? 'dark-content' : 'light-content'}
        />
        {
          (Platform.OS === 'android') ?
            <Image
              source={require('./lib/Images/splash.gif')}
              style={{
                width: Style.DEVICE_WIDTH,
                height: Style.DEVICE_HEIGHT,
              }}
              onLoadEnd={this.checkTokenLazily}
            /> :
            <FLAnimatedImage
              style={{
                width: Style.DEVICE_WIDTH,
                height: Style.DEVICE_HEIGHT,
              }}
              source={require('./lib/Images/splash.gif')}
              onLoadEnd={this.checkTokenLazily}
              resizeMode={'stretch'}
            />
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // profileActions: bindActionCreators(profileActions, dispatch),
    // userActions: bindActionCreators(userActions, dispatch),
    dispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
