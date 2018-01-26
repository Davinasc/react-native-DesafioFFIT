import React, { PureComponent } from 'react';
import { Text, View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Style from '../../../utils/responsiveFactor';

class DefaultLoader extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      label,
      visible,
    } = this.props;

    if (visible) {
      return (
        <View style={loadingStyle.mainWrapper}>
          <View style={loadingStyle.activityIndicatorWrapper}>
            <ActivityIndicator
              animating
              color="#5C6BC0"
              size="large"
              style={loadingStyle.activityIndicator}
            />
            <Text
              allowFontScaling={false}
              style={loadingStyle.label}
            >
              {label}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const loadingStyle = StyleSheet.create({
  mainWrapper: {
    flexDirection: 'column',
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  activityIndicatorWrapper: {
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: Style.FONT_SIZE_20,
    color: '#5C6BC0',
  },
});

DefaultLoader.propTypes = {
  label: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

DefaultLoader.defaultProps = {
  label: 'Carregando...',
};

const mapStateToProps = (state) => {
  return {
    loader: state.loaderReducer,
  };
};

export default connect(mapStateToProps)(DefaultLoader);
