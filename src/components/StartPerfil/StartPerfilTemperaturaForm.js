import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet, } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

class StartPerfilTemperaturaForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '', loadedValue: false};
  }

  normalizeTemperature = (value) => {
    if (!value || typeof value !== 'string') {
      return value
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 2) {
      return onlyNums
    } else {
      return `${onlyNums.slice(0, 2)},${onlyNums.slice(2,3)}`
    }
  };

  updateValue = () => {
    let profile = this.props.profile;
    temperature = this.normalizeTemperature(this.state.value);
    profile.temperature = temperature;
    this.props.profileActions.changeTemperatureValue(profile);
  }

  render() {
    if(!this.state.loadedValue && this.props.profile.temperature){
      this.setState({value: Number(this.props.profile.temperature).toFixed(2).replace(/\./, ','), loadedValue: true})
    }
    return (
      <View
        style={startPerfilTemperaturaFormStyle.mainHolder}
      >
        <InputRightIconGeneric
          name="temperature"
          label="Temperatura (°C)"
          fieldLineColor="#CCCCCC"
          imagePath={require('../../lib/Images/show_chart.png')}
          imageText="ver histórico"
          buttonAction={() => { /* TODO */ } }
          onChange={(newValue)=>{ this.setState({value: newValue}) }}
          value={this.normalizeTemperature(this.state.value)}
          onEndEditing={() => { this.updateValue() }}
          keyboardType="numeric"
          placeholder="Ex: 36,5"
          editable
        />
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

const startPerfilTemperaturaFormStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 20),
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    marginVertical: 5,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilTemperaturaForm);
