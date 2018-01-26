import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet, Dimensions} from 'react-native';
import { Input } from 'native-base';
import PropTypes from 'prop-types';
import Style from '../../../../utils/responsiveFactor';

export default class TextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputHeight: 0,
    };
  }

  render() {
    const {
      input: {
        onChange,
        onBlur,
        ...restInput
      },
      meta: {
        touched, error,
      },
      label,
      placeholder,
      contentSizeChange,
    } = this.props;
    const renderErrors = () => {
      if (touched && error) {
        return (
          <Text
            allowFontScaling={false}
            style={textAreaStyle.textErrorStyle}
          >
            {error}
          </Text>
        );
      }
    };

    return (
      <View style={textAreaStyle.mainViewStyle}>
        <View style={textAreaStyle.mainWrapperStyle}>

          <Text style={{marginLeft: 12, color: '#000'}}>{label}</Text>
          <Input
            multiline
            style={{
              fontSize: Style.FONT_SIZE_16,
              width: Dimensions.get('window').width - 40,
              height: (Platform.OS === 'ios') ? this.state.inputHeight + 5 : this.state.inputHeight + 2,
              color: '#000000',
              padding: 0,
              marginHorizontal: 7,
              paddingRight: 7
            }}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#BBBBBB"
            {...restInput}
            onContentSizeChange={
              (event) => {
                this.setState({inputHeight: event.nativeEvent.contentSize.height});
              }}
          />
        </View>
        <View style={textAreaStyle.errorMainWrapperStyle}>
          <View style={textAreaStyle.errorViewStyle}>
            {renderErrors()}
          </View>
        </View>
      </View>
    );
  }
}

const textAreaStyle = StyleSheet.create({
  mainViewStyle: {
    width: Dimensions.get('window').width -40,
    flex: 1,
    marginTop: 20,
  },
  mainWrapperStyle: {
    flexDirection: 'column',
    flex: 1,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  textErrorStyle: {
    color: '#d44539',
    fontSize: Style.FONT_SIZE_12,
    marginTop: 10,
  },
  errorMainWrapperStyle: {
    flexDirection: 'row',
    marginTop: 5,
  },
  errorViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});


TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object,
  meta: PropTypes.object,
  contentSizeChange: PropTypes.any.isRequired,
  placeholder: PropTypes.string
};
