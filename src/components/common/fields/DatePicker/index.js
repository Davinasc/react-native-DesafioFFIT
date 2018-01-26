import React, {Component,} from 'react';
import { View, Text, Platform, DatePickerAndroid, TouchableOpacity } from 'react-native'
import { Item, Label, Input, Button, Icon } from 'native-base';
import moment from 'moment';
import PropTypes from 'prop-types';

import CustomDatePicker from '../../picker/CustomDatePicker/index';
import Style from '../../../../utils/responsiveFactor';

const defaultInputStyle = {
  marginLeft: 10,
  marginBottom: 0,
  color: '#5C6BC0',
  fontSize: Style.FONT_SIZE_20
};

const defaultLabelStyle = {
  marginLeft: 10,
  color: '#A6A6A6',
  fontSize: Style.FONT_SIZE_19,
}

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      selectedDate: props.initialDate,
      selectedValue: this.props.selectedValue,
      validateFuture: (props.validateFuture) ? props.validateFuture : true,
    };
  }

  changeModalVisilibity = (visibility) => {
    if (Platform.OS === 'ios') {
      this.setState({ isModalVisible: visibility });
    } else {
      this.callAndroidDatePicker();
    }
  };

  async callAndroidDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.selectedDate.toDate(),
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        this.changeInternalDate(new Date(year, month, day));
        this.props.onDateChange(this.state.selectedDate);
      }

    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  changeInternalDate = (date) => {
    this.setState({date: moment(date)});
  };

  onSaveButton = (date) => {
    let momentDate = moment(date); momentDate.set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
    let comparisonDate = moment(); comparisonDate.set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
    if (this.props.validateFuture && momentDate.unix() < comparisonDate.unix()) {
      console.log('this.props.initialDate', this.props.initialDate);
      this.setState({ selectedDate: this.props.initialDate });
    } else {
      console.log('moment.date', moment(date).format('DD/MM/YYYY'));
      this.setState({ selectedDate: moment(date) });
    }
    this.props.onDateChange(date);
    this.changeModalVisilibity(false);
  }

  render() {
    const {
      inputStyle,
      labelStyle,
    } = this.props;

    return (
      <View style={this.props.mainViewStyle}>
        <Label
          allowFontScaling={false}
          style={{...defaultLabelStyle, ...labelStyle}}
        >
          {this.props.label}
        </Label>
        <TouchableOpacity onPress={() => this.changeModalVisilibity(true)}>
          <Label
            allowFontScaling={false}
            style={{...defaultInputStyle, ...inputStyle}}
          >
            {this.state.selectedDate.format('DD/MM/YYYY')}
          </Label>
          <View
            style={{
              borderBottomColor: (this.props.borderBottomColor) ? this.props.borderBottomColor : '#E8E6EA',
              borderBottomWidth: 1,
            }}
          />
        </TouchableOpacity>

        <CustomDatePicker
          date={this.state.selectedDate.toDate()}
          visible={this.state.isModalVisible}
          onDateChange={this.changeInternalDate.bind(this)}
          onCancelButton={() => this.changeModalVisilibity(false)}
          onSaveButton={this.onSaveButton.bind(this)}
        />
      </View>
    );
  };
}

DatePicker.propTypes = {
  inputStyle: PropTypes.object,
  labelStyle: PropTypes.object
};
