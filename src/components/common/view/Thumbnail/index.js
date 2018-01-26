import React, { PureComponent } from 'react';
import { View, Image, } from 'react-native';

export default class Thumbnail extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{
        backgroundColor: this.props.backgroundColor,
        borderRadius: 100,
        width: this.props.width,
        height: this.props.height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image
          source={this.props.imagePath}
          style={{
            width: this.props.imageWidth,
            height: this.props.imageHeight,
            borderRadius: (this.props.imageBorderRadius) ? this.props.imageBorderRadius : 25,
          }}
        />
      </View>
    );
  }
}
