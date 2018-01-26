import React, { Component } from 'react';
import { View, FlatList, Text, Dimensions, TouchableOpacity, StyleSheet, } from 'react-native';
import { Icon, Button } from 'native-base';
import moment from 'moment';
import _ from 'lodash';

import GeneralListItem from './GeneralFlatListItem';
import MedicineListItem from '../MedicineListItem';
import CustomModal from '../../modal/CustomModal';
import Style from '../../../../utils/responsiveFactor';

const styles = StyleSheet.create({
  modalHolder: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  modalHeader: {
    flex: 0.3,
  },
  modalHeaderText: {
    fontSize: Style.FONT_SIZE_18,
    fontWeight: '700',
    color: '#666666',
  },
  modalContent: {
    flex: 0.4,
  },
  modalContentText: {
    fontSize: Style.FONT_SIZE_13,
    color: '#666666',
  },
  modalButtons: {
    flex: 0.3,
    flexDirection: 'row',
  },
  modalButtonHolder: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonTextNO: {
    color: '#777777',
    fontWeight: '700',
    fontSize: Style.FONT_SIZE_19,
    textDecorationLine: 'underline',
  },
  modalButtonYES: {
    width: 100,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6BC0'
  },
  modalButtonTextYES: {
    fontSize: Style.FONT_SIZE_19,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainHolder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBarHolder: {
    position: 'absolute',
    zIndex: 9999,
    top: (Dimensions.get('window').height/1.3),
    width: (Dimensions.get('window').width-40),
    height: 60,
    backgroundColor: '#F1F1F1',
    flex: 1,
    flexDirection: 'row',
    shadowColor: '#C1C1C1',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    borderRadius: 5,
  },
  actionBarSelectedHolder: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBarSelectedText: {
    color: '#666666',
  },
  actionBarButtonHolder: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  actionBarButton: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBarIconStyle: {
    color: '#5C6BC0'
  },
});

export default class GeneralFlatList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editionMode: false,
      selectedItems: [],
      modalVisibility: false,
    }
  }

  _changeModalVisibility = (status) => {
    this.setState({ modalVisibility: status });
  }

  _exitEditionMode = () => {
    this.setState({
      editionMode: false,
      selectedItems: [],
    });

    if (this.props.onExitEditionMode !== undefined) {
      this.props.onExitEditionMode(false);
    }
  }

  _onLongPress = (index) => {
    if (!this.state.editionMode) {
      this.setState({ editionMode: true });
    }

    this._addItemToSelected(index);
    if (this.props.onLongPressAction !== undefined) {
      this.props.onLongPressAction(this.state.editionMode);
    }
  }

  _addItemToSelected = (index) => {
    let lastState = this.state.selectedItems;
    let checkIfExists = _.find(lastState, (eachItem) => {
      return (eachItem === index);
    });

    if (checkIfExists === undefined) {
      lastState.push(index);
    } else {
      lastState.splice(lastState.indexOf(index), 1);
    }

    this.setState({ selectedItems: lastState });
  }

  _selectAllItems = () => {
    if (this.props.data.length > 0) {
      let selectedItems = this.state.selectedItems;
      this.props.data.map((each, index) => {
        let checkIfExists = _.find(this.state.selectedItems, (eachItem) => {
          return (eachItem === index);
        });

        if (checkIfExists === undefined) {
          selectedItems.push(index);
        }
      });
      this.setState({ selectedItems: selectedItems });
    }
  }

  _deleteSelected = () => {
    let deletingItems = [];
    this.state.selectedItems.map((eachItem) => {
      deletingItems.push(this.props.data[eachItem]);
    });
    this.props.deleteAction(deletingItems);
    this._changeModalVisibility(false);
    this._exitEditionMode();
  }

  _checkAllAsReaded = () => {
    let selectedItems = [];
    this.state.selectedItems.map((eachItem) => {
      selectedItems.push(this.props.data[eachItem]);
    });

    this.props.checkAllAsReadedAction(selectedItems, false);
    this._exitEditionMode();
  }

  _keyExtractor = (item, index) => index;

  _renderComponent = (type, item, index, selected, onPress) => {
    switch (type) {
      case 'medicine':
        let nextAlarms = [];
        item.user_medication_alarms.map((alarm) => {
          if (alarm.alarm_time > moment().unix()) {
            nextAlarms.push(alarm.alarm_time);
          }
        });
        if (nextAlarms.length <= 0) {
          nextAlarms.push(item.user_medication_alarms[0].alarm_time);
        }
        nextAlarms.sort();

        return (
          <MedicineListItem
            key={index}
            mainText={item.name}
            bottomText1={item.dose}
            bottomText2={(!item.duration) ? 'Uso contínuo' : (item.interval) ? 'a cada ' + item.interval + ' dia(s)' : 'diariamente'}
            dateTime={' às ' + moment.unix(nextAlarms[0]).format('HH:mm')}
            displayAlarmIcon={true}
            selected={(selected !== undefined)}
          />
        );
    }
  }

  _renderItem = ({item, index}) => {
    const {
      onPress,
    } = this.props;
    const selected = _.find(this.state.selectedItems, (eachItem) => {
      return (eachItem === index && this.state.editionMode);
    });
    const finalComponent = this._renderComponent(this.props.type, item, index, selected, onPress);
    return (
      <GeneralListItem
        onPressAction={() => {
          (this.state.editionMode) ? this._addItemToSelected(index) : onPress(item);
        }}
        onLongPressAction={() => {
          this._onLongPress(index);
        }}
        selected={(selected !== undefined)}
        innerComponent={finalComponent}
      />
    );
  }

  _getModalContent() {
    return (
      <View style={styles.modalHolder}>
        <View style={styles.modalHeader}>
          <Text allowFontScaling={false} style={styles.modalHeaderText}>
            Tem certeza que deseja apagar os itens selecionados?
          </Text>
        </View>

        <View style={styles.modalContent}>
          <Text allowFontScaling={false} style={styles.modalContentText}>
            Ao tocar em sim, você irá excluir o(s) item(s) selecionados. Deseja fazer isso?
          </Text>
        </View>

        <View style={styles.modalButtons}>
          <View style={styles.modalButtonHolder}>
            <TouchableOpacity onPress={() => this._changeModalVisibility(false)}>
              <Text allowFontScaling={false} style={styles.modalButtonTextNO}>NÃO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtonHolder}>
            <Button
              small
              rounded
              style={styles.modalButtonYES}
              onPress={this._deleteSelected}
            >
              <Text allowFontScaling={false} style={styles.modalButtonTextYES}>SIM</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const {
      data,
      emptyComponent,
    } = this.props;
    return (
      <View style={[
        styles.mainHolder,
        {
          marginBottom: (this.state.editionMode) ? 60 : 0,
        }
      ]}>
        <FlatList
          data={data}
          extraData={this.state}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={emptyComponent}
        />

        <CustomModal
          content={this._getModalContent()}
          visible={this.state.modalVisibility}
          hideTop
          customHeight={Dimensions.get('window').height/2.8}
          customFlexDirection="column"
          customAlign="center"
        />

        {
          (this.state.editionMode) ?
            (<View style={styles.actionBarHolder}>
              <View style={styles.actionBarSelectedHolder}>
                <Text allowFontScaling={false} style={styles.actionBarSelectedText}>
                  {this.state.selectedItems.length} {(this.state.selectedItems.length === 0 || this.state.selectedItems.length > 1) ? 'itens' : 'item'}
                </Text>
              </View>

              <View style={styles.actionBarButtonHolder}>
                {
                  (this.props.showReadAllButton) ? (
                    <View style={styles.actionBarButton}>
                      <TouchableOpacity onPress={() => this._checkAllAsReaded()}>
                        <Icon name="ios-mail-open-outline" style={styles.actionBarIconStyle} />
                      </TouchableOpacity>
                    </View>
                  ) : null
                }

                <View style={styles.actionBarButton}>
                  <TouchableOpacity onPress={() => this._selectAllItems()}>
                    <Icon name="md-done-all" style={styles.actionBarIconStyle} />
                  </TouchableOpacity>
                </View>

                <View style={styles.actionBarButton}>
                  <TouchableOpacity onPress={() => {
                    if (this.state.selectedItems.length > 0) {
                      this._changeModalVisibility(true);
                    }
                  }}>
                    <Icon name="ios-trash-outline" style={styles.actionBarIconStyle} />
                  </TouchableOpacity>
                </View>

                <View style={styles.actionBarButton}>
                  <TouchableOpacity onPress={() => this._exitEditionMode()}>
                    <Icon name="md-close" style={styles.actionBarIconStyle} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>) : null
        }
      </View>
    );
  }
}
