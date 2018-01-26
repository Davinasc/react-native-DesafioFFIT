import React, { Component, } from 'react';
import { Platform,  DatePickerIOS, View, Text } from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modal';

export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = { date: this.props.date };
  }

  renderIosCalendar = () => {
    return (
      <DatePickerIOS
        date={this.state.date}
        onDateChange={this.onDateChange}
        mode="date"
      />
    );
  };

  onDateChange = (date) => {
    this.setState({ date: date });
    this.props.onDateChange(date);
  };

  renderAndroidCalendar() {
    // TODO: ... implementar um calendário customizado para o android? Vale a pena?
  };

  onSaveButton = () => {
    this.props.onSaveButton(this.state.date);
  };

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Modal isVisible={this.props.visible} style={{
          justifyContent: 'center',
          margin: 0,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
          }}>
            {((Platform.OS == 'ios') ? this.renderIosCalendar() : this.renderAndroidCalendar())}

            <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end',}}>
              <Button transparent onPress={() => this.props.onCancelButton()} style={{marginRight: 10, }}>
                <Text allowFontScaling={false} >CANCELAR</Text>
              </Button>

              <Button transparent onPress={() => this.onSaveButton()} style={{marginRight: 10, }}>
                <Text allowFontScaling={false} >SALVAR</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
}
