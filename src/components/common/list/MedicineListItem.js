import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Style from '../../../utils/responsiveFactor';
import DateBadge from '../badge/DateBadge';

const styles = StyleSheet.create({
  holder: {
    flex: 1,
    flexDirection: 'row',
  },
  mainTextHolder: {
    flex: 0.5,
  },
  mainTextStyle: {
    fontSize: Style.FONT_SIZE_15,
    color: '#5C6BC0',
  },
  bottomTextHolder: {
    flex: 0.25,
  },
  bottomTextStyle: {
    fontSize: Style.FONT_SIZE_10,
    color: '#868686',
  },
  textHolder: {
    flex: 0.6,
  },
  badgeHolder: {
    flex: 0.4,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
});

export default class MedicineListItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mainText,
      bottomText1,
      bottomText2,
      displayAlarmIcon,
      dateTime,
      backgroundColor,
      selected,
    } = this.props;

    return (
      <View
        style={[
          styles.holder,
          {
            backgroundColor: (backgroundColor) ? backgroundColor : 'transparent',
            paddingLeft: (selected) ? 5 : 10,
          }
        ]}
      >
        <View style={styles.textHolder}>
          <View style={styles.mainTextHolder}>
            <Text
              allowFontScaling={false}
              style={styles.mainTextStyle}
            >
              {mainText}
            </Text>
          </View>

          <View style={styles.bottomTextHolder}>
            <Text
              allowFontScaling={false}
              style={styles.bottomTextStyle}
            >
              {bottomText1}
            </Text>
          </View>

          <View style={styles.bottomTextHolder}>
            <Text
              allowFontScaling={false}
              style={styles.bottomTextStyle}
            >
              {bottomText2}
            </Text>
          </View>
        </View>

        <View style={styles.badgeHolder}>
          {/*<DateBadge*/}
            {/*displayAlarmIcon={displayAlarmIcon}*/}
            {/*dateTime={dateTime}*/}
          {/*/>*/}
        </View>
      </View>
    );
  }
}
