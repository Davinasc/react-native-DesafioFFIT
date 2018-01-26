import { Dimensions, StyleSheet, Platform } from 'react-native';
import Style from '../../../../utils/responsiveFactor';

const InputLeftIconGenericStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 40),
  },
  fieldHolder:{
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  inputHolder:{
    flex: 0.9
  },
  input: {
    fontSize: (Platform.OS === 'ios') ? Style.FONT_SIZE_20 : Style.FONT_SIZE_22,
    padding: 0,
    marginTop: 0,
  },
  iconHolder: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 0.1,
  },
  icon: {
    fontSize: Style.FONT_SIZE_20,
    marginBottom: 5,
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

export default InputLeftIconGenericStyle;
