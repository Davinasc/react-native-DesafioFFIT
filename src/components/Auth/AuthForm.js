import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Dimensions, AsyncStorage, Platform, Image, StyleSheet, Keyboard } from 'react-native';
import { Button } from 'native-base';
import { Field, reduxForm } from 'redux-form';
import { Actions } from 'react-native-router-flux';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { bindActionCreators } from 'redux';

import Style from './../../utils/responsiveFactor';
import InputLeftIconGeneric from '../common/fields/InputLeftIconGeneric';
import InputBothSidesIconGeneric from '../common/fields/InputBothSidesIcon';

import * as userActions from '../../actions/userActions';

const validate = (values) => {
  const errors = {};

  if (values.identifier && values.identifier && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.identifier.trim()) && !/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/i.test(values.identifier.trim())) {
    errors.identifier = 'Campo em formato inválido';
  }

  if (!values.identifier) {
    errors.identifier = 'Campo obrigatório';
  }

  if (!values.password) {
    errors.password = 'Campo obrigatório';
  }

  return errors;
};

class AuthForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  componentDidMount() {
    const { initialize } = this.props;
    this.props.userActions.cleanUserErrorMessage();
    this.props.userActions.cleanUserSuccessMessage();

    AsyncStorage.multiGet(['password', 'identifier']).then((values) => {
      let [[key1, password], [key2, identifier]] = values;
      if (password && identifier) {
        initialize({ password, identifier });
        this.toggleRememberPassword(true);
      } else {
        initialize({ password: '', identifier: '' })
      }
    });
  }

  componentWillUnmount() {
    this.props.userActions.cleanUserErrorMessage();
  }

  toggleRememberPassword(status) {
    this.props.userActions.toggleRememberPassword(status);
  }

  handleFormSubmit({ identifier, password }) {
    Keyboard.dismiss();
    return this.props.userActions.signinUser({
      identifier: identifier.trim(),
      password,
    }, this.props.rememberPassword);
  }


  render() {
    const {
      rememberPassword,
      handleSubmit,
    } = this.props;
    const proportion = Dimensions.get('window').height / Dimensions.get('window').width;
    return (
      <View style={loginStyle.mainWrapper}>

        <View style={[
          loginStyle.itemWrapper,
          {
            flex: (Platform.OS === 'ios' && proportion <= 1.5) ? 0.24 : 0.21,
          },
        ]}>
          <Field
            name="identifier"
            component={InputLeftIconGeneric}
            label="E-mail ou CPF"
            labelColor="#5C6BC0"
            fieldLineColor="#5C6BC0"
            iconName="md-person"
            keyboardType="email-address"
            placeholder="Ex: 123.456.789-12"
            editable
          />
        </View>

        <View style={[
          loginStyle.itemWrapper,
          {
            flex: (Platform.OS === 'ios' && proportion <= 1.5) ? 0.24 : 0.21,
          },
        ]}>
          <Field
            name="password"
            component={InputBothSidesIconGeneric}
            label="Senha"
            labelColor="#5C6BC0"
            fieldLineColor="#5C6BC0"
            leftIconName="md-lock"
            rightIconName="md-eye"
            keyboardType="default"
            placeholder="Ex: senha123"
            editable
            secure
          />
        </View>

        <View style={[
          loginStyle.itemWrapper,
          {
            flex: 0.1,
            marginBottom: 20,
          },
        ]}>
          <TouchableOpacity
            onPress={() => { this.toggleRememberPassword(); }}
            style={loginStyle.checkBox}
          >
            <View style={loginStyle.checkBoxWrapper}>
              <Image
                source={!!rememberPassword ? require('../../lib/Images/cbenabled.png') : require('../../lib/Images/cbdisabled.png')}
                style={loginStyle.checkBoxImage}
              />
              <Text
                allowFontScaling={false}
                style={loginStyle.checkBoxText}
              >
                Lembrar usuário e senha
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={loginStyle.buttonWrapper}>
          <Button
            small
            rounded
            style={loginStyle.button}
            onPress={handleSubmit(this.handleFormSubmit.bind(this))}
          >
            <Text
              allowFontScaling={false}
              style={loginStyle.buttonText}
            >
              ENTRAR
            </Text>
          </Button>
        </View>

        <View style={loginStyle.forgotPasswordWrapper}>
          <TouchableOpacity onPress={() => { Actions.forgot_password(); }}>
            <Text allowFontScaling={false} style={loginStyle.forgotPasswordText}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyle.errorWrapper}>
          {
            (this.props.user.error.hasError) ?
              (
                <Text
                  allowFontScaling={false}
                  style={loginStyle.error}
                >
                  {this.props.user.error.message}
                </Text>
              )
              :
              null
          }
        </View>
      </View>
    );
  }
}

const loginStyle = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    width: (Dimensions.get('window').width - 20),
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  itemWrapper: {
    flex: 0.41,
    width: (Dimensions.get('window').width - 40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  checkBox: {
    width: (Dimensions.get('window').width - 50),
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  checkBoxWrapper: {
    width: (Dimensions.get('window').width - 50),
    flexDirection: 'row',
    marginLeft: (Platform.OS === 'ios') ? -3 : -2,
  },
  checkBoxImage: {
    width: 24,
    height: 24,
  },
  checkBoxText: {
    fontSize: Style.FONT_SIZE_18,
    color: '#5C6BC0',
    marginLeft: 7,
  },
  buttonWrapper: {
    flex: 0.2,
    flexDirection: 'row',
    width: (Dimensions.get('window').width - 50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: Dimensions.get('window').width * 0.9,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Style.FONT_SIZE_18,
    fontWeight: 'bold',
  },
  forgotPasswordWrapper: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: Style.FONT_SIZE_19,
    color: '#5C6BC0',
  },
  errorWrapper: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  error: {
    color: '#d44539',
    fontSize: Style.FONT_SIZE_12,
  },
});

const mapStateToProps = (state) => {
  return {
    rememberPassword: state.user.configuration.rememberPassword,
    user: state.user,
    loader: state.loader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    dispatch: dispatch,
  }
};

const authReduxForm = reduxForm({
  form: 'authForm',
  touchOnBlur: true,
  destroyOnUnmount: true,
  validate
})(AuthForm);

export default connect(mapStateToProps, mapDispatchToProps)(authReduxForm);
