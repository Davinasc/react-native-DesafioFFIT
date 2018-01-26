import React, { Component, } from 'react';
import { View, Text, Platform, TimePickerAndroid, TouchableOpacity, Alert } from 'react-native'
import { Item, } from 'native-base';
import CustomTimePicker from '../../picker/CustomTimePicker';
import moment from 'moment';
import Style from '../../../../utils/responsiveFactor';

export default class TimePickerWithLabel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      date: moment(this.props.date)
    };
  }

  changeModalVisilibity = (visibility) => {
    if (Platform.OS === 'ios') {
      this.setState({ isModalVisible: visibility });
    }else {
      this.callAndroidTimePicker();
    }
  };

  async callAndroidTimePicker() {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: new Number(this.state.date.format("H")),
        minute: new Number(this.state.date.format("m")),
        is24Hour: true,
      });

      if (action !== TimePickerAndroid.dismissedAction) {
        this.changeInternalDate(new Date(this.state.date.format("YYYY"), this.state.date.format("MM")-1, this.state.date.format("DD"), hour, minute));
        this.props.onDateChange(this.state.date);
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  changeInternalDate = (date) => {
    this.setState({ date: moment(date) });
  };

  onSaveButton = (date) => {
    this.props.onDateChange(date);
    this.changeModalVisilibity(false);
  };

  onItemPress(time, index) {
    if (this.props.longPress) {
      Alert.alert(
        'Edição de horário',
        'Deseja editar ou remover este horário?',
        [
          {
            text: 'Cancelar',
          },
          {
            text: 'Editar',
            onPress: () => {
              this.changeModalVisilibity(true);
            }
          },
          {
            text: 'Apagar',
            onPress: () => {
              this.props.removeFunctionCallback();
            },
          }
        ]
      );
    } else {
      this.changeModalVisilibity(true);
    }


  }

  render() {
    let fontSize = this.props.fontSize | Style.FONT_SIZE_13;
    let color = '#868686';
    if(this.props.color) color = this.props.color;
    return (
      <View style={this.props.mainViewStyle}>
        <TouchableOpacity onPress={() => {this.onItemPress(this.state.date.toDate(), this.props.index)}}
                          delayLongPress={2000}
                          onLongPress = { () => {this.props.longPress(this.props.index)} }>
          <Text allowFontScaling={false} style={{fontSize , color }}>{this.props.label}</Text>
        </TouchableOpacity>

        <CustomTimePicker date={this.state.date.toDate()} visible={this.state.isModalVisible} onDateChange={this.changeInternalDate.bind(this)} onCancelButton={() => this.changeModalVisilibity(false)} onSaveButton={this.onSaveButton.bind(this)} />
      </View>
    );
  };
}
