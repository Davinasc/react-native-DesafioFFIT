import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'native-base';
import Style from '../../../../utils/responsiveFactor';

export default class DefaultBackButton extends PureComponent {
  constructor(props) {
    super(props);
    this.alreadyPressBack = false;
  }

  _onPress = () => {
    if(!this.alreadyPressBack){
      this.props.onPress();
      this.alreadyPressBack = true;
    }
  };

  render() {
    return (
      <TouchableOpacity transparent onPress={this._onPress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center',}}>
        <View style={{flex: 0.05,}}>
          <Icon name='ios-arrow-back' style={{color: '#868686', fontSize: Style.FONT_SIZE_24}} />
        </View>

        <View style={{flex: 0.95,}}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: Style.FONT_SIZE_20,
              width: 300,
              color: '#868686',
              fontWeight: 'bold',
            }}
          >
            {this.props.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
}
