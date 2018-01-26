import React, { PureComponent } from 'react';
import { View, Text, TextInput } from 'react-native'
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import InputLeftIconGenericStyle from './style';

export default class InputLeftIconGeneric extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { secure: props.secure };
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
      iconColor,
      iconName,
      fieldLineColor,
      placeholder,
      placeholderTextColor,
    } = this.props;

    const renderErrors = () => {
      if (touched && error) {
        return (
          <Text
            allowFontScaling={false}
            style={InputLeftIconGenericStyle.errorTextStyle}
          >
            {error}
          </Text>
        );
      }
    };

    return (
      <View style={InputLeftIconGenericStyle.mainHolder}>
        <View  style={[InputLeftIconGenericStyle.fieldHolder, {borderBottomColor: fieldLineColor}]}>
          <View style={InputLeftIconGenericStyle.iconHolder}>
            <Icon
              name={iconName}
              style={[
                InputLeftIconGenericStyle.icon,
                {color: iconColor},
              ]}
            />
          </View>

          <View style={InputLeftIconGenericStyle.inputHolder}>
            <Text style={{color: labelColor}}>{label}</Text>
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
              style={[InputLeftIconGenericStyle.input, {color: inputTextColor}]}
              {...restInput}
            />
          </View>
        </View>

        <View style={InputLeftIconGenericStyle.errorHolder}>
          {renderErrors()}
        </View>
      </View>
    );
  }
}

InputLeftIconGeneric.propTypes = {
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
  iconColor: PropTypes.string,
  iconName: PropTypes.string,
};

InputLeftIconGeneric.defaultProps = {
  input: {},
  meta: {},
  labelColor: '#252525',
  keyboardType: 'default',
  imagePath: undefined,
  buttonAction: undefined,
  fieldLineColor: '#CCCCCC',
  inputTextColor: '#5C6BC0',
  iconColor: '#5C6BC0',
  iconName: '',
  placeholder: 'inserir placeholder',
  placeholderTextColor: '#CCCCCC',
};
