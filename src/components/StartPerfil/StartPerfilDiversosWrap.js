import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

import StartPerfilFrequenciaCardiacaForm from './StartPerfilFrequenciaCardiacaForm';
import StartPerfilGlicemiaForm from './StartPerfilGlicemiaForm';
import StartPerfilTemperaturaForm from './StartPerfilTemperaturaForm';

class StartPerfilDiversosWrap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { heart_beat: '', glycemia: '', temperature: '', loadedValue: false};
  }

	render() {
		return(
			<View>
				<StartPerfilFrequenciaCardiacaForm heart_beat={this.props.profile.heart_beat} />
				<StartPerfilGlicemiaForm glycemia={this.props.profile.glycemia} />
				<StartPerfilTemperaturaForm temperature={this.props.profile.temperature} />
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

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilDiversosWrap);
