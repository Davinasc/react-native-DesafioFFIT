import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import InputBothSidesIconGenericStyle from './style';

export default class InputBothSidesIconGeneric extends PureComponent {
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
      buttonAction,
      fieldLineColor,
      placeholder,
      leftIconName,
      rightIconName,
      leftIconColor,
      rightIconColor,
      placeholderTextColor
    } = this.props;

    const renderErrors = () => {
      if (touched && error) {
        return (
          <Text
            allowFontScaling={false}
            style={InputBothSidesIconGenericStyle.errorTextStyle}
          >
            {error}
          </Text>
        );
      }
    };

    return (
      <View style={InputBothSidesIconGenericStyle.mainHolder}>

        <View style={[InputBothSidesIconGenericStyle.subViewHolder, {
          borderBottomColor: fieldLineColor
        }]}>

          <View style={InputBothSidesIconGenericStyle.leftIconHolder}>
            <Icon
              name={leftIconName}
              style={[
                InputBothSidesIconGenericStyle.leftIcon,
                {color: leftIconColor},
              ]}
            />
          </View>

          <View style={{flex: 0.9}}>
            <Text style={{color: labelColor}}>{label}</Text>
            <View style={InputBothSidesIconGenericStyle.fieldHolder}>
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
                style={[InputBothSidesIconGenericStyle.input, {color: inputTextColor}]}
              />

              <TouchableOpacity
                style={InputBothSidesIconGenericStyle.buttonHolder}
                onPress={() => {
                  (buttonAction) ? buttonAction() : this.setState({
                    secure: !this.state.secure,
                  });
                }}
              >
                <Icon
                  name={rightIconName}
                  style={[
                    InputBothSidesIconGenericStyle.rightIcon,
                    {color: rightIconColor},
                  ]}
                />
              </TouchableOpacity>

            </View>
          </View>
        </View>

        <View style={InputBothSidesIconGenericStyle.errorHolder}>
          {renderErrors()}
        </View>
      </View>
    );
  }
}

InputBothSidesIconGeneric.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  keyboardType: PropTypes.string,
  buttonAction: PropTypes.any,
  fieldLineColor: PropTypes.string,
  inputTextColor: PropTypes.string,
  placeholder: PropTypes.string,
  leftIconName: PropTypes.string,
  leftIconColor: PropTypes.string,
  rightIconName: PropTypes.string,
  rightIconColor: PropTypes.string,
};

InputBothSidesIconGeneric.defaultProps = {
  input: {},
  meta: {},
  labelColor: '#252525',
  keyboardType: 'default',
  buttonAction: undefined,
  leftIconName: '',
  rightIconName: '',
  fieldLineColor: '#CCCCCC',
  inputTextColor: '#5C6BC0',
  leftIconColor: '#5C6BC0',
  rightIconColor: '#5C6BC0',
  placeholder: 'inserir placeholder',
  placeholderTextColor: '#CCCCCC',
};
