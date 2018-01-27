import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

class StartPerfilPressaoForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { systolic: '', diastolic: '', loadedValue: false};
  }

  updateSystolicValue = () => {
    let profile = this.props.profile;
    const systolic = this.state.systolic;
    profile.blood_pressure.systolic = systolic;
    this.props.profileActions.changePressureSystolicValue(this.props.profile, profile);
  }

  updateDiastolicValue = () => {
    let profile = this.props.profile;
    const diastolic = this.state.diastolic;
    profile.blood_pressure.diastolic = diastolic;
    this.props.profileActions.changePressureDiastolicValue(this.props.profile, profile);
  }

  normalizePressure = (value) => {
    if (!value || typeof value !== 'string') {
      return value
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 1) {
      return onlyNums
    } else {
      return `${onlyNums.slice(0, 3)}`
    }
  };

  componentDidUpdate() {
    if(!this.state.loadedValue && this.props.profile.blood_pressure.systolic && this.props.profile.blood_pressure.diastolic ){
      this.setState({
        systolic: this.props.profile.blood_pressure.systolic,
        diastolic: this.props.profile.blood_pressure.diastolic,
        loadedValue: true})
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>

        <View style={startPerfilPressaoFormStyle.mainHolder}>
          <InputRightIconGeneric
            name="systolic"
            label="Pressão arterial sistólica (mmHg)"
            fieldLineColor="#CCCCCC"
            imagePath={require('../../lib/Images/show_chart.png')}
            imageText="ver histórico"
            buttonAction={() => { /* TODO */ } }
            onChange={(newValue) => { this.setState({systolic: newValue}) }}
            value={this.normalizePressure(this.state.systolic)}
            onEndEditing={() => { this.updateSystolicValue() }}
            keyboardType="numeric"
            placeholder="Ex: 120"
            editable
          />
        </View>

        <View style={startPerfilPressaoFormStyle.mainHolder}>
          <InputRightIconGeneric
            name="diastolic"
            label="Pressão arterial diastólica (mmHg)"
            fieldLineColor="#CCCCCC"
            imagePath={require('../../lib/Images/show_chart.png')}
            imageText="ver histórico"
            buttonAction={() => {/* TODO */}}
            onChange={(newValue) => { this.setState({diastolic: newValue}) }}
            value={this.normalizePressure(this.state.diastolic)}
            onEndEditing={() => { this.updateDiastolicValue() }}
            keyboardType="numeric"
            placeholder="Ex: 80"
            editable
          />
        </View>
      </View>
    );
  };
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

const startPerfilPressaoFormStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 20),
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    marginVertical: 5,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilPressaoForm);
