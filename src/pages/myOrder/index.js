import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, CheckboxGroup, Checkbox } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import LoadMore from "../../components/loadMore/index"
import './index.less'

import { orderList } from "../../api/user"
import { prePay } from '../../api/order'
import { staticRecord } from '../../api/index'
import { IMG_BASE } from '../../utils/const'
export default class home extends Taro.Component {

  config = {
    navigationBarTitleText: '我的订单',
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  }
  constructor(props) {
    super(props)
    this.state = {
      items: [],//订单数组
      hasList: false,//是否有数据
      loadMore: true,//加载
      page: 1,//页码
      isChecked: false,//是否选中订单
      orderIds: [],//订单ID数组
    }
  }
  radioChange(e) {
    const { value } = e.detail;
    if (value.length > 0) {
      this.setState(pre => {
        pre.isChecked = true;
        pre.orderIds = value;
      })
    } else {
      this.setState(pre => {
        pre.isChecked = false;
      })
    }
  }
  prevent(e) {
    e.stopPropagation();
  }
  goToDetail(id, status) {
    if (status == 0) {
      this.PrePay({ order_ids: [id] })
    } else {
      Taro.navigateTo({ url: `../myOrderDetail/index?id=${id}` })
    }
  }
  goToPay() {
    let { orderIds } = this.state;
    this.PrePay({ order_ids: orderIds })
  }
  componentDidShow() {
    this.getOrderList(1, true)
    this.setState({ page:1})
    staticRecord()
  }
  //下拉刷新
  onPullDownRefresh() {
    this.getOrderList(1, true);
    this.setState({ page: 1 })
  }
  //触底刷新
  onReachBottom() {
    this.setState(pre => {
      pre.page++;
      pre.loadMore = true;
      this.getOrderList(pre.page, false)
    })
  }
  //获取订单列表
  getOrderList(page,refresh){
    orderList(page).then( res => {
        if(res.success){
          this.setState(pre => {
            pre.loadMore = false;
            pre.hasList = res.success
            Taro.stopPullDownRefresh()
            if(!refresh){
              pre.items = pre.items.concat(res.items);
            }else{
              pre.items = (res.items);
          }
        })
      } else {
        Taro.showToast({ icon: 'none', title: '获取数据失败' })
      }
    })
  }
  //生成预支付订单
  PrePay(params) {
    prePay(params).then(res => {
      if (res.success) {
        Taro.navigateTo({ url: `../myOrderDetail/index?prepay_id=${res.prepay_id}` })
      }
    })
  }
  render() {
    let { items, loadMore, hasList, isChecked } = this.state;
    const List = items.map(item => {
      return (
        <View onClick={this.goToDetail.bind(this, item.id, item.status)} key="this" className="page-item">
          <View className="order-radio">
            {item.status == 0 && <Checkbox onClick={this.prevent} checked={false} value={Number(item.id)} color="#fbbb30" />}
            <Text className='text-1'>{item.ctime}</Text>
            <Text>{item.status_map[item.status]}</Text>
          </View>
          <View className="order-content">
            <Image src={IMG_BASE + item.cover_images} />
            <View className='order-info'>
              <View>{item.goods_name}</View>
              <View>成交价: ¥{item.deal_price}</View>
              <View>服务费: ¥ {item.service_charge}</View>
            </View>
          </View>
          <View className="order-price">合计：<Text>¥{item.total_price}</Text></View>
        </View>
      )
    })
    return (
      <View className="page">
        {items.length>0 ?
          <View>
            <ScrollView className={`order-list ${getGlobalData('phoneModel') ? 'order-list-phone' : ''}`} scroll-y scroll-with-animation>
              <CheckboxGroup onChange={this.radioChange}>{List}</CheckboxGroup>
              <LoadMore loading={loadMore}></LoadMore>
            </ScrollView>
            <View className={`${isChecked ? 'order-bottom' : 'hidden'} ${getGlobalData('phoneModel') ? 'order-bottom-phone' : ''}`}>
              <View onClick={this.goToPay}>去支付</View>
            </View>
          </View>
          : <View className="no-data">暂无订单</View>
        }
      </View>
    )
  }
}

