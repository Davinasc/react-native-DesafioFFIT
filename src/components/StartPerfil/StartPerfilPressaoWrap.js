import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet, } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

import StartPerfilPressaoForm from './StartPerfilPressaoForm';

class StartPerfilPressaoWrap extends PureComponent {

  constructor(props) {
    super(props);
  }

    render() {
      return (
        <View style={{flex:1}}>
          <StartPerfilPressaoForm
						systolic={this.props.profile.blood_pressure.systolic}
						diastolic={this.props.profile.blood_pressure.diastolic}
					/>
        </View>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    profileActions: bindActionCreators(profileActions, dispatch),
    dispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilPressaoWrap);