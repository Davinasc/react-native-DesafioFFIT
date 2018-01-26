import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, Icon } from 'native-base';
import Modal from 'react-native-modal';
import Style from '../../../../utils/responsiveFactor';

const styles = StyleSheet.create({
  modalHolder: {
    backgroundColor: '#FFFFFF',
  },
  contentHolder: {
    flex: 1,
    marginTop: 0,
    justifyContent: 'center',
  },
});

export default class CustomModal extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderHeader = () => {
    if (!this.props.hideTop) {
      return (
        <View
          style={{flex: 0.1, flexDirection: 'row', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#CCCCCC'}}>
          <View style={{
            flex: 0.8,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: 16,
          }}>
            <Text allowFontScaling={false}
                  style={{fontSize: Style.FONT_SIZE_13, color: '#000000'}}>{this.props.title}</Text>
          </View>

          <View style={{flex: 0.2, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <Button transparent onPress={() => {this.props.onCloseAction()}}>
              <Icon name="md-close" style={{fontSize: Style.FONT_SIZE_20, color: '#000000', alignItems: 'flex-end',}}/>
            </Button>
          </View>
        </View>
      );
    } else {
      return;
    }
  }

  render = () => {
    const {
      customHeight,
      customFlexDirection,
      customAlign,
    } = this.props;
    return (
      <Modal isVisible={this.props.visible}>
        <View style={[
          styles.modalHolder,
          {
            height: customHeight? customHeight : Dimensions.get('window').height
          }
        ]}>
          { this.renderHeader() }
          <View style={[
            styles.contentHolder,
            {
              flexDirection: customFlexDirection ? customFlexDirection : 'row',
              alignItems: customAlign ? customAlign : 'flex-start',
            }
          ]}>
            {this.props.content}
          </View>
        </View>
      </Modal>
    );
  };
}
