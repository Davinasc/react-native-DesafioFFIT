import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import Style from '../../../../utils/responsiveFactor';
import PropTypes from 'prop-types';

export default function DateBadge({displayAlarmIcon, dateTime}){
  return (
    <View style={styles.badgeWrapper}>
      {
        displayAlarmIcon && //works like: display the view if this.propsdisplayAlarmIcon
        <View style={styles.iconWrapper}>
          <Icon
            name="md-alarm"
            style={styles.icon}
          />
        </View>
      }
      <View style={styles.textWrapper}>
        <Text allowFontScaling={false} style={styles.text}>{dateTime}</Text>
      </View>
    </View>
  )
}

DateBadge.propTypes = {
  displayAlarmIcon: PropTypes.bool,
  dateTime: PropTypes.string.isRequired,
};

DateBadge.defaultProps = {
  displayAlarmIcon: false
};

const styles = StyleSheet.create({
  badgeWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#868686',
    paddingLeft:5,
    paddingRight:5,
  },
  iconWrapper: {
    flex: 0.2,
    alignItems: 'center',
  },
  icon: {
    fontSize: Style.FONT_SIZE_12,
    color: '#868686',
  },
  textWrapper: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: Style.FONT_SIZE_12,
    color: '#868686'
  },
});
