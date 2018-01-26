import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Platform, Dimensions, Text, ScrollView, TouchableOpacity, Alert, findNodeHandle } from 'react-native';
import { Container, Header, Left, Right, Content, } from 'native-base';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Field, reduxForm, reset, } from 'redux-form';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import TimerMixin from 'react-timer-mixin';

import Style from '../../utils/responsiveFactor';
import NoIconField from '../common/fields/InputNoIcon';
import CustomCheckBox from '../common/checkbox/CustomCheckBox';
import CustomRadioBox from '../common/checkbox/CustomRadioBox';
import DefaultPurpleButton from '../common/button/DefaultPurpleButton';
import DatePicker from '../common/fields/DatePicker';
import TimePicker from '../common/fields/TimePicker';
import TimePickerWithLabel from '../common/fields/TimePickerWithLabel';
import TextArea from '../common/fields/TextArea';

import DefaultLoader from '../common/loader/DefaultLoader';
import DefaultBackButton from '../common/button/DefaultBackButton';
import CustomStatusBar from '../common/statusbar/CustomStatusBar';

import * as medicineActions from '../../actions/medicineActions';
const formValidate = values => {
  const errors = {};

  if (!values.medicineName) {
    errors.medicineName = 'Campo obrigatório'
  } else if (values.medicineName.length > 50) {
    errors.medicineName = 'Ultrapassou o máximo de 50 caracteres';
  }

  if (!values.medicineDose) {
    errors.medicineDose = 'Campo obrigatório'
  } else if (values.medicineDose.length > 50) {
    errors.medicineDose = 'Ultrapassou o máximo de 50 caracteres';
  }

  if (values.annotations && values.annotations.length > 255) {
    errors.annotations = 'Ultrapassou o limite de 255 caracteres.';
  }

  return errors;
}

class MedicineForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedType: 'frequency',
      isCalendarVisible: false,
      isContinuous: false,
      medicineFrequencyTimes: [],
      medicineFrequencyTimeEditIndex: -1,
      key: Math.random(),
      canSendForm: true,
      selectedDateFrequency: moment(),
      selectedDateInterval: moment(),
    };
  }

  changeSelectionType = (type) => {
    this.setState({ selectedType: type, });
  };

  componentWillMount = () => {
    if (Platform.OS == 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
  };

  componentWillUnmount = () => {
    this.props.clearMedicineForm();
  };

  changeFormValue = (formFieldName, newValue) => {
    this.props.changeFormValue(formFieldName, newValue);
  };

  componentDidMount = () => {
    if (this.props.medicine.currentIndex > 0) {
      let selectedMedicine = this.props.medicine.medicines.find(item => { if (item.id == this.props.medicine.currentIndex) return item });
      this.changeFormValue('medicineName', selectedMedicine.name);
      this.changeFormValue('medicineDose', selectedMedicine.dose);
      this.changeFormValue('annotations', (selectedMedicine.annotations)? selectedMedicine.annotations : '');
      if (selectedMedicine.frequency) {
        this.setState({ selectedType: 'frequency' });
        let medicineFrequencyTimes = selectedMedicine.user_medication_alarms.map(medication => {
          return moment.unix(medication.alarm_time).format("HH:mm");
        });
        this.setState({
          medicineFrequencyTimes: medicineFrequencyTimes.sort(),
          selectedDateFrequency: moment.unix(selectedMedicine.starts_at),
          selectedDateInterval: moment(),
        });
        this.changeFormValue('medicineFrequencyInterval', moment.unix(selectedMedicine.starts_at).format("DD/MM/YYYY"));
        this.changeFormValue('medicineFrequencyDuration', selectedMedicine.duration? String(selectedMedicine.duration) : '');

        this.changeFormValue('medicineIntervalStartTime', moment().format("HH:mm"));
        this.changeFormValue('medicineIntervalStartDate', moment().format("DD/MM/YYYY"));
        this.changeFormValue('medicineInterval', "");
        this.setState({ isContinuous: (!selectedMedicine.duration) });
      } else {
        this.setState({
          selectedType: 'interval',
          selectedDateInterval: moment.unix(selectedMedicine.starts_at),
        });

        this.changeFormValue('medicineInterval', (selectedMedicine.interval) ? String(selectedMedicine.interval) : '');
        this.changeFormValue('medicineIntervalStartTime', moment.unix(selectedMedicine.starts_at).format("HH:mm"));
        this.changeFormValue('medicineIntervalStartDate', moment.unix(selectedMedicine.starts_at).format("DD/MM/YYYY"));
        this.changeFormValue('medicineFrequencyDuration', selectedMedicine.duration? String(selectedMedicine.duration) : '');
        this.setState({ isContinuous: (!selectedMedicine.duration) });
      }

      TimerMixin.setTimeout(() => {
        this.setState({
          key: parseInt(moment().unix() + ((Math.random() * (9999999 - 1)) + 1)),
        });
      }, 500);
    } else {
      this.changeFormValue('medicineInterval', "");
      this.changeFormValue('medicineIntervalStartTime', moment().format("HH:mm"));
      this.changeFormValue('medicineIntervalStartDate', moment().format("DD/MM/YYYY"));
      this.changeFormValue('medicineFrequencyDuration', '');
      this.changeFormValue('medicineFrequencyInterval', moment().format("DD/MM/YYYY"));
      this.setState({
        selectedDateFrequency: moment(),
        selectedDateInterval: moment(),
      });
    }
  };

  getMedicineStartAt = () => {
    let selectedMedicine = this.props.medicine.medicines.find(item => { if (item.id === this.props.medicine.currentIndex) return item; });
    if (this.props.medicine.currentIndex > 0) {
      if (selectedMedicine.frequency) {
        this.changeFormValue('medicineIntervalStartTime', moment().format("HH:mm"));
        this.changeFormValue('medicineIntervalStartDate', moment().format("DD/MM/YYYY"));
        this.changeFormValue('medicineInterval', "");
        return moment();
      } else {
        this.changeFormValue('medicineIntervalStartTime', moment.unix(selectedMedicine.starts_at).format("HH:mm"));
        this.changeFormValue('medicineIntervalStartDate', moment.unix(selectedMedicine.starts_at).format("DD/MM/YYYY"));
        this.changeFormValue('medicineInterval', (selectedMedicine.interval) ? String(selectedMedicine.interval) : '');
        return moment.unix(selectedMedicine.starts_at);
      }
    } else {
      this.changeFormValue('medicineIntervalStartTime', moment().format("HH:mm"));
      this.changeFormValue('medicineIntervalStartDate', moment().format("DD/MM/YYYY"));
      return moment();
    }
  };

  getMedicineFrequencyDuration = () => {
    let selectedMedicine = this.props.medicine.medicines.find(item => { if (item.id === this.props.medicine.currentIndex) return item; });
    if (this.props.medicine.currentIndex >= 0 && selectedMedicine.duration) {
      return String(selectedMedicine.duration);
    } else {
      return "";
    }
  };

  getMedicineInterval = () => {
    let selectedMedicine = this.props.medicine.medicines.find(item => { if (item.id === this.props.medicine.currentIndex) return item; });
    if (selectedMedicine && selectedMedicine.interval) {
      return String(selectedMedicine.interval);
    } else {
      return "";
    }
  };

  getMedicineIntervalStartDate = () => {
    let selectedMedicine = this.props.medicine.medicines.find(item => { if (item.id === this.props.medicine.currentIndex) return item; });
    if (selectedMedicine && selectedMedicine.alarm_time) {
      //return (selectedMedicine.interval + ((selectedMedicine.interval > 1) ? ' dias' : ' dia'): '');
      return moment.unix(selectedMedicine.alarm_time).format('DD/MM/YYYY');
    } else {
      return moment().format("DD/MM/YYYY");
    }
  }

  medicineIntervalStartTime = () => {
    let selectedMedicine = this.props.medicine.medicines.find(item => { if (item.id === this.props.medicine.currentIndex) return item; });
    if (selectedMedicine && selectedMedicine.alarm_time) {
      //return (selectedMedicine.interval + ((selectedMedicine.interval > 1) ? ' dias' : ' dia'): '');
      return moment.unix(selectedMedicine.alarm_time).format('HH:mm');
    } else {
      return moment().format("HH:mm");
    }
  }

  renderFrequencyFields = () => {
    return (
      <View>
        <Field
          label="Data de início"
          name="medicineFrequencyInterval"
          component={DatePicker}
          mainViewStyle={{width: window.width-40, marginTop: 20,}}
          textColor="#5C6BC0"
          formName="medicineForm"
          fieldName="interval"
          initialDate={this.state.selectedDateFrequency}
          onDateChange={(date) => {
            this.addDateFrequency(date);
          } }
          validateFuture
        />

        <View style={{marginTop: 20, marginLeft: 12,}}>
          <Text allowFontScaling={false}  style={{fontSize: Style.FONT_SIZE_13, color: '#868686',}}>Horário</Text>
          <View style={{flexDirection: 'row', width: (window.width-40), flexWrap: 'wrap'}}>
            {
              this.state.medicineFrequencyTimes.map((time, x) => {
                return (
                  <TimePickerWithLabel
                    key={x}
                    index={x}
                    mainViewStyle={{flexDirection: 'column', paddingRight: 10}}
                    label={time}
                    date={moment(time, 'HH:mm')}
                    fontSize={Style.FONT_SIZE_15}
                    color={'#5C6BC0'}
                    longPress = { this.deleteTimeFrequency }
                    onDateChange={ (newTime) => this.editTimeFrequency(x, newTime) }
                    removeFunctionCallback={() => { this.removeTimeFrequencyFromList(x) }}
                    editFunctionCallback={() => { this.editTimeFrequency(x, moment(moment().format('DD/MM/YYYY') + ' ' + time, 'DD/MM/YYYY HH:mm').unix()) }}
                  />
                );
              })
            }
          </View>
          <TimePickerWithLabel
            mainViewStyle={{ width: window.width-40, paddingTop: 10 }}
            date={moment()}
            label={'+ Adicionar horário'}
            color={'#868686'}
            onDateChange={(time) => this.addTimeFrequency(time) }
          />
        </View>
        {(!this.state.isContinuous)? (
          <Field label="Duração da medicação (dias)" name="medicineFrequencyDuration" component={NoIconField}
                 editable={!this.state.isContinuous}
                 keyboardType="numeric"
                 onChange={(itemValue) => { this.changeFormValue('medicineFrequencyDuration', itemValue) }}
                 placeholder="Ex: 1"
                 value={this.getMedicineFrequencyDuration()}
                 normalize={itemValue => { return (itemValue)? itemValue.replace(/[^0-9]/g, '') : this.getMedicineFrequencyDuration()}}
          />
        ) : null}

      </View>
    );
  };

  addDateFrequency = (date) => {
    let dateFrequency = moment(date); dateFrequency.set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
    let comparisonDate = moment(); comparisonDate.set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
    let durationCurrentValue = parseInt(this.props.getFormValue('medicineFrequencyDuration'));
    console.log('dateFrequency.unix() < comparisonDate.unix()', dateFrequency.unix() < comparisonDate.unix());
    if (dateFrequency.unix() < comparisonDate.unix()) {
      this.changeFormValue('medicineFrequencyInterval', moment().format('DD/MM/YYYY'));
      this.setState({ selecteDateFrequency: moment() });
      TimerMixin.setTimeout(() => {
        Alert.alert(
          'Data incorreta',
          'Não é possível adicionar uma data que esteja no passado.',
          [
            { text: 'OK' },
          ]
        );
      }, 500);
    } else {
      this.changeFormValue('medicineFrequencyInterval', dateFrequency.format('DD/MM/YYYY'));
      this.setState({ selecteDateFrequency: dateFrequency });
    }
  }

  addTimeFrequency = (time, index) => {
    let momentTime = moment(time);
    let durationCurrentValue = parseInt(this.props.getFormValue('medicineFrequencyDuration'));
    let startFrequencyDate = moment(this.props.getFormValue('medicineFrequencyInterval'), 'DD/MM/YYYY');
    startFrequencyDate.set({hour: momentTime.format('HH'), minute: momentTime.format('mm'), second: momentTime.format('ss')});

    if (startFrequencyDate.unix() <= moment().unix() && durationCurrentValue <= 1 && !this.state.isContinuous) {
      TimerMixin.setTimeout(() => {
        Alert.alert(
          'Horário incorreto',
          'Não é possível adicionar um horário que esteja no passado para uma duração de apenas 1 dia.',
          [
            {text: 'OK'},
          ]
        );
      }, 500);
    } else {
      let medicineFrequencyTimes = this.state.medicineFrequencyTimes;
      if(index !== undefined)
        medicineFrequencyTimes.splice(index, 0, momentTime.format("HH:mm"));
      else {
        if (medicineFrequencyTimes.length > 0) {
          const checkIfExists = medicineFrequencyTimes.find((value) => {
            return (value === momentTime.format("HH:mm"))
          });
          if (!checkIfExists) {
            medicineFrequencyTimes.push(momentTime.format("HH:mm"));
          }
        }else {
          medicineFrequencyTimes.push(momentTime.format("HH:mm"));
        }
      }

      this.setState({ medicineFrequencyTimes: medicineFrequencyTimes });
    }
  };

  addDateInterval = (date) => {
    let dateInterval = moment(date); dateInterval.set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
    let comparisonDate = moment(); comparisonDate.set({ hour: 0, minute: 0, second: 0, milisecond: 0 });
    console.log('dateInterval.unix() < comparisonDate.unix()', dateInterval.unix() < comparisonDate.unix());
    if (dateInterval.unix() < comparisonDate.unix()) {
      this.changeFormValue('medicineIntervalStartDate', moment().format('DD/MM/YYYY'));
      this.setState({ selectedDateInterval: moment() });
      TimerMixin.setTimeout(() => {
        Alert.alert(
          'Data incorreta',
          'Não é possível adicionar uma data que esteja no passado.',
          [
            {text: 'OK'},
          ]
        );
      }, 500);
    } else {
      this.changeFormValue('medicineIntervalStartDate', moment(date).format('DD/MM/YYYY'));
      this.setState({ selectedDateInterval: moment(date) });
    }
  };

  addTimeInterval = (time) => {
    let momentTime = moment(time);
    let durationCurrentValue = parseInt(this.props.getFormValue('medicineInterval'));
    let startIntervalDate = moment(this.props.getFormValue('medicineIntervalStartDate'), 'DD/MM/YYYY');
    startIntervalDate.set({hour: momentTime.format('HH'), minute: momentTime.format('mm'), second: momentTime.format('ss')});

    if (startIntervalDate.unix() <= moment().unix() && durationCurrentValue <= 1 && !this.state.isContinuous) {
      TimerMixin.setTimeout(() => {
        Alert.alert(
          'Horário incorreto',
          'Não é possível adicionar um horário que esteja no passado para uma duração de apenas 1 dia.',
          [
            {text: 'OK', onPress: () => {
                this.changeFormValue('medicineIntervalStartTime', moment().format('HH:mm'));
              }},
          ]
        );
      }, 500);
    } else {
      this.changeFormValue('medicineIntervalStartTime', moment(time).format('HH:mm'));
    }
  };

  deleteTimeFrequency = (index) => {
    Alert.alert(
      'Apagar Alarme',
      'Deseja realmente apagar o alarme?',
      [
        {text: 'Cancelar'},
        {text: 'Apagar', onPress: () => {
            this.removeTimeFrequencyFromList(index);
          }}
      ]
    );
  };

  removeTimeFrequencyFromList = (index) => {
    let medicineFrequencyTimes = this.state.medicineFrequencyTimes;
    medicineFrequencyTimes.splice(index, 1);
    this.setState({ medicineFrequencyTimes: medicineFrequencyTimes });
  };

  editTimeFrequency = (index, time) => {
    this.removeTimeFrequencyFromList(index);
    this.addTimeFrequency(time, index);
  };

  renderIntervalFields = () => {

    return (
      <View style={{flex: 1,}} key={this.state.key}>

        <Field label="Intervalo (dias)" name="medicineInterval" component={NoIconField}
               keyboardType="numeric"
               onChange={(itemValue) => { this.changeFormValue('medicineInterval', itemValue) }}
               editable
               placeholder="Ex: 1"
               value={this.getMedicineInterval()}
               normalize={itemValue => { return (itemValue)? itemValue.replace(/[^0-9]/g, '') : this.getMedicineInterval()}}
        />

        <View style={{flexDirection: 'row', marginTop: 10,}}>
          <View style={{flex: 0.5, flexDirection: 'column',}}>
            <Field
              label="Data de início"
              name="medicineIntervalStartDate"
              component={DatePicker}
              mainViewStyle={{width: window.width-40, marginTop: 20,}}
              textColor="#5C6BC0"
              formName="medicineForm"
              fieldName="medicineIntervalStartDate"
              initialDate={this.state.selectedDateInterval}
              onDateChange={(date) => this.addDateInterval(date)}
              validateFuture
            />
          </View>

          <View style={{flex: 0.5, flexDirection: 'column',}}>
            <View style={{flex: 1, flexDirection: 'row',}}>
              <Field label="Horário início" name="medicineIntervalStartTime" component={TimePicker}
                     mainViewStyle={{flex: 1, width: window.width-40, marginTop: 20,}}
                     textColor="#5C6BC0" formName="medicineForm" fieldName="medicineIntervalStartTime"
                     initialDate={this.getMedicineStartAt()}
                     onDateChange={(date) => this.addTimeInterval(date)}
                     startDate={this.props.getFormValue('medicineIntervalStartDate')}
              />
            </View>

          </View>
        </View>

        {(!this.state.isContinuous)? (
          <Field label="Duração da medicação (dias)" name="medicineFrequencyDuration" component={NoIconField}
                 editable={!this.state.isContinuous}
                 keyboardType="numeric"
                 onChange={(itemValue) => { this.changeFormValue('medicineFrequencyDuration', itemValue) }}
                 placeholder="Ex: 1"
                 value={this.getMedicineFrequencyDuration()}
                 normalize={itemValue => { return (itemValue)? itemValue.replace(/[^0-9]/g, '') : this.getMedicineFrequencyDuration()}}
          />
        ) : null}
      </View>
    );
  };

  changeContinuity = () => {
    if (!this.state.isContinuous) {
      this.changeFormValue('medicineFrequencyDuration', '');
      this.changeFormValue('medicineIntervalDuration', '');
    }else {
      this.changeFormValue('medicineFrequencyDuration', '');
      this.changeFormValue('medicineIntervalDuration', '');
    }

    this.setState({ isContinuous: !this.state.isContinuous });
  };

  async handleFormSubmit({medicineName, medicineDose, medicineFrequencyInterval, medicineFrequencyDuration,
                           medicineInterval, medicineIntervalStartDate, medicineIntervalStartTime, medicineIntervalDuration,
                           medicineIsContinuous, annotations}) {

    if (!this.state.canSendForm) {
      return;
    }
    this.setState({ canSendForm: false, });
    let medicineObject = {};
    if (this.state.selectedType === 'frequency') {
      if (this.state.medicineFrequencyTimes.length <= 0) {
        Alert.alert('Atenção', 'Adicione pelo menos um horário para o alarme.');
        this.setState({ canSendForm: true, });
        return; // TODO: alertar o usuário para adicionar pelo menos um horário de alarme.
      }

      let medicineTimes = this.state.medicineFrequencyTimes.map((medicine) => {
        return { alarm_time: moment(medicine, 'HH:mm').unix() };
      });

      medicineObject = {
        name: medicineName,
        dose: medicineDose,
        frequency: 1,
        interval: null,
        duration: (this.state.isContinuous) ? null : parseInt(medicineFrequencyDuration.replace(/[^0-9\.]/g, ''), 10),
        starts_at: moment(medicineFrequencyInterval, 'DD/MM/YYYY').unix(),
        user_medication_alarms: medicineTimes,
        annotations
      };
    } else {
      try {
        if (!medicineInterval) {
          Alert.alert('Atenção', 'Informe um intervalo.');
          this.setState({ canSendForm: true, });
          return;
        }
        medicineObject = {
          name: medicineName,
          dose: medicineDose,
          frequency: 0,
          interval: parseInt(medicineInterval.replace(/[^0-9\.]/g, ''), 10),
          duration: (this.state.isContinuous) ? null : parseInt((medicineIntervalDuration) ? medicineIntervalDuration.replace(/[^0-9\.]/g, '') : '', 10),
          starts_at: moment(medicineIntervalStartDate + ' ' + medicineIntervalStartTime, 'DD/MM/YYYY HH:mm').unix(),
          user_medication_alarms: [
            { alarm_time: moment(medicineIntervalStartDate + ' ' + medicineIntervalStartTime, 'DD/MM/YYYY HH:mm').unix(), }
          ],
          annotations
        };
      }catch (intervalError) {
        console.log('ERROR ON INTERVAL', intervalError);
      }
    }

    if (this.props.medicine.currentIndex > 0) {
      medicineObject.id = this.props.medicine.currentIndex;
    }
    await this.props.sendMedicine(medicineObject);
  }

  backAction = () => {
    this.props.clearMedicineForm();
    Actions.popTo('medicines_list');
  };

  deleteMedicine = () => {
    if (this.props.medicine.currentIndex > 0) {
      Alert.alert('Atenção!', 'Tem certeza que deseja remover este medicamento? Esta ação não poderá ser desfeita.',
        [
          { text: 'Cancelar', onPress: () => { /* you know nothing, Jon Snow... */ } },
          { text: 'OK', onPress: () => this.props.deleteMedicine([this.props.medicine.currentIndex], true)}
        ]);
    }
  };

  _scrollToInput (reactNode: any) {
    this.scroll.props.scrollToFocusedInput(reactNode);
  }

  render = () => {
    const window = Dimensions.get('window');
    let {handleSubmit,} = this.props;

    return (
      <Container style={{backgroundColor: 'transparent', width: window.width, height: window.height,}}>
        <Header style={{backgroundColor: 'transparent', elevation: 0, borderBottomWidth: 2, height: 70, borderBottomColor: '#F1F1F1',}}>
          <CustomStatusBar bgColor={"#5C6BC0"} theme={(Platform.OS === 'ios') ? 'dark-content' : 'light-content'} />

          <View style={{flex: 1, flexDirection: 'row', marginLeft: 5,}}>
            <DefaultBackButton text={(this.props.medicine.currentIndex > 0) ? 'Editar medicamento' : 'Adicionar medicamento'} onPress={() => this.backAction() } />
          </View>
        </Header>

        <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10, width: window.width}}>
          <View style={{flex: 1, flexDirection: 'column', width: (window.width-40), alignItems: 'center', height: window.height,}} key={this.state.key}>
            <ScrollView style={{flex: 1,}} showsVerticalScrollIndicator={false}>
              <KeyboardAvoidingView>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field name="medicineName"
                         component={NoIconField}
                         label="Nome do Medicamento"
                         placeholder="Ex: Dipirona 500mg"
                         editable
                  />
                </View>

                <Field name="medicineDose"
                       component={NoIconField}
                       label="Dose"
                       placeholder="Ex: 1 comprimido"
                       editable
                />

                <View style={{flex: 1, flexDirection: 'column', marginTop: 20,}}>
                  <View style={{flex: 0.4, flexDirection: 'row', marginLeft: 10,}}>
                    <Text allowFontScaling={false}  style={{fontSize: Style.FONT_SIZE_20, color: '#000000'}}>Frequência</Text>
                  </View>

                  <View style={{flex: 0.6, flexDirection: 'row', marginTop: 15, marginLeft: (Platform.OS === 'ios') ? 0 : 10}}>
                    <View style={{flex: 0.5, flexDirection: 'column',}}>
                      <Field
                        name="medicineFrequencyCheckBox"
                        component={(props) => {
                          return (Platform.OS === 'ios') ?
                            <CustomCheckBox
                              {...props}
                              label="Diária"
                              labelColor="#868686"
                              labelPaddingLeft={5}
                              labelFontSize={Style.FONT_SIZE_20}
                              checkBoxColor="#5C6BC0"
                              checked={(this.state.selectedType === 'frequency')}
                              onPress={() => this.changeSelectionType('frequency')}
                            />
                            :
                            <CustomRadioBox
                              {...props}
                              label="Diária"
                              labelColor="#868686"
                              labelPaddingLeft={3}
                              labelFontSize={Style.FONT_SIZE_20}
                              checkBoxColor="#5C6BC0"
                              checked={(this.state.selectedType === 'frequency')}
                              onPress={() => this.changeSelectionType('frequency')}
                            />
                        }}
                      />
                    </View>

                    <View style={{flex: 0.5, flexDirection: 'column', paddingRight: 3}}>
                      <Field
                        name="medicineIntervalCheckBox"
                        component={(props) => {
                          return (Platform.OS === 'ios') ?
                            <CustomCheckBox
                              {...props}
                              label="Alternada"
                              labelColor="#868686"
                              labelPaddingLeft={5}
                              labelFontSize={Style.FONT_SIZE_20}
                              checkBoxColor="#5C6BC0"
                              checked={(this.state.selectedType === 'interval')}
                              onPress={() => this.changeSelectionType('interval')}
                            />
                            :
                            <CustomRadioBox
                              {...props}
                              label="Alternada"
                              labelColor="#868686"
                              labelPaddingLeft={3}
                              labelFontSize={Style.FONT_SIZE_20}
                              checkBoxColor="#5C6BC0"
                              checked={(this.state.selectedType === 'interval')}
                              onPress={() => this.changeSelectionType('interval')}
                            />
                        }}
                      />
                    </View>
                  </View>
                </View>

                {
                  (this.state.selectedType === 'frequency') ? this.renderFrequencyFields() : this.renderIntervalFields()
                }

                <View style={{marginTop: 10, marginLeft: (Platform.OS === 'ios') ? 0 : 10}}>
                  <Field
                    name="medicineIsContinuous"
                    component={(props) => {
                      return (Platform.OS === 'ios') ?
                        <CustomCheckBox
                          {...props}
                          label="Contínua"
                          labelColor="#868686"
                          labelPaddingLeft={5}
                          labelFontSize={Style.FONT_SIZE_20}
                          checkBoxColor="#5C6BC0"
                          checked={this.state.isContinuous}
                          onPress={() => this.changeContinuity()}
                        />
                        :
                        <CustomRadioBox
                          {...props}
                          label="Contínua"
                          labelColor="#868686"
                          labelPaddingLeft={3}
                          labelPaddingTop={-1}
                          labelFontSize={Style.FONT_SIZE_20}
                          checkBoxColor="#5C6BC0"
                          checked={this.state.isContinuous}
                          onPress={() => this.changeContinuity()}
                        />
                    }}
                  />
                </View>

                <Field
                  label="Observações"
                  name="annotations"
                  placeholder="Ex: Digite aqui suas observações"
                  component={TextArea}
                  contentSizeChange={(event) => {
                    this._scrollToInput(findNodeHandle(event.target))
                  }}
                  focusChange={(event) => {
                    this._scrollToInput(findNodeHandle(event.target))
                  }}
                />

              </KeyboardAvoidingView>
              {(this.props.medicine.currentIndex > 0)? ( // Is edition?
                <DefaultPurpleButton text="APAGAR" marginTop={20} disabled={!(this.props.medicine.currentIndex > 0)} width={window.width * 0.85} buttonAction={() => { this.deleteMedicine(); }} />
              ): null}

            </ScrollView>
          </View>
        </Content>

        <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', position: 'absolute', top: 40, right: 10,}}>
          <TouchableOpacity onPress={handleSubmit(this.handleFormSubmit.bind(this))}
                            style={{width: 50, height: 50, backgroundColor: '#5C6BC0', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
            <Text allowFontScaling={false} style={{ fontSize: Style.FONT_SIZE_20, color: '#FFFFFF'}}>
              <FontAwesome>{Icons.floppyO}</FontAwesome>
            </Text>
          </TouchableOpacity>
        </View>

        <DefaultLoader visible={this.props.loader.active.status} label={this.props.loader.active.msg} />
      </Container>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    loader: state.loader,
    medicine: state.medicine,
  };
};
const afterSubmit = (result, dispatch) => { dispatch(reset('medicineForm')) };
const medicineForm = reduxForm({
  form: 'medicineForm',
  touchOnBlur: true,
  destroyOnUnmount: true,
  validate: formValidate,
})(MedicineForm);

export default connect(mapStateToProps, medicineActions)(medicineForm);
