import React, { PureComponent } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { CheckBox } from 'native-base';
import PropTypes from 'prop-types';
import Style from '../../../../utils/responsiveFactor';

const styles = StyleSheet.create({
  mainHolder: {
    flex: 1,
    flexDirection: 'row',
  },
  checkBoxStyle: {
    height: 22,
    width: 22,
    paddingLeft: (Platform.OS === 'ios') ? 5 : 0,
    paddingTop: (Platform.OS === 'ios') ? 2 : 0,
  },
  labelStyle: {
    fontSize: Style.FONT_SIZE_20,
    color: '#000000',
    marginLeft: 10
  },
});

export default class CustomCheckBox extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      checked,
      label,
      labelColor,
      labelFontSize,
      checkBoxColor,
      onPress,
      borderColor,
      labelPaddingLeft,
      labelPaddingTop,
    } = this.props;

    return (
      <View style={styles.mainHolder}>
        <CheckBox
          checked={checked}
          onPress={() => onPress()}
          color={checkBoxColor}
          style={[
            styles.checkBoxStyle,
            {
              borderColor: borderColor,
            }
          ]}
        />
        <Text
          allowFontScaling={false}
          style={[
            styles.labelStyle,
            {
              color: labelColor,
              fontSize: labelFontSize,
              paddingLeft: labelPaddingLeft,
              paddingTop: labelPaddingTop,
            }
          ]}
        >
          {label}
        </Text>
      </View>
    );
  }
}


CustomCheckBox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string,
  labelFontSize: PropTypes.number,
  checkBoxColor: PropTypes.string,
  borderColor: PropTypes.string,
  onPress: PropTypes.any,
  labelPaddingLeft: PropTypes.number,
  labelPaddingTop: PropTypes.number,
};

CustomCheckBox.defaultProps = {
  checkBoxColor: '#5C6BC0',
  labelColor: '#000000',
  labelFontSize: Style.FONT_SIZE_20,
  borderColor: '#5C6BC0',
  labelPaddingLeft: 0,
  labelPaddingTop: 0,
};
