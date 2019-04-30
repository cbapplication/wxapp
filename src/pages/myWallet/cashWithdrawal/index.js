import Taro from '@tarojs/taro'
import { View,Image,CheckboxGroup,Text,Checkbox, Input } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../../globalData'
import './index.css'

import {cash,myWallet} from '../../../api/user'
import ServiceModel from '../../../components/serviceModel'
import { staticRecord } from '../../../api/index'

export default class cashIndex extends Taro.Component {
    config = {
        navigationBarTitleText: '钱包提现',
        navigationBarBackgroundColor:'#ffc233',
    }
    constructor (props) {
    super(props)
    this.state = {
            wallet:{},//我的钱包
            showServiceModel:false,
            weixin:'',//客服微信号
            money:'',
            type:''//支付方式
        }
    }
    service(){
        this.setState({showServiceModel:true})
    }
    closeServiceModel(){
        this.setState({showServiceModel:false})
    }
    radioChange(e){
        let {value} = e.detail;
        this.setState({type:value[0]})
    }
    //提现金额
    money(e){
        let {value} = e.detail;
        this.setState({
            money:value
        })
    }
    //全部提现
    allMoney(all){
        this.setState({
            money:all
        })
    }
    cash(){
       let {money,type} = this.state;
       if(type == '') return Taro.showToast({icon:'none',title:'请选择支付方式'})
       this.Cash({money:money})
    }
    componentWillMount () {
        this.MyWallet()
        this.setState( pre => {
            pre.weixin = Taro.getStorageSync('weixin')
      })
    }
    //提现
    Cash(params){
        cash(params).then( res => {
            if(res.success){
                Taro.showToast({icon:'none',title:'提现成功'});
                Taro.navigateBack()
            }else{
                Taro.showToast({icon:'none',title:'提现失败'});
            }
        })
    }
    //钱包
    MyWallet(){
        myWallet().then( res => {
            if(res.success){
                this.setState( pre => {
                    pre.wallet = res
                })
            }
        })
    }
    componentDidShow(){
        staticRecord()
    }
  render () {
    const {showServiceModel,weixin,wallet,money} = this.state;
    return (
        <View className="page">
            <View className='pay-block'>
                <View className='pay-money'>
                    <Text>提现金额</Text>
                    <Input onInput={this.money} type='number' value={money} placeholder='请输入充值金额'/>
                </View>
                <View className='all'>
                   <View className='all-left'>
                       <View>保证金可提现金额¥{wallet.active_money}</View>
                       <View>保证金账户总金额¥{wallet.money}</View>
                   </View>
                   <View onClick={this.allMoney.bind(this,wallet.active_money)} className='all-btn'>全部提现</View>
                </View>
            </View>
            <CheckboxGroup onChange={this.radioChange} className="pay-type">
                <View className='pay-title'>支付方式</View>
                <View className="pay-method-2">
                    <Image src={require("../../../static/images/weixin.png")}/>
                    <View className="pay-explain">
                        <View>微信支付</View>
                        <View>单笔最高¥5,000-50,000</View>
                    </View>
                    <Checkbox checked={false} value='weixin' color="#fbbb30" />
                </View>
                <View className="pay-method">
                    <Image src={require("../../../static/images/huikuan.png")}/>
                    <View className="text">汇款或其他方式支付</View>
                    <Text onClick={this.service}>联系客服</Text>
                </View>
            </CheckboxGroup>
            <View className={`pay-bottom ${getGlobalData('phoneModel')?'pay-bottom-phoneModel':''}`}>
                <View className='pay-bottom-pay' onClick={this.cash}>确认提现</View> 
            </View>
            {/* 微信客服 */}
            <ServiceModel weixin={weixin} onCloseServiceModel={this.closeServiceModel} show={showServiceModel}></ServiceModel>
        </View>
    )
  }
}