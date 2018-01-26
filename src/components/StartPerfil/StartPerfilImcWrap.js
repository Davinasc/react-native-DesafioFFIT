import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet, } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

import StartPerfilPesoForm from './StartPerfilPesoForm';
import StartPerfilAlturaForm from './StartPerfilAlturaForm';
import StartPerfilImcForm from './StartPerfilImcForm';

class StartPerfilImcWrap extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { height: '', weight: '', imc: '' }
  }

    render() {
      return (
        <View>
          <StartPerfilPesoForm value={this.props.profile.weight} />
          <StartPerfilAlturaForm value={this.props.profile.height} />
          <StartPerfilImcForm />
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

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilImcWrap);