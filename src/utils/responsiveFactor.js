import React from 'react'
import { Platform, Dimensions } from 'react-native';

// Precalculate Device Dimensions for better performance
const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

// Calculating ratio from iPhone breakpoints
const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1 ;
const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1 ;

// We set our base font size value
const base_unit = 16;

// We're simulating EM by changing font size according to Ratio
const unit = base_unit * ratioX;

// We add an em() shortcut function
function em(value) {
  return unit * value;
}

export default Style = {

  // GENERAL
  DEVICE_WIDTH: x,
  DEVICE_HEIGHT: y,
  RATIO_X: ratioX,
  RATIO_Y: ratioY,
  UNIT: em(1),
  PADDING: em(1.25),

  // FONT
  FONT_SIZE_6: em((Platform.OS === 'ios') ? 0.50 : 0.40),
  FONT_SIZE_8: em((Platform.OS === 'ios') ? 0.60 : 0.55),
  FONT_SIZE_10: em((Platform.OS === 'ios') ? 0.70 : 0.65),
  FONT_SIZE_11: em((Platform.OS === 'ios') ? 0.80 : 0.70),
  FONT_SIZE_12: em((Platform.OS === 'ios') ? 0.90 : 0.85),
  FONT_SIZE_13: em((Platform.OS === 'ios') ? 0.95 : 0.90),
  FONT_SIZE_14: em((Platform.OS === 'ios') ? 1.00 : 0.95),
  FONT_SIZE_15: em((Platform.OS === 'ios') ? 1.20 : 1.15),
  FONT_SIZE_16: em((Platform.OS === 'ios') ? 1.20 : 1.15),
  FONT_SIZE_17: em((Platform.OS === 'ios') ? 1.20 : 1.15),
  FONT_SIZE_18: em((Platform.OS === 'ios') ? 1.05 : 1.0),
  FONT_SIZE_19: em((Platform.OS === 'ios') ? 1.15 : 1.1),
  FONT_SIZE_20: em((Platform.OS === 'ios') ? 1.45 : 1.40),
  FONT_SIZE_22: em((Platform.OS === 'ios') ? 1.55 : 1.45),
  FONT_SIZE_24: em((Platform.OS === 'ios') ? 1.75 : 1.70),
  FONT_SIZE_26: em((Platform.OS === 'ios') ? 1.85 : 1.75),
  FONT_SIZE_28: em((Platform.OS === 'ios') ? 1.95 : 1.80),
  FONT_SIZE_30: em((Platform.OS === 'ios') ? 2.00 : 1.90),
  FONT_SIZE_32: em((Platform.OS === 'ios') ? 2.10 : 1.90),
  FONT_SIZE_34: em((Platform.OS === 'ios') ? 2.15 : 1.90),
  FONT_SIZE_36: em((Platform.OS === 'ios') ? 2.20 : 1.95),
  FONT_SIZE_38: em((Platform.OS === 'ios') ? 2.25 : 2.00),
  FONT_SIZE_40: em((Platform.OS === 'ios') ? 2.30 : 2.05),
  FONT_SIZE_42: em((Platform.OS === 'ios') ? 2.35 : 2.10),
  FONT_SIZE_44: em((Platform.OS === 'ios') ? 2.40 : 2.15),
  FONT_SIZE_46: em((Platform.OS === 'ios') ? 2.45 : 2.20),
  FONT_SIZE_48: em((Platform.OS === 'ios') ? 2.50 : 2.25),
  FONT_SIZE_50: em((Platform.OS === 'ios') ? 2.55 : 2.30),
};
