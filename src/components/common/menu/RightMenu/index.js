import React, { PureComponent } from 'react';
import { Text, View, TouchableHighlight } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'native-base';
import Style from '../../../../utils/responsiveFactor';

export default class RightMenu extends PureComponent {
  constructor(props){
    super(props)
  }

  render = () => {
    return (
      <Menu>
        <MenuTrigger customStyles={this.props.customStyles} >
          <View style={this.props.viewStyle}>
            {this.props.showTextLabel ? (
              <View style={{flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',}}>
                  <Text allowFontScaling={false}  style={{color: '#CCC', fontSize: Style.FONT_SIZE_12,}}>{this.props.selectedLabel}</Text>
                </View>
                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',}}>
                  <Icon name={this.props.iconName} style={{fontSize: (this.props.iconSize) ? this.props.iconSize : Style.FONT_SIZE_24, color: '#868686'}} />
                </View>
              </View>
            ) : <Icon name={this.props.iconName} style={{fontSize: (this.props.iconSize) ? this.props.iconSize : Style.FONT_SIZE_24, color: '#868686'}} />}
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={this.props.menuOptionsStyles}>
          {
            this.props.menus.map((menu, i) => {
              return (
                <MenuOption key={i} onSelect={() => menu.action()}
                            customStyles={{optionWrapper: { height: 40, alignItems: 'flex-start', justifyContent: 'center', borderBottomColor: (i !== this.props.menus.length) ? '#CCCCCC' : 'transparent', borderBottomWidth: (i !== this.props.menus.length) ? 1 : 0,}}}>
                  <Text allowFontScaling={false}  style={{fontSize: Style.FONT_SIZE_13,}}>{menu.text}</Text>
                </MenuOption>
              );
            })
          }
        </MenuOptions>
      </Menu>
    );
  }
}
