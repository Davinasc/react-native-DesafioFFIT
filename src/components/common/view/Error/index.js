import React, { PureComponent } from 'react';
import { View, Image, Text, Dimensions, } from 'react-native';

export default class Error extends PureComponent {
  constructor(props) {
    super(props);
  }

  render = () => {
    const window = Dimensions.get('window');

    return (
      <View style={{
        flex: 0.8,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}>
        <Image source={this.props.imagePath} style={{width: window.width * 0.85, height: window.width * 0.85, resizeMode: 'contain'}} />

        <Text allowFontScaling={false} style={{color: '#999999', fontWeight: 'bold'}}>{this.props.message}</Text>
        <Text allowFontScaling={false} style={{color: '#999999'}}>{this.props.submessage}</Text>
      </View>
    );
  }
}
