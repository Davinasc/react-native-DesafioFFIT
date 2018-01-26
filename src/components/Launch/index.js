import React, { PureComponent } from 'react';
import { Image, View, Text, Dimensions, ImageBackground, TouchableOpacity, Platform, AsyncStorage, StyleSheet } from 'react-native';
import { Container, Button, } from 'native-base';
import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux';

import Style from '../../utils/responsiveFactor';
import CustomStatusBar from '../common/statusbar/CustomStatusBar';

export default class LaunchScreen extends PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    const window = Dimensions.get('window');
    return (
      <ImageBackground
        source={require('../../lib/Images/bg_1x.png')}
        style={launchScreenStyle.backgroundImage}
      >
        <CustomStatusBar
          bgColor="#5C6BC0"
          theme="light-content"
        />
        <Container style={launchScreenStyle.mainContainer}>
          <View style={launchScreenStyle.mainContainerHolder}>
            <View style={launchScreenStyle.logoHolder}>
              <Image
                source={require('../../lib/Images/mresLogo-white.png')}
                style={launchScreenStyle.logoStyle}
              />
            </View>

            <View style={launchScreenStyle.swiperMainHolder}>
              <View style={launchScreenStyle.swiperHolder}>
                {/*<Swiper*/}
                  {/*style={{ justifyContent: 'flex-end'}}*/}
                  {/*autoplay*/}
                  {/*autoplayTimeout={(Platform.OS === 'ios') ? 3 : 5}*/}
                  {/*dotColor="#CCCCCC"*/}
                  {/*activeDotColor="#FFFFFF"*/}
                  {/*dotStyle={{ width: 5, height: 5 }}*/}
                  {/*width={Dimensions.get('window').width}*/}
                {/*>*/}
                  {/*<View style={launchScreenStyle.swiperEachView}>*/}
                    {/*<Text*/}
                      {/*allowFontScaling={false}*/}
                      {/*style={launchScreenStyle.swiperEachViewText}*/}
                    {/*>*/}
                      {/*Resultados de exames no celular*/}
                    {/*</Text>*/}
                  {/*</View>*/}
                  {/*<View style={launchScreenStyle.swiperEachView}>*/}
                    {/*<Text*/}
                      {/*allowFontScaling={false}*/}
                      {/*style={launchScreenStyle.swiperEachViewText}*/}
                    {/*>*/}
                      {/*Suas últimas consultas*/}
                    {/*</Text>*/}
                  {/*</View>*/}
                  {/*<View style={launchScreenStyle.swiperEachView}>*/}
                    {/*<Text*/}
                      {/*allowFontScaling={false}*/}
                      {/*style={launchScreenStyle.swiperEachViewText}*/}
                    {/*>*/}
                      {/*Acompanhamento em tempo real*/}
                    {/*</Text>*/}
                  {/*</View>*/}
                {/*</Swiper>*/}
              </View>

              <View style={launchScreenStyle.buttonHolder}>
                <View style={launchScreenStyle.eachButtonHolder}>
                  <Button
                    onPress={() => { /* TODO: botão CADASTRE-SE */ }}
                    small
                    rounded
                    light
                    style={[
                      launchScreenStyle.buttonStyle,
                      {
                        backgroundColor: 'rgba(255,255,255,1)',
                      },
                    ]}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[
                        launchScreenStyle.textButtonStyle,
                        {
                          color: '#5C6BC0',
                        },
                      ]}
                    >
                      CADASTRE-SE
                    </Text>
                  </Button>

                </View>

                <View style={launchScreenStyle.eachButtonHolder}>
                  <Button
                    onPress={() => Actions.auth()}
                    small
                    rounded
                    style={[
                      launchScreenStyle.buttonStyle,
                      {
                        backgroundColor: 'rgba(92,107,192,0.8)',
                        marginTop: 20,
                      },
                    ]}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[
                        launchScreenStyle.textButtonStyle,
                        {
                          color: '#FFFFFF',
                        },
                      ]}
                    >
                      ENTRAR
                    </Text>
                  </Button>
                </View>

                <View style={launchScreenStyle.forgotPasswordHolder}>
                  <TouchableOpacity
                    onPress={() => { /* botão ESQUECI MINHA SENHA */ }}
                    hitSlop={{
                      top: 10,
                      left: 10,
                      right: 10,
                      bottom: 10,
                    }}
                  >
                    <Text style={launchScreenStyle.forgotPasswordText}>Esqueci minha senha</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Container>
      </ImageBackground>
    );
  }
}

const launchScreenStyle = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: (Platform.OS === 'ios') ? Dimensions.get('window').height : (Dimensions.get('window').height-24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  mainContainerHolder: {
    flex: 1,
  },
  logoHolder: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoStyle: {
    width: 200,
    height: 120,
    backgroundColor: 'transparent',
  },
  swiperMainHolder: {
    flex: 0.4, justifyContent: 'flex-end',
  },
  swiperHolder: {
    height: 70,
    justifyContent: 'flex-end',
  },
  swiperEachView: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  swiperEachViewText: {
    fontSize: Style.FONT_SIZE_15, color: '#FFFFFF',
  },
  buttonHolder: {
    backgroundColor: 'transparent',
  },
  eachButtonHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: 310,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonStyle: {
    fontSize: Style.FONT_SIZE_18,
    fontWeight: 'bold',
  },
  forgotPasswordHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: Style.FONT_SIZE_13,
    color: '#CCCCCC',
  },
});
