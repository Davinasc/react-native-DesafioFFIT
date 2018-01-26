import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import Style from '../../../../utils/responsiveFactor';

const styles = StyleSheet.create({
  holder: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  checkboxHolder: {
    flex: 0.1,
    paddingLeft: 5,
  },
  componentHolder: {
    flex: 0.9,
  }
});

export default class GeneralListItem extends PureComponent {
  constructor (props) {
    super(props);
  }

  _onLongPress = () => {
    if (this.props.onLongPressAction) {
      this.props.onLongPressAction();
    }
  }

  render = () => {
    const {
      onPressAction,
      innerComponent,
      selected
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.holder,
          {
            backgroundColor: selected ? '#C1C1C1' : 'transparent',
          }
        ]}
        onPress={onPressAction}
        onLongPress={this._onLongPress}
      >
        <View style={[
          styles.checkboxHolder,
          {
            display: (selected) ? 'flex' : 'none',
          }]
        }>
          <Icon
            name="md-checkmark-circle"
            style={{
              fontSize: Style.FONT_SIZE_46,
              color: '#5C6BC0',
            }}
          />
        </View>

        <View style={[
          styles.componentHolder,
          {
            flex: selected ? 0.9 : 1,
          }
        ]}>
          {innerComponent}
        </View>
      </TouchableOpacity>
    );
  }
}
