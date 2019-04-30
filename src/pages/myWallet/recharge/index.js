import Taro from '@tarojs/taro'
import { View,Image,CheckboxGroup,Text,Checkbox, Input } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../../globalData'
import './index.css'

import ServiceModel from '../../../components/serviceModel'
import {bail} from '../../../api/pay'
import { staticRecord } from '../../../api/index'

export default class recharge extends Taro.Component {
    config = {
        navigationBarTitleText: '钱包充值',
        navigationBarBackgroundColor:'#ffc233',
    }
    constructor (props) {
    super(props)
    this.state = {
            wallet:{},//我的钱包
            showServiceModel:false,
            weixin:'',//客服微信号
            money:'',
            wechat:false,
        }
    }
    service(){
        this.setState({showServiceModel:true})
    }
    closeServiceModel(){
        this.setState({showServiceModel:false})
    }
    money(e){
       this.setState( pre => {
           pre.money = e.detail.value
       })
    }
    payMethod(){
        let {wechat} = this.state;
        if(wechat){
            this.setState( pre => {
                pre.wechat = false
            })
        }else{
            this.setState( pre => {
                pre.wechat = true
            })
        }
       
    }
    recharge(){
        let {money,wechat} = this.state;
        if(wechat&&money!=''){
            bail({money:money}).then( res => {
                wx.requestPayment({
                    timeStamp: res.timeStamp,
                    nonceStr: res.nonceStr,
                    package: res.package,
                    signType: res.signType,
                    paySign: res.paySign,
                    success(r) { 
                        Taro.showToast({icon:'none',title:'充值成功'})
                        Taro.navigateBack()
                    },
                    fail(err) { 
                        Taro.showToast({icon:'none',title:'充值失败'})
                    }
                  })
            })
        }else if(money==''){
            Taro.showToast({icon:'none',title:'请输入金额'})
        }else{
            Taro.showToast({icon:'none',title:'请选择支付方式'})
        }
       
    }
    componentWillMount () {
      this.setState( pre => {
          pre.weixin = Taro.getStorageSync('weixin')
    })
  }
  componentDidShow(){
    staticRecord()
  }
  render () {
    const {showServiceModel,weixin,wechat} = this.state;
    return (
        <View className="page">
            <View className='pay-block'>
                <View className='pay-money'>
                    <Text>充值金额</Text>
                    <Input onInput={this.money} type='number' placeholder='请输入充值金额'/>
                </View>
                <View className='pay-tip'><Text>钱包余额可用于支付尾款</Text></View>
            </View>
            <CheckboxGroup onChange={this.radioChange.bind(this)} className="pay-type">
                <View className='pay-title'>支付方式</View>
                <View onClick={this.payMethod} className="pay-method-2">
                    <Image src={require("../../../static/images/weixin.png")}/>
                    <View className="pay-explain">
                        <View>微信支付</View>
                        <View>单笔最高¥5,000-50,000</View>
                    </View>
                    <Checkbox checked={wechat} color="#fbbb30" />
                </View>
                <View className="pay-method">
                    <Image src={require("../../../static/images/huikuan.png")}/>
                    <View className="text">汇款或其他方式支付</View>
                    <Text onClick={this.service}>联系客服</Text>
                </View>
            </CheckboxGroup>
            <View className={`pay-bottom ${getGlobalData('phoneModel')?'pay-bottom-phoneModel':''}`}>
                <View className='pay-bottom-pay' onClick={this.recharge}>确认充值</View> 
            </View>
             {/* 微信客服 */}
             <ServiceModel weixin={weixin} onCloseServiceModel={this.closeServiceModel} show={showServiceModel}></ServiceModel>
        </View>
    )
  }
}