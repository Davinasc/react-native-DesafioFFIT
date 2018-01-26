import { Dimensions, StyleSheet, Platform } from 'react-native';
import Style from '../../../../utils/responsiveFactor';

const InputNoIconGenericStyle = StyleSheet.create({
  mainHolder: {
    marginTop: 10,
    width: (Dimensions.get('window').width - 40),
  },
  fieldHolder:{
    borderBottomWidth: 1,
    flex: 0.7,
  },
  input: {
    fontSize: (Platform.OS === 'ios') ? Style.FONT_SIZE_16 : Style.FONT_SIZE_16,
    padding: 0,
    marginHorizontal: 12,
    height: Style.FONT_SIZE_20,
  },
  errorHolder: {
    flex: 0.3,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  errorTextStyle: {
    color: '#D44539',
    fontSize: Style.FONT_SIZE_12,
    display: 'flex'
  },
});

export default InputNoIconGenericStyle;
