import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView,Progress } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import rightIcon from "../../static/images/rightIcon.png"
import './index.less'
import ServiceModel from '../../components/serviceModel'
import {myWallet} from '../../api/user'
import { staticRecord } from '../../api/index'
import {formatMoney} from '../../utils/funs'
export default class mywallet extends Taro.Component {

  config = {
    navigationBarTitleText: '我的钱包',
    navigationBarBackgroundColor:'#ffc233',
  }
  constructor (props) {
    super(props)
    this.state = {
         wallet:{},//我的钱包
         weixin:'',
         showServiceModel:false,
     }
  }

  //客服
  service(){
    this.setState({showServiceModel:true})
  }
  closeServiceModel(){
      this.setState({showServiceModel:false})
  }
  goToWalletDetail(){
    Taro.navigateTo({url:'../walletDetail/index'})
  }
  cash(){
    Taro.navigateTo({url:'./cashWithdrawal/index'})
  }
  recharge(){
    Taro.navigateTo({url:'./recharge/index'})
  }
  componentDidShow () { 
    this.getMyWallet()
    this.setState( pre => {
      pre.weixin = Taro.getStorageSync('weixin')
    })
    staticRecord()
  }

  componentDidHide () {  }

  //我的钱包
  getMyWallet(){
    myWallet().then( res => {
      if(res.success){
         this.setState( pre => {
           pre.wallet = res
         })
      }
    })
  }
  render () {
    let {wallet,weixin} = this.state;
    return (
        <View className="page">
            <View className="page-head"></View>
            <ScrollView scroll-y scroll-with-animation>
              <View className="wallet">
                    <View className="wallet-tip">可用金额(元)</View>
                    <View className="wallet-tip">可用金额可用于出价和提现</View>
                    <View className="wallet-total">{formatMoney(wallet.active_money)}</View>
                    <Progress percent={wallet.percent} style='border-radius:6rpx;overflow:hidden' color="red" stroke-width="6" activeColor="#ffc233" backgroundColor="#eeebe4" />
                    <View className="wallet-money">
                        <View>
                            <View>帐户总额(元)</View>
                            <View>{wallet.money}</View>
                        </View>
                        <View>
                            <View>冻结金额(元)</View>
                            <View>{wallet.locked_money}</View>
                        </View>
                    </View>
                    <View onClick={this.goToWalletDetail} className="wallet-detail">
                        <View className="wallet-left">账户明细</View>
                        <Image src={require("../../static/images/rightIcon.png")}/>
                        <View className="wallet-right">点击查看账户余额</View>
                    </View>
              </View>
              <View className="introduce">答疑解惑</View>
              <View onClick={this.service} className="role">保证金存放在哪来?
                  <Image src={rightIcon}/>
              </View>
              <View onClick={this.service} className="role">为什么冻结保证金?
                  <Image src={rightIcon}/>
              </View>
            </ScrollView>
            <View className={`wallet-bottom ${getGlobalData('phoneModel')?'wallet-bottom-phoneModel':''}`}>
                <View onClick={this.cash} className="wallet-left-btn">提现</View>
                <View onClick={this.recharge} className="wallet-right-btn">充值</View>
            </View>
            {/* 微信客服 */}
            <ServiceModel weixin={weixin} onCloseServiceModel={this.closeServiceModel} show={showServiceModel}></ServiceModel>
        </View>
    )
  }
}

