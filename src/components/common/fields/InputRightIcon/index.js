import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Icon } from 'native-base'
import PropTypes from 'prop-types';
import InputRightIconGenericStyle from './style';

export default class InputRightIconGeneric extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      secure: props.secure,
    };
  }

  render() {
    const {
      meta: {
        touched,
        error,
      },
      label,
      labelColor,
      inputTextColor,
      editable,
      keyboardType,
      imagePath,
      imageText,
      imageTextColor,
      buttonAction,
      fieldLineColor,
      placeholder,
      onChange,
      onFocus,
      onBlur,
      value,
      onEndEditing,
      placeholderTextColor,
    } = this.props;

    const renderErrors = () => {
      if (touched && error) {
        return (
          <Text
            allowFontScaling={false}
            style={InputRightIconGenericStyle.errorTextStyle}
          >
            {error}
          </Text>
        );
      }
    };

    return (
      <View style={InputRightIconGenericStyle.mainHolder}>

        <View>
          <Text style={{color: labelColor}}>{label}</Text>
          <View style={[InputRightIconGenericStyle.fieldHolder, {
            borderBottomColor: fieldLineColor
          }]}>
            <TextInput
              editable={editable}
              keyboardType={keyboardType}
              ref={ref => this.textInput = ref}
              onChangeText={onChange? onChange : (newValue) => {this.textInput.value = newValue}}
              onFocus={onFocus}
              onBlur={onBlur}
              underlineColorAndroid='rgba(0,0,0,0)'
              secureTextEntry={this.state.secure}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              value={value? value.toString() : ''}
              onEndEditing={onEndEditing}
              style={[InputRightIconGenericStyle.input, {color: inputTextColor}]}
            />

            <TouchableOpacity
              style={InputRightIconGenericStyle.buttonHolder}
              onPress={() => {
                (buttonAction) ? buttonAction() : this.setState({
                  secure: !this.state.secure,
                });
              }}
            >
              <Image
                source={imagePath}
                style={InputRightIconGenericStyle.buttonImageStyle}
              />
              <View>
                {
                  !this.props.iconName ?
                    (
                      <Text
                        allowFontScaling={false}
                        style={
                          [
                            InputRightIconGenericStyle.buttonTextStyle,
                            {color: imageTextColor},
                          ]
                        }
                      >
                        {imageText}
                      </Text>
                    ) :
                    (
                      <Icon
                        name={this.props.iconName}
                        style={{
                          color: this.props.iconColor,
                        }}
                      />
                    )
                }
              </View>
            </TouchableOpacity>

          </View>
        </View>

        <View style={InputRightIconGenericStyle.errorHolder}>
          {renderErrors()}
        </View>
      </View>
    );
  }
}

InputRightIconGeneric.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  keyboardType: PropTypes.string,
  imagePath: PropTypes.any,
  buttonAction: PropTypes.any,
  imageText: PropTypes.string,
  imageTextColor: PropTypes.string,
  fieldLineColor: PropTypes.string,
  inputTextColor: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
};

InputRightIconGeneric.defaultProps = {
  input: {},
  meta: {},
  labelColor: '#252525',
  keyboardType: 'default',
  imagePath: undefined,
  buttonAction: undefined,
  imageText: '',
  imageTextColor: '#868686',
  fieldLineColor: '#CCCCCC',
  inputTextColor: '#5C6BC0',
  placeholder: 'inserir placeholder',
  placeholderTextColor: '#BBBBBB',
  value: '',
};
