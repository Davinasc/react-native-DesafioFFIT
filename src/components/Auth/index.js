import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, View, Text, Dimensions, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Container, Button, Icon, Header, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-easy-toast';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

import AuthForm from './AuthForm';
import CustomStatusBar from '../common/statusbar/CustomStatusBar';
import DefaultLoader from '../common/loader/DefaultLoader';
import Style from '../../utils/responsiveFactor';

import * as userActions from '../../actions/userActions';

class AuthScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (Platform.OS === 'Android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
  }

  componentDidMount() {
    if (this.props.user.forgotPasswordSuccessMsg) {
      this.refs.toast.show(this.props.user.forgotPasswordSuccessMsg);
      setTimeout(() => { this.props.clearForgotPasswordSuccessMsg(); }, 5000);
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../../lib/Images/bg_1x.png')}
        style={authStyle.backgroundImage}
      >
        <Container style={authStyle.mainContainer}>
          <Header style={authStyle.header}>
            <CustomStatusBar
              bgColor="#5C6BC0"
              theme={(Platform.OS === 'ios') ? 'dark-content' : 'light-content'}
            />
            <View style={authStyle.mainHeaderWrapper}>
              <View style={authStyle.iconWrapper}>
                <Button
                  transparent
                  onPress={() => Actions.launch()}
                >
                  <Icon
                    name="ios-arrow-back"
                    style={authStyle.headerIconStyle}
                  />
                </Button>
              </View>

              <View style={authStyle.textWrapper}>
                <Text
                  allowFontScaling={false}
                  style={authStyle.headerTextStyle}
                >
                  ENTRAR
                </Text>
              </View>

              <View style={authStyle.alignerWrapper} />
            </View>
          </Header>

          <Content contentContainerStyle={{ flex: 1 }}>
            <View style={authStyle.mainContentWrapper}>
              <View style={authStyle.formWrapper}>
                <AuthForm />
              </View>

              <View style={authStyle.additionalButtonStyle}>
                <TouchableOpacity onPress={() => Actions.register()}>
                  <Text
                    allowFontScaling={false}
                    style={authStyle.additionalButtonTextStyle}
                  >
                    Ainda não possuo <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>cadastro</Text>.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </Content>
        </Container>
        <DefaultLoader visible={this.props.loader.active.status} label={this.props.loader.active.msg} />
        <Toast
          ref="toast"
          opacity={0.6}
          position="center"
        />
      </ImageBackground>
    );
  }
}

const authStyle = new StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 10,
    elevation: 0,
  },
  mainHeaderWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  iconWrapper: {
    flex: 0.2,
    marginLeft: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerIconStyle: {
    color: '#FFFFFF',
    fontSize: 40,
    right: 20,
  },
  textWrapper: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextStyle: {
    color: '#FFFFFF',
    fontSize: Style.FONT_SIZE_24,
  },
  alignerWrapper: {
    flex: 0.1,
  },
  mainContentWrapper: {
    flex: 1,
  },
  formWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalButtonStyle: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalButtonTextStyle: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    fontSize: Style.FONT_SIZE_15,
  },
});

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
    user: state.user,
  };
};

export default connect(mapStateToProps, userActions)(AuthScreen);
