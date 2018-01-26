import React, {PureComponent} from 'react'
import { Text, View, Image, TouchableOpacity, } from 'react-native'
import Style from '../../../../utils/responsiveFactor';

export default class ButtonWithTwoTextLinesAndBottomIcon extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let upperTextStyle = {
      color: '#5C6BC0',
      fontSize: Style.FONT_SIZE_18,
    };
    Object.assign(upperTextStyle, this.props.upperTextStyle);

    let bottomTextStyle = {
      color: '#5C6BC0',
      fontSize: Style.FONT_SIZE_19,
      fontWeight: "bold",
    };
    Object.assign(bottomTextStyle, this.props.bottomTextStyle);
    return (
      <TouchableOpacity style={{
        flex: 1,
        borderWidth: 1,
        borderColor: '#F1F1F1',
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        flexWrap: 'wrap',
        height: 100,
        alignItems: 'flex-start',
        justifyContent: 'center'
      }} onPress={() => {
        if (this.props.onPress) {
          this.props.onPress();
        }
      }}>
        <View style={{flex: 0.6, flexDirection: 'row',}}>
          <View style={{flex: 1, borderLeftColor: '#5C6BC0', borderLeftWidth: 1, marginLeft: 8, marginTop: 10,}}>
            <View style={{flex: 0.5, flexDirection: 'row', marginLeft: 5,}}>
              <Text allowFontScaling={false} style={ upperTextStyle }>{this.props.upperText}</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', marginLeft: 5,}}>
              <Text allowFontScaling={false} style={ bottomTextStyle }>{this.props.bottomText}</Text>
            </View>
          </View>

        </View>

        <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}>
          <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 8,}}>
            <Image source={this.props.image} style={{width: 32, height: 32,}} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

