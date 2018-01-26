import React, { PureComponent } from 'react';
import { StatusBar, Platform } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomStatusBar extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      bgColor,
      theme,
    } = this.props;
    return (Platform.Version === 21) ?
      (<StatusBar
        backgroundColor="#5C6BC0"
        animated
      />) :
      (<StatusBar
        backgroundColor={bgColor}
        barStyle={theme}
        animated
      />);
  }
}

CustomStatusBar.propTypes = {
  bgColor: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
};
