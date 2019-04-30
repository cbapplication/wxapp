import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, ScrollView, Input } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import {orderDetail} from '../../api/store'
import {IMG_BASE} from '../../utils/const'
import {countDown,formatDate} from '../../utils/funs'
import { staticRecord } from '../../api/index'

export default class StoreOrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer:null,
      orderDetail:{},//订单详情
      timer:null,//定时器ID
    }
  }
  config = {
    navigationBarTitleText: '订单详情',
  }
  //复制快递单号
  copyBtn(num) {
    Taro.setClipboardData({data: num});
  }
  goConfirm() {
    const {id} = this.$router.params
    Taro.navigateTo({
      url: `./confirm?id=${id}`,
    })
  }

  componentDidShow() {
    const {id} = this.$router.params
    this.OrderDetail(id)
    staticRecord()
  }
  OrderDetail(id){
    orderDetail(id).then( res => {
      if(res.success){
        this.setState( pre => {
           pre.orderDetail = res
        })
        if(res.status == 2){
           //倒计时
          this.state.timer = setInterval(() => {
              this.setState( pre => {
                  pre.orderDetail.countDown = countDown(pre.orderDetail.express_time,3)
              })
          }, 1000);
        }else if(res.status == 3){
           //倒计时
          this.state.timer = setInterval(() => {
              this.setState( pre => {
                  pre.orderDetail.countDown = countDown(pre.orderDetail.auto_accept_time,0)
              })
          }, 1000);
        }
      }
    })
  }

  componentDidHide() { 
    clearInterval(this.state.timer)
  }
  render() {
    const {orderDetail} = this.state;
    const {status,address,countDown} = this.state.orderDetail;
    return <View className='page'>
      <ScrollView className="order-list" scroll-y scroll-with-animation>
        <View className='order-paied'>
          { status == 2 && <View className='order-paied-send'>
            <View>已发货</View>
            <View>自动确认收货时间 <Text>{countDown.day}</Text>天 <Text>{countDown.hour}</Text>时 <Text>{countDown.minute}</Text>分 <Text>{countDown.second}</Text>秒</View>
          </View>}
          { status == 3 && <View className='order-paied-send'>
            <View>已收货</View>
            <View>结算时间 <Text>{countDown.day}</Text>天 <Text>{countDown.hour}</Text>时 <Text>{countDown.minute}</Text>分 <Text>{countDown.second}</Text>秒</View>
          </View>}
          { status == 5 && <View className='order-paied-send'>
            <View>已结算</View>
            <View>订单已完成</View>
          </View>}
          { status == 1 && <View className='order-paied-send'>
            <View>待发货</View>
            <View>买家已付款等待卖家发货</View>
          </View>}
          { status == 0 && <View className='order-paied-send'>
            <View>待支付</View>
            <View>拍品以成交等待买家付款</View>
          </View>}
          { status == 4 && <View className='order-paied-break'>
            <View>已违约</View>
            <View>拍品成交后，7日内未完成支付，保证金不予退换</View>
          </View>}
        </View>
        { status != 4 && <View className='personal-info'>
          <View className='clearfix'>
            <View className='name fl'>收货人：{address.accept_man}</View>
            <View className='tel fr'>{address.accept_phone}</View>
          </View>
          <View className='address'>
             {
               address.province_name == address.city_name
               ?<View>{address.province_name+address.area_name+address.address}</View>
               :<View>{address.province_name+address.city_name+address.area_name+address.address}</View>
             }
          </View>
        </View>}
        <Image className="address-line" src={require('../../static/images/dizhitiao.png')} />
        <View className="page-item">
          <View className="order-content">
            <Image src={IMG_BASE+orderDetail.cover_image}/>
            <View className='order-info'>
              <View>{orderDetail.goods_name}</View>
              <View>成交价: ¥{orderDetail.deal_price}</View>
              <View>佣金: ¥ {orderDetail.commissions}</View>
            </View>
          </View>
          <View className="order-price">待结算金额：<text>¥{orderDetail.settle_accounts}</text></View>
        </View>
        <View className='order-block'>
            <View className='order-msg'>
                <View className='order-msg-title'>用户信息</View>
                <View>用户昵称</View>
                <View>{orderDetail.user_nickname}</View>
            </View>
            <View className='order-msg'>
                <View className='order-msg-title'>订单信息</View>
                <View>订单单号：{orderDetail.order_number}</View>
                <View>拍中时间：{orderDetail.ctime}</View>
                {status >0 && status !=4 &&<View>付款时间：{orderDetail.pay_time}</View>}
                {status >1 && status!=4 &&<View>发货时间：{formatDate(orderDetail.express_time)}</View>}
                {status >2 && status!=4 &&<View>到货时间：{formatDate(orderDetail.auto_accept_time)}</View>}
                {status == 4 &&<View>违约时间：{orderDetail.break_time}</View>}
                {status == 5 &&<View>结算时间：{orderDetail.settle_time}</View>}
            </View>
            { status > 1 && status != 4 &&<View className='order-msg'>
                <View className='order-msg-title'>物流信息</View>
                <View>物流单号：{orderDetail.express_sn} <Text onClick={this.copyBtn.bind(this,orderDetail.express_sn)}>复制</Text></View>
                <View>物流公司名称：{orderDetail.express_name}</View>
            </View>}
         </View>
      </ScrollView>
      { status == 1 && <View class={`order-bottom ${getGlobalData('phoneModel')?'order-bottom-phone':''}`} onClick={this.goConfirm}>
        <View >发货</View>
      </View>}
    </View>
  }
}