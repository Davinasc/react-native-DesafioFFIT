import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { View, Dimensions, StyleSheet, } from 'react-native'
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import InputRightIconGeneric from '../common/fields/InputRightIcon';

class StartPerfilImcForm extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', loadedValue: false};
  }

  render() {
    const imc = Number(this.props.profile.imc).toFixed(2).replace(/\./, ',');

    return (
      <View
        style={startPerfilImcFormStyle.mainHolder}
      >
        <InputRightIconGeneric
          name="imc"
          label="Meu IMC atual"
          labelColor="#FFFFFF"
          fieldLineColor="#FFFFFF"
          inputTextColor="#FFFFFF"
          placeholderTextColor="#FFFFFF"
          imagePath={require('../../lib/Images/show_chart.png')}
          imageText="ver histórico"
          imageTextColor="#FFFFFF"
          buttonAction={() => { /* TODO */ }}
          onChange={(newValue)=>{  }}
          value={imc}
          keyboardType="numeric"
          placeholder="Ex: 24,22"
          editable={false}
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

const startPerfilImcFormStyle = StyleSheet.create({
  mainHolder: {
    width: (Dimensions.get('window').width - 20),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#FFA000',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilImcForm);
