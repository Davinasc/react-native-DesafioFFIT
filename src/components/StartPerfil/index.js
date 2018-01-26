import React, { PureComponent } from 'react';
import { connect, } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text, Dimensions, View, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Alert, StyleSheet, Image } from 'react-native';
import { Icon, Left, Right, Content, } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-easy-toast';
import { Actions } from 'react-native-router-flux';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

import Thumbnail from '../common/view/Thumbnail';
import RightMenu from '../common/menu/RightMenu';
import Header from '../common/header';
import Container from '../common/container';

import * as userActions from '../../actions/userActions';
import * as profileActions from '../../actions/profileActions';
import * as ffitActions from '../../actions/ffitAction';

import Style from '../../utils/responsiveFactor';
import DefaultLoader from '../common/loader/DefaultLoader';
import CustomStatusBar from '../common/statusbar/CustomStatusBar';
import PerfilButton from '../common/button/ButtonWithTwoTextLinesAndBottomIcon';

import Collapsible from 'react-native-collapsible';
import StartPerfilImcWrap from './StartPerfilImcWrap';
import StartPerfilPressaoWrap from './StartPerfilPressaoWrap';
import StartPerfilDiversosWrap from './StartPerfilDiversosWrap';


const window = Dimensions.get('window');

class StartPerfilScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
			loadedValue: false,
			imcCollapsed: true,
      blood_pressureCollapsed: true,
      othersCollapsed: true,
		};
  }

  _toggleExpandedAll = () => {
    if(!this.state.loadedValue) {
			this.setState({
				loadedValue: !this.state.loadedValue,
				imcCollapsed: !this.state.imcCollapsed,
        blood_pressureCollapsed: !this.state.blood_pressureCollapsed,
        othersCollapsed: !this.state.othersCollapsed,
      });
		}
  }
  
  _toggleExpandedImc = () => {
		this.setState({imcCollapsed: !this.state.imcCollapsed});
		this._toggleExpandedAll();
	}

	_toggleExpandedBloodPressure = () => {
		this.setState({blood_pressureCollapsed: !this.state.blood_pressureCollapsed});
		this._toggleExpandedAll();
  }
  
  _toggleExpandedOthers = () => {
		this.setState({othersCollapsed: !this.state.othersCollapsed});
		this._toggleExpandedAll();
  }

  renderRightMenu() {
    let menus = [
      {
        text: 'Sair',
        action: () => { this.props.userActions.signoutUser(); }
      }
    ];

    return (
      <RightMenu menus={menus} iconName="md-more"
         customStyles={{
           triggerTouchable: {
             hitSlop: {top: 10, bottom: 10, right: 10, left: 10,}
           },
           triggerWrapper: {width: 40, alignItems: 'center', justifyContent: 'center'}
         }}
         menuOptionsStyles={{
           optionsContainer: {width: 180}
         }}
      />
    );
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  componentDidMount() {
    this.props.profileActions.getProfileInfo();
    this.props.ffitActions.updateFfitToken();
  }

  render() {
    return (
      <MenuProvider>
        <Header>
          <CustomStatusBar bgColor={"#5C6BC0"} theme={(Platform.OS === 'ios') ? 'dark-content' : 'light-content'} />
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.7, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 20,}}>
              <Text allowFontScaling={false} style={{fontSize: Style.FONT_SIZE_20, color: '#868686'}}>Início</Text>
            </View>

            <View style={{flex: 0.3, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center',}}>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 0.5, flexDirection: 'column', alignItems: 'center',}}>
                  {this.renderRightMenu()}
                </View>
              </View>
            </View>
          </View>
        </Header>

        <Container>
          <KeyboardAvoidingView style={{flex: 1,}} behavior="padding" keyboardVerticalOffset={(Platform.OS === 'ios') ? 80 : -90}>
            <ScrollView>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 10}}>
                <View style={{marginTop: 10, flexDirection: 'row', width: (window.width-20),}}>
                  <View style={{marginTop: 5,}}>
                    <TouchableOpacity onPress={() => { /* TODO */ }}>
                      <Thumbnail width={48} height={48} backgroundColor="#F1F1F1" imagePath={(this.props.profile.profile_picture) ? { uri: this.props.profile.profile_picture } : require('../../lib/Images/AVATAR_MRES.png')}
                                 imageWidth={48} imageHeight={48} />
                    </TouchableOpacity>
                  </View>

                  <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 10,}}>
                    <Text allowFontScaling={false} style={{fontSize: Style.FONT_SIZE_24, color: '#5C6BC0', fontWeight: '100', width: (window.width-100)}}>{this.props.profile.name}</Text>
                    <Text allowFontScaling={false} style={{fontSize: Style.FONT_SIZE_13, color: '#5C6BC0', fontWeight: '100',}}>{this.props.profile.cpf}</Text>
                  </View>
                </View>

                <View style={{width: (window.width - 20), flex: 1, flexDirection: 'row', marginTop: 20,}}>
                  <PerfilButton
                    upperText="Minhas"
                    bottomText="Alergias"
                    image={require('../../lib/Images/icon_lupa_active.png')}
                  />

                  <PerfilButton
                    onPress={Actions.medicines_group}
                    upperText="Meus"
                    bottomText="Medicamentos"
                    bottomTextStyle={{fontSize: Style.FONT_SIZE_11, fontWeight: 'bold'}}
                    image={require('../../lib/Images/icon_pilula_active.png')}
                  />

                  <PerfilButton
                    upperText="Doenças"
                    bottomText="Crônicas"
                    image={require('../../lib/Images/icon_chronic_disease_active.png')}
                  />
                </View>
                
                <View style={styles.cardForm}>
                  <TouchableOpacity onPress={this._toggleExpandedImc}>
                    <View style={styles.cardFormTitle}>
                      <Text style={styles.wrapTitle }>IMC</Text>
                      <Image 
                        style={{width: 12, height: 12, opacity: 0.5 }}
                        source={require('../../lib/Images/icon_expand_button.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <Collapsible collapsed={this.state.imcCollapsed}>
                    <StartPerfilImcWrap
                      height={this.props.profile.height}
                      weight={this.props.profile.weight}
                    />
                  </Collapsible>
                </View>

                <View style={styles.cardForm}>
                  <TouchableOpacity onPress={this._toggleExpandedBloodPressure}>
                    <View style={styles.cardFormTitle}>
                      <Text style={styles.wrapTitle }>Pressão Arterial</Text>
                      <Image 
                        style={{width: 12, height: 12, opacity: 0.5 }}
                        source={require('../../lib/Images/icon_expand_button.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <Collapsible collapsed={this.state.blood_pressureCollapsed}>
                    <StartPerfilPressaoWrap
                      systolic={this.props.profile.blood_pressure.systolic}
                      diastolic={this.props.profile.blood_pressure.diastolic}
                    />
                  </Collapsible>
                </View>

                <View style={styles.cardForm}>
                  <TouchableOpacity onPress={this._toggleExpandedOthers}>
                    <View style={styles.cardFormTitle}>
                      <Text style={styles.wrapTitle }>Demais Dados</Text>
                      <Image 
                        style={{width: 12, height: 12, opacity: 0.5 }}
                        source={require('../../lib/Images/icon_expand_button.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <Collapsible collapsed={this.state.othersCollapsed}>
                    <StartPerfilDiversosWrap 
                      heart_beat={this.props.profile.heart_beat}
                      glycemia= {this.props.profile.glycemia}
                      temperature= {this.props.profile.temperature}
                    />
                  </Collapsible>
                </View>

              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </Container>

        <DefaultLoader visible={this.props.loader.active.status} label={this.props.loader.active.msg} />
        <Toast ref="toast" opacity={0.6} position='center' />
      </MenuProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile,
    loader: state.loader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    profileActions: bindActionCreators(profileActions, dispatch),
    ffitActions: bindActionCreators(ffitActions, dispatch),
    dispatchActions: dispatch,
  };
};

const styles = StyleSheet.create({
  wrapTitle: {
    marginVertical: 10,
    fontSize: 18
  },
  cardForm: {
    flex: 0.2,
    flexDirection: 'column',
    width: (window.width - 20),
    backgroundColor: '#FFF',
    elevation: 1,
    margin: 5
  },
  cardFormTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(StartPerfilScreen);
