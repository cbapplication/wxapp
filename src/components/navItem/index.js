import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'

export default class NavItem extends Taro.Component {
  static defaultProps = {
    itemData: {
      itemKey: '',
      itemValue: '',
      isShowArrow: false
    }
  }
  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  static options = {
    addGlobalClass: true
  }

  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const itemData = this.props.itemData
    const isShowArrow = this.props.itemData.isShowArrow && true //默认不带小箭头
    return (
      <View className="item-box">
        <View onClick={this.props.onSet} data-value={itemData.itemKey} className="clearfix">
          <View className="fl">{itemData.itemKey}</View>
          <View className={`fr ${isShowArrow ? '' : 'hide-arrow'}`}>
            <View className="value oneLineOmit">{itemData.itemValue}</View>
            <Image className="yCenter" src={require('../../static/images/rightIcon.png')}></Image>
          </View>
        </View>
      </View>
    )
  }
}

