import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

export default class Container extends PureComponent {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <View style={[containerStyle.style, { paddingBottom: this.props.paddingBottom, backgroundColor: (this.props.backgroundColor) ? this.props.backgroundColor : '#F1F1F1', }]}>
        {this.props.children}
      </View>
    );
  };
}

const containerStyle = StyleSheet.create({
  style: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }
});
