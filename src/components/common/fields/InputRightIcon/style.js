import { Dimensions, StyleSheet, Platform } from 'react-native';
import Style from '../../../../utils/responsiveFactor';

const InputRightIconGenericStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 40),
  },
  fieldHolder: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: '100%'
  },
  input: {
    fontSize: (Platform.OS === 'ios') ? Style.FONT_SIZE_20 : Style.FONT_SIZE_22,
    padding: 0,
    marginTop: 0,
    flex: 0.7
  },
  buttonHolder: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 0.3,
  },
  buttonImageStyle: {
    height: Style.FONT_SIZE_12,
    width: Style.FONT_SIZE_12,
  },
  buttonTextStyle: {
    marginLeft: 2,
    fontSize: Style.FONT_SIZE_12,
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

export default InputRightIconGenericStyle;
