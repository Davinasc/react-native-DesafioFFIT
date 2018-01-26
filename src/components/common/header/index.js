import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet } from 'react-native';

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={headerStyle.style}>
        {this.props.children}
      </View>
    );
  };
}

const headerStyle = StyleSheet.create({
  style: {
    flex: 0.1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: (Platform.OS === 'ios') ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#F1F1F1',
    borderBottomWidth: 2,
    height: 70,
  }
});
