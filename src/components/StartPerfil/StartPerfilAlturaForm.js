import React, { PureComponent } from 'react';
import { change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet, } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

class StartPerfilAlturaForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: '', loadedValue: false};
  }

  handleFormSubmit = () => {
  };

  normalizeHeight = (value) => {
    if (!value || typeof value !== 'string') {
      return value
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 1) {
      return onlyNums
    } else {
      return `${onlyNums.slice(0, 1)},${onlyNums.slice(1,3)}`
    }
  };

  updateValue = () => {
    let profile = this.props.profile;
    height = this.normalizeHeight(this.state.value);
    profile.height = height;
    this.props.profileActions.changeHeightValue(this.props.profile, profile);
  }

  render() {
    const profile = this.props.profile;

    if(!this.state.loadedValue && this.props.profile.height){
      this.setState({value: Number(this.props.profile.height).toFixed(2).replace(/\./, ','), loadedValue: true})
    }

    return (
      <View
        style={startPerfilAlturaFormStyle.mainHolder}
      >
        <InputRightIconGeneric
          name="height"
          label="Minha altura atual (m)"
          fieldLineColor="#CCCCCC"
          imagePath={require('../../lib/Images/show_chart.png')}
          imageText="ver histórico"
          buttonAction={() => { /* TODO */ }}
          onChange={(newValue)=>{ this.setState({value: newValue}) }}
          value={this.normalizeHeight(this.state.value)}
          onEndEditing={() => { this.updateValue() }}
          keyboardType="numeric"
          placeholder="Ex: 1,70"
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

const startPerfilAlturaFormStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 20),
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    marginVertical: 5,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilAlturaForm);
