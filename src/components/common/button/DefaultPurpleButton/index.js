import React, { PureComponent } from 'react';
import { Text, } from 'react-native';
import { Button } from 'native-base';
import Style from '../../../../utils/responsiveFactor';

export default class DefaultPurpleButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Button
        small
        rounded
        style={{
          width: (this.props.width) ? this.props.width : 280,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (this.props.disabled) ? '#CCCCCC' : '#5C6BC0',
          marginTop: (this.props.marginTop) ? this.props.marginTop : 30,
        }}
        onPress={() => this.props.buttonAction()}
        disabled={this.props.disabled}
      >
        <Text allowFontScaling={false}  style={{color: '#FFFFFF', fontSize: Style.FONT_SIZE_18, fontWeight: 'bold'}}>{this.props.text}</Text>
      </Button>
    );
  }
}

