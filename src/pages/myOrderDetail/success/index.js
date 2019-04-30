import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../../globalData'
import zhifuchenggong from "../../../static/images/zhifuchenggong.png"
import './index.less'
import { staticRecord } from '../../../api/index'

export default class mywallet extends Taro.Component {

  config = {
    navigationBarTitleText: '我的钱包',
    navigationBarBackgroundColor:'#ffc233',
  }
  constructor (props) {
    super(props)
    this.state = {
         money:''
     }
  }
  goHome(){
    Taro.switchTab({url:'../../home/index'})
  }
  check(){
    Taro.navigateBack({delta:2})
  }
  componentDidShow () { 
    const {money} = this.$router.params;
    this.setState( pre => {
        pre.money = money;
    })
    staticRecord()
  }
  render () {
    let {money} = this.state;
    return (
        <View className="page">
            <View className="page-head"></View>
            <Image src={zhifuchenggong}/>
            <View className='success'>支付成功</View>
            <View className='money'>订单总额：￥{money}</View>
            <View className={`wallet-bottom ${getGlobalData('phoneModel')?'wallet-bottom-phoneModel':''}`}>
                <View onClick={this.goHome} className="wallet-left-btn">返回首页</View>
                <View onClick={this.check} className="wallet-right-btn">订单列表</View>
            </View>
        </View>
    )
  }
}

