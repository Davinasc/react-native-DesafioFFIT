import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimensions, View, Platform } from 'react-native';
import { Container, Header, Left, Right, Content, } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';


import * as medicinesActions from '../../actions/medicineActions';
import Error from '../common/view/Error';
import CustomStatusBar from '../common/statusbar/CustomStatusBar';
import DefaultLoader from '../common/loader/DefaultLoader';
import DefaultBackButton from '../common/button/DefaultBackButton';

import GeneralFlatList from '../common/list/GeneralFlatList/index';

class Medicine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      editionMode: false,
    };
  }

  editionModeAction = (status) => {
    this.setState({ editionMode: status, });
  }

  componentWillMount() {
    if (this.props.medicines.currentIndex > 0) {
      this.props.editMedicine(this.props.medicines.currentIndex, this.props.comingFromNotificationScreen);
    }
  }

  pullRefreshList() {
    this.setState({ refreshing: true });
    this.props.listMedicines().then(() => {
      this.setState({ refreshing: false });
    });
  };

  deleteMedicine = (items) => {
    let finalItems = [];
    items.map((item) => {
      finalItems.push(item.id);
    });
    this.props.deleteMedicine(finalItems);
  }

  getMedicine = (item) => {
    this.props.editMedicine(item.id);
  };

  renderList() {
    let { medicines } = this.props;
    return <GeneralFlatList
      data={medicines.medicines}
      onExitEditionMode={this.editionModeAction.bind(this)}
      onLongPressAction={this.editionModeAction.bind(this)}
      onPress={this.getMedicine.bind(this)}
      deleteAction={this.deleteMedicine.bind(this)}
      type="medicine"
      emptyComponent={() => {
        let fail = medicines.errorMedicine;
        return (
          <Error
            window={Dimensions.get('window')}
            imagePath={(fail) && fail.isEmpty ? require('../../lib/Images/lista_medicamento_empty.png') : require('../../lib/Images/icon_error_list.png')}
            message={(fail.message) ? fail.message : 'Ocorreu um erro ao listar os medicamentos.'}
            submessage={(fail.submessage !== undefined) ? fail.submessage : null}
          />
        );
      }}
    />
  };

  render() {
    const window = Dimensions.get('window');
    return (
      <Container style={{backgroundColor: 'transparent', width: window.width, height: window.height,}}>
        <Header style={{backgroundColor: 'transparent', elevation: 0, borderBottomColor: '#F1F1F1', borderBottomWidth: 2,}}>
          <CustomStatusBar bgColor={"#5C6BC0"} theme={(Platform.OS === 'ios') ? 'dark-content' : 'light-content'} />

          <View style={{flex: 1, flexDirection: 'row', marginLeft: 5,}}>
            <DefaultBackButton text="Meus Medicamentos" onPress={() => Actions.start_perfil()} />
          </View>
        </Header>

        <Content contentContainerStyle={{flex: 1, height: (window.height + 100),}}>
          <View style={{flex: 1, width: (window.width), flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            {
              this.renderList()
            }
          </View>


        </Content>
        {(!this.state.editionMode) ? <ActionButton style={{zIndex: 999}} buttonColor="#5C6BC0" onPress={() => Actions.medicine_form()} /> : null}

        <DefaultLoader visible={this.props.loader.active.status} label={this.props.loader.active.msg} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    medicines: state.medicine,
    loader: state.loader,
  };
};

export default connect(mapStateToProps, medicinesActions)(Medicine);
