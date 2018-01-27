import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet, } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

class StartPerfilPesoForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '', loadedValue: false};
  }

  updateValue = () => {
    let profile = this.props.profile;
    const weight = this.state.value;
    profile.weight = weight;
    this.props.profileActions.changeWeightValue(profile);
  }

  normalizeWeight = (value) => {
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
    if(!this.state.loadedValue && this.props.profile.weight){
      this.setState({value: this.props.profile.weight, loadedValue: true})
    }
  }

  render() {
    return (
      <View style={startPerfilPesoFormStyle.mainHolder}>
        <InputRightIconGeneric
          name="weight"
          label="Meu peso atual (Kg)"
          fieldLineColor="#CCCCCC"
          imagePath={require('../../lib/Images/show_chart.png')}
          imageText="ver histórico"
          buttonAction={() => { /* TODO */ }}
          onChange={(newValue)=>{ this.setState({value: newValue}) }}
          value={this.normalizeWeight(this.state.value)}
          onEndEditing={() => { this.updateValue() } }
          keyboardType="numeric"
          placeholder="Ex: 70"
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

const startPerfilPesoFormStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 20),
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    marginVertical: 5,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilPesoForm);
