import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, CheckboxGroup, Checkbox } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import ServiceModel from '../../components/serviceModel/index'
import './index.less'

import { orderDetail, detail } from '../../api/order'
import { order } from '../../api/pay'
import { staticRecord } from '../../api/index'
import { IMG_BASE } from '../../utils/const'
import { formatMoney, countDown, formatDate } from '../../utils/funs'
export default class orderdetail extends Taro.Component {

  config = {
    navigationBarTitleText: '订单详情',
  }
  
  constructor (props) {
    super(props)
    this.state = {
        timer:null,
        showServiceModel: false,//客服
        orderInfo:{},//订单详情
        weixin:'',
        type:'',//支付方式
        prepay_id:'',//预支付ID
        isEnough:false,
        prepay_money:0//预支付金额   
     }
  }
  radioChange(e){
      const {isEnough,orderInfo} = this.state;
      let {value} = e.detail;
      if(isEnough){
        if(value.length>1){
            pre.type = 'wallet';
            pre.prepay_money = 0
        }else if(value[0] == 'wallet'){
            this.setState( pre => {
                pre.type = 'wallet';
                pre.prepay_money = 0
            })
        }else if(value[0] == 'weixin'){
            this.setState( pre => {
                pre.type = 'weixin';
                pre.prepay_money = orderInfo.prepay_money
            })
         }else{
            this.setState( pre => {
                pre.type = '';
                pre.prepay_money = orderInfo.prepay_money
            })
         }
      }else{
        if(value.length>1){
            this.setState( pre => {
                pre.type = 'mix';
                pre.prepay_money = orderInfo.prepay_money - orderInfo.balance
            })
         }else if(value[0] == 'wallet'){
           this.setState( pre => {
               pre.type = 'wallet';
               pre.prepay_money = orderInfo.prepay_money
           })
         }else if(value[0] == 'weixin'){
            this.setState( pre => {
                pre.type = 'weixin';
                pre.prepay_money = orderInfo.prepay_money
            })
         }else{
            this.setState( pre => {
                pre.type = '';
                pre.prepay_money = orderInfo.prepay_money
            })
         }
      }
  }
  //客服
  contactService(){
  this.setState({showServiceModel : true,showFollowModel : false,offerRecordModel : false})
  }
  closeServiceModel(){
      this.setState({showServiceModel : false});
  }
  //复制单号
  copyBtn(express_sn) {
      Taro.setClipboardData({
         data: express_sn,
      });
  }
  //地址添加
  goToAdd(){
    Taro.navigateTo({url:'../addressList/index'})
  }
  //地址列表
  goToList(status){
    if(status > 0) return;
    Taro.navigateTo({url:'../addressList/index'})
  }
  //支付
  goToPay(){
      let {prepay_id,type,orderInfo} = this.state 
      if(type != ''&&orderInfo.address){
        if(type == 'mix'){
            let params = {
                type:type,
                money:orderInfo.mix_prepay_money.toFixed(2),
                address_id:orderInfo.address.id,
                prepay_id:prepay_id
            }
            this.payOrder(params);
        }else{
            let params = {
                type:type,
                money: orderInfo.prepay_money.toFixed(2),
                address_id:orderInfo.address.id,
                prepay_id:prepay_id
            }
            this.payOrder(params);
        }
      }else if(!orderInfo.address){
          Taro.showToast({icon:'none',title:'请选择收货地址'})
      } else{
        Taro.showToast({icon:'none',title:'请选择支付方式'})
      }
  }
  componentDidShow () { 
      const {id,prepay_id} = this.$router.params;
      if(prepay_id){
        this.getOrderDetail({prepay_id:prepay_id})
        //倒计时
        this.state.timer = setInterval(() => {
            this.setState( pre => {
                pre.orderInfo.countDown = countDown(pre.orderInfo.ctime,0)
            })
        }, 1000);
      }else{
        this.getDetail({id:id})
        //倒计时
        this.state.timer = setInterval(() => {
            this.setState( pre => {
                pre.orderInfo.countDown = countDown(pre.orderInfo.express_time,3)
            })
        }, 1000);
      }
     
      //获取客服微信号
      this.setState(pre => {
          pre.weixin = Taro.getStorageSync('weixin')
          pre.prepay_id = prepay_id
      })
      staticRecord()
  }
  //获支付订单详情
  getOrderDetail(params){
    orderDetail(params).then( res => {
        if(res.success){
            this.setState( pre => {
                pre.orderInfo = res;
                pre.isEnough = res.isEnough;
                pre.prepay_money = res.prepay_money;
                pre.orderInfo.address = Taro.getStorageSync('address') || res.address
            })
        }
    })
  }
  //单个订单详情
  getDetail(params){
    detail(params).then( res => {
        if(res.success){
            this.setState( pre => {
                pre.orderInfo = res;
            })
        }
    })
  }
  //订单支付
  payOrder(params){
    const {orderInfo} = this.state;
    order(params).then( res => {
        if(res.data.errcode == 0){
            if(params.type != 'wallet'){
                wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: res.data.data.signType,
                    paySign: res.data.data.paySign,
                    success(r) { 
                        //Taro.showToast({icon:'none',title:'支付成功'})
                        Taro.navigateTo({url:`./success/index?money=${formatMoney(orderInfo.prepay_money)}`})
                    },
                    fail(err) { 
                        Taro.showToast({icon:'none',title:'支付失败'})
                    }
                })
            }else{
                //Taro.showToast({icon:'none',title:'支付成功'})
                Taro.navigateTo({url:`./success/index?money=${formatMoney(orderInfo.prepay_money)}`})
            }
        }else{
            Taro.showToast({icon:'none',title:'支付失败'})
        }
    })
  }
  componentDidHide(){
    clearInterval(this.state.timer)
  }
  render () {
    const {showServiceModel,weixin,orderInfo,prepay_money} = this.state;
    const {status,address,order_list,wx_paid_money,money,order_number,ctime,pay_time,express_time,auto_accept_time,express_name,express_sn,countDown} = this.state.orderInfo
    const Good = order_list.map( item => {
          return (
            <View key="this" className="order-content">
                 <Image src={IMG_BASE + item.goods_cover_images}/>
                 <View className='order-info'>
                    <View>{item.goods_name}</View>
                    <View>成交价: ¥{item.deal_price}</View>
                    <View>服务费: ¥ {item.service_charge}</View>
                 </View>
             </View>
          )
      })
    const addressDetail =  address.province_name == address.city_name
        ?<View>{address.province_name+address.area_name+address.address}</View>
        :<View>{address.province_name+address.city_name+address.area_name+address.address}</View>
    return (
        <View className="page">
        <ScrollView className={`order-list ${getGlobalData('phoneModel')?'order-list-phone':''}`} scroll-y scroll-with-animation>
         { status == 0 && <View className="order-tip">请在结拍后7天内完成支付，否则保证金不予退还；<Text>{countDown.day}</Text>天 <Text>{countDown.hour}</Text>时 <Text>{countDown.minute}</Text>分 <Text>{countDown.second}</Text>秒</View>}
         <View className='order-paied'>
            { status ==1 && <View className='order-paied-send'>
                 <View>待发货</View>
                 <View>拍品正在等待出发</View>
            </View>}
            { status ==2 && <View className='order-paied-send'>
                 <View>已发货</View>
                 <View>自动确认收货时间 <Text>{countDown.day}</Text>天 <Text>{countDown.hour}</Text>时 <Text>{countDown.minute}</Text>分 <Text>{countDown.second}</Text>秒</View>
            </View>}
            { status == 3 && <View className='order-paied-send'>
                 <View>已收货</View>
                 <View>订单已完成</View>
            </View>}
            { status == 4 && <View className='order-paied-break'>
                 <View>已违约</View>
                 <View>拍品成交后，7日内未完成支付，保证金不予退换</View>
            </View>}
         </View>
         { address == null ?
            <View onClick={this.goToAdd} className="order-address-add">
                请新建收货地址
                <Image src={require('../../static/images/rightIcon.png')}/>
            </View> :
            <View onClick={this.goToList.bind(this,status)} className='order-address'>
                <View>收货人：{address.accept_man}
                   { status == 0 && <Image src={require('../../static/images/rightIcon.png')}/>}
                   <Text>{address.accept_phone}</Text>
                </View>
                {addressDetail}
            </View>
        }
         <View className="page-item">
             <Image className="address-line" src={require("../../static/images/dizhitiao.png")}/>
             {Good}
             <View className="order-price">合计：<Text>¥{orderInfo.total_fee}</Text></View>
             { status == 0 && <View className="order-price-pay">保证金已支付 ¥{orderInfo.total_bail + ' '} 尾款待支付<Text>￥{formatMoney(orderInfo.prepay_money)}</Text></View>}
             { status !=0 && <View className="order-price-status">保证金已支付<Text>¥{orderInfo.total_bail}</Text></View>}
             { money != '0' && status !=0 && <View className="order-price-status">钱包支付<Text>¥{money}</Text></View>}
             { wx_paid_money != '0' && status !=0 && <View className="order-price-status">微信支付<Text>¥{wx_paid_money}</Text></View>}
         </View>
         { status ==0 && <CheckboxGroup onChange={this.radioChange} className="pay-type">
             <View className="pay-method-wallet">
                 <Image src={require("../../static/images/qianbao.png")}/>
                 <View className="text">钱包支付 （余额￥{formatMoney(orderInfo.balance)}）</View>
                 <Checkbox value='wallet' color="#fbbb30" />
             </View>
             <View className='pay-method-wechat'>
                <View className="pay-method">
                    <Image src={require("../../static/images/weixin.png")}/>
                    <View className="text">微信支付</View>
                    <Checkbox value='weixin' color="#fbbb30" />
                </View>
                <View className="pay-method-outline">
                    <Image src={require("../../static/images/huikuan.png")}/>
                    <View className="text">汇款或其他方式支付</View>
                    <Text onClick={this.contactService}>联系客服</Text>
                </View>
             </View>
         </CheckboxGroup>}
         { status != 0 && <View className='order-block'>
            { status > 1 &&<View className='order-msg'>
                <View className='order-msg-title'>物流信息</View>
                <View>物流单号：{express_sn} <Text onClick={this.copyBtn.bind(this,express_sn)}>复制</Text></View>
                <View>物流公司名称：{express_name}</View>
            </View>}
            { status >0 && <View className='order-msg'>
                <View className='order-msg-title'>订单信息</View>
                <View>订单单号：{order_number}</View>
                <View>下单时间：{formatDate(ctime)}</View>
                <View>付款时间：{pay_time}</View>
                {status >1 &&<View>发货时间：{formatDate(express_time)}</View>}
                {status >2 &&<View>到货时间：{auto_accept_time}</View>}
            </View>}
         </View>}
        </ScrollView>
        <ServiceModel onCloseServiceModel={this.closeServiceModel} weixin={weixin} show={showServiceModel}></ServiceModel>
         <View className={`order-bottom ${getGlobalData('phoneModel')?'order-bottom-phone':''}`}>
             {  status == 0
                ?<View>
                    <View className='order-bottom-price'>还需支付 <Text>￥{ formatMoney(prepay_money)} </Text></View> 
                    <View className='order-bottom-pay' onClick={this.goToPay}>去支付</View>
                </View> 
                :<View onClick={this.contactService} className="order-bottom-contact">联系客服</View>   
             }
         </View>
       </View>
    )
  }
}

