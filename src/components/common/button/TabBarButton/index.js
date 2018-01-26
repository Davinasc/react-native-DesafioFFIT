import React, { PureComponent } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Style from '../../../../utils/responsiveFactor';

const tabBarStyles = StyleSheet.create({
  mainHolder: {
    flex: 1,
    alignItems: 'center',
  },
  rowHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointHolder: {
    flex: 0.2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 28,
    right: -3,
  },
  imageHolder: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: 34,
    width: 34,
  },
  pointStyle: {
    borderRadius: 5,
    width: 8,
    height: 8,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'red',
    zIndex: 999,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textHolder: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontSize: Style.FONT_SIZE_10,
  },
});

class TabBarButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderNotificationCounter() {
    return (<View style={tabBarStyles.pointStyle} />);
  }

  renderWithCounter(profile_picture) {
    const {
      width,
      selected,
      imageActive,
      imageInactive,
      title,
      useProfilePicture
    } = this.props;

    let buttonImage = (selected) ? imageActive : imageInactive;
    return (
        <View style={[tabBarStyles.mainHolder, { width }]}>
          <View style={tabBarStyles.rowHolder}>
            <View style={[tabBarStyles.imageHolder, { top: 2, }]}>
              {
                (profile_picture && useProfilePicture) ?
                  <Image
                    source={{ uri: profile_picture }}
                    style={[
                      tabBarStyles.imageStyle,
                      {
                        borderRadius: 17,
                      }
                    ]}
                  />
                  : <Image
                    source={buttonImage}
                    style={tabBarStyles.imageStyle}
                  />
              }
            </View>

            <View style={tabBarStyles.pointHolder}>
              {this.renderNotificationCounter()}
            </View>
          </View>

          <View style={tabBarStyles.textHolder}>
            <Text allowFontScaling={false} style={[tabBarStyles.textStyle, { color: (selected) ? '#5C6BC0' : '#848484' }]}>
              {title}
            </Text>
          </View>
        </View>
    );
  }

  renderWithoutCounter(profile_picture) {
    const {
      width,
      selected,
      mainHolder,
      imageActive,
      imageInactive,
      imageStyle,
      imageHolder,
      textHolder,
      textStyle,
      title,
      useProfilePicture,
    } = this.props;

    let buttonImage = (selected) ? imageActive : imageInactive;

    return (
      <View style={[tabBarStyles.mainHolder, { width, top: 4 }]}>
        <View style={tabBarStyles.imageHolder}>
          {
            (profile_picture && useProfilePicture) ?
              <Image
                source={{ uri: profile_picture }}
                style={[
                  tabBarStyles.imageStyle,
                  {
                    borderRadius: 17,
                    opacity: (selected) ? 1 : 0.5,
                    borderColor: (selected) ? '#5C6BC0' : '#CCCCCC',
                    borderWidth: 2,
                  }
                ]}
              />
              : <Image
                source={buttonImage}
                style={tabBarStyles.imageStyle}
              />
          }
        </View>

        <View style={tabBarStyles.textHolder}>
          <Text allowFontScaling={false} style={[tabBarStyles.textStyle, { color: (selected) ? '#5C6BC0' : '#848484' }]}>
            {title}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      notificationCounter,
      notification,
      profile,
    } = this.props;

    return this.renderWithoutCounter(profile.profile_picture);
  }
}

TabBarButton.propTypes = {
  width: PropTypes.number,
  selected: PropTypes.bool.isRequired,
  imageActive: PropTypes.any.isRequired,
  imageInactive: PropTypes.any.isRequired,
  notificationCounter: PropTypes.bool,
  title: PropTypes.string.isRequired,
  useProfilePicture: PropTypes.bool,
  renderDrawer: PropTypes.bool,
};

TabBarButton.defaultProps = {
  width: 65,
  notificationCounter: false,
  useProfilePicture: false,
  renderDrawer: false,
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
  };
};

export default connect(mapStateToProps)(TabBarButton);
