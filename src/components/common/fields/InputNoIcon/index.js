import React, { PureComponent } from 'react';
import { View, Text, TextInput } from 'react-native'
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import InputNoIconGenericStyle from './style';

export default class InputNoIconGeneric extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      secure: props.secure,
    };
  }


  render() {
    const {
      input: {
        onChange,
        onFocus,
        onBlur,
        ...restInput
      },
      meta: {
        touched,
        error,
      },
      label,
      labelColor,
      inputTextColor,
      editable,
      keyboardType,
      fieldLineColor,
      placeholder,
      placeholderTextColor,
    } = this.props;

    const renderErrors = () => {
      if (touched && error) {
        return (
          <Text
            allowFontScaling={false}
            style={InputNoIconGenericStyle.errorTextStyle}
          >
            {error}
          </Text>
        );
      }
    };

    return (
      <View style={InputNoIconGenericStyle.mainHolder}>

        <View  style={[InputNoIconGenericStyle.fieldHolder, {borderBottomColor: fieldLineColor}]}>
          <Text style={{color: labelColor, marginLeft: 12}}>{label}</Text>
          <TextInput
            editable={editable}
            keyboardType={keyboardType}
            onChangeText={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            underlineColorAndroid='rgba(0,0,0,0)'
            secureTextEntry={this.state.secure}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            {...restInput}
            style={[InputNoIconGenericStyle.input, {color: inputTextColor}]}
          />
        </View>

        <View style={InputNoIconGenericStyle.errorHolder}>
          {renderErrors()}
        </View>
      </View>
    );
  }
}

InputNoIconGeneric.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  keyboardType: PropTypes.string,
  imagePath: PropTypes.any,
  buttonAction: PropTypes.any,
  fieldLineColor: PropTypes.string,
  inputTextColor: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconName: PropTypes.string,
};

InputNoIconGeneric.defaultProps = {
  input: {},
  meta: {},
  labelColor: '#252525',
  keyboardType: 'default',
  fieldLineColor: '#CCCCCC',
  inputTextColor: '#111',
  placeholder: 'inserir placeholder',
  placeholderTextColor: '#CCCCCC',
};
