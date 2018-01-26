import React, { Component } from 'react';
import { View, Text, Platform, TimePickerAndroid, TouchableOpacity } from 'react-native';
import { Label, Item } from 'native-base';
import moment from 'moment';

import CustomTimePicker from '../../picker/CustomTimePicker';
import Style from '../../../../utils/responsiveFactor';

export default class TimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      date: props.initialDate,
    };
  }

  changeModalVisilibity = (visibility) => {
    if (Platform.OS === 'ios') {
      this.setState({ isModalVisible: visibility });
    } else {
      this.callAndroidTimePicker();
    }
  };

  async callAndroidTimePicker() {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: Number(this.state.date.format('H')),
        minute: Number(this.state.date.format('m')),
        is24Hour: true,
      });

      if (action !== TimePickerAndroid.dismissedAction) {
        this.changeInternalDate(new Date(this.state.date.format("YYYY"), this.state.date.format("MM"), this.state.date.format("DD"), hour, minute));
        this.props.onDateChange(this.state.date);
      }

    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  changeInternalDate = (date) => {
    if (this.props.startDate) {
      let selectedDate = moment(date);
      let startDate = moment(this.props.startDate, 'DD/MM/YYYY'); startDate.set({ hour: selectedDate.format('HH'), minute: selectedDate.format('mm'), second: selectedDate.format('ss'), });
      if (startDate.unix() <= moment().unix) {
        this.setState({ date: moment() });
      } else {
        this.setState({ date: moment(date) });
      }
    } else {
      this.setState({ date: moment(date) });
    }
  };

  onSaveButton = (date) => {
    this.props.onDateChange(date);
    this.changeModalVisilibity(false);
  };

  render = () => {
    const {
      meta: {
        touched,
        error
      }
    } = this.props;
    const renderErrors = () => {
      if (touched && error) {
        return <Text allowFontScaling={false} style={{color: '#FFFFFF', fontSize: Style.FONT_SIZE_12, marginTop: 10,}}>{error}</Text>
      }
    };

    return (
      <View style={this.props.mainViewStyle}>
        <Label
          allowFontScaling={false}
          style={{
            marginLeft: 10,
            color: '#A6A6A6',
            fontSize: Style.FONT_SIZE_19}}
        >
          {this.props.label}
        </Label>
        <TouchableOpacity onPress={() => this.changeModalVisilibity(true)}>
          <Text
            allowFontScaling={false}
            style={{
              marginLeft: 10,
              color: '#949494',
              fontSize: Style.FONT_SIZE_20
            }}
          >
            {this.state.date.format('HH:mm')}
          </Text>
          <View
            style={{
              borderBottomColor: '#E8E6EA',
              borderBottomWidth: 1,
            }}
          />
        </TouchableOpacity>

        <View style={{flexDirection: 'row', marginTop: 5,}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}>
            {renderErrors()}
          </View>
        </View>

        <CustomTimePicker date={this.state.date.toDate()} visible={this.state.isModalVisible} onDateChange={this.changeInternalDate.bind(this)} onCancelButton={() => this.changeModalVisilibity(false)} onSaveButton={this.onSaveButton.bind(this)} />
      </View>
    );
  };
}
