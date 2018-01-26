import { Dimensions, StyleSheet, Platform } from 'react-native';
import Style from '../../../../utils/responsiveFactor';

const InputBothSidesIconGenericStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 40),
  },
  subViewHolder:{
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  fieldHolder: {
    flexDirection: 'row',
    width: '100%'
  },
  input: {
    fontSize: (Platform.OS === 'ios') ? Style.FONT_SIZE_20 : Style.FONT_SIZE_22,
    padding: 0,
    marginTop: 0,
    flex: 0.9
  },
  buttonHolder: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 0.1,
    marginRight: 5,
  },
  buttonImageStyle: {
    height: Style.FONT_SIZE_12,
    width: Style.FONT_SIZE_12,
  },
  buttonTextStyle: {
    marginLeft: 2,
    fontSize: Style.FONT_SIZE_12,
  },
  leftIconHolder: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 0.1,
  },
  leftIcon: {
    fontSize: Style.FONT_SIZE_20,
    marginBottom: 5,
  },
  rightIcon: {
    fontSize: Style.FONT_SIZE_22,
    paddingBottom: 1
  },
  errorHolder: {
    flex: 0.3,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  errorTextStyle: {
    color: '#D44539',
    fontSize: Style.FONT_SIZE_12,
    marginTop: 6,
  },
});

export default InputBothSidesIconGenericStyle;
