import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView,CheckboxGroup,Checkbox } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import LoadMore from "../../components/loadMore/index"
import './index.less'
import { staticRecord } from '../../api/index'

import {orderList} from "../../api/store"
import {IMG_BASE} from '../../utils/const'
export default class store extends Taro.Component {

  config = {
    navigationBarTitleText: '店铺订单',
    enablePullDownRefresh: true, 
    backgroundTextStyle:"dark",
  }
  constructor (props) {
    super(props)
    this.state = {
        items:[],//订单数组
        hasList:false,//是否有数据
        loadMore:true,//加载
        page:1,//页码
        menu:[
          {id:'',text:'全部'},
          {id:1,text:'待发货'},
          {id:2,text:'已发货'},
          {id:3,text:'已收货'},
          {id:5,text:'已结算'},
        ],
        tabId:'',//ID
        status:'',//订单状态
     }
  }
  //菜单切换
  switchTab(id){
    this.setState( pre =>{
      pre.tabId = id;
      pre.status = id;
      pre.page = 1;
      let params = {
        status:id,
        page:1
      }
      this.getOrderList(params,true)
    })
  }
  goToDetail(id){
    Taro.navigateTo({url:`../storeOrderDetail/index?id=${id}`})
  }
  componentDidShow () { 
    let {status,page} = this.state;
    let params = {
       status:status,
       page:page
    }
    this.getOrderList(params,true)
    staticRecord()
  }
  //下拉刷新
  onPullDownRefresh(){
    let {status} = this.state;
    let params = {
       status:status,
       page:1
    }
    this.getOrderList(params,true);
    this.setState({page:1})
  }
  //触底刷新
  onReachBottom(){
    let {status} = this.state;
    this.setState( pre => {
      pre.page++;
      pre.loadMore =true;
      let params = {
        status:status,
        page:pre.page
     }
      this.getOrderList(params,false)
    })
  }
  //获取订单列表
  getOrderList(params,refresh){
    orderList(params).then( res => {
        if(res.success){
          this.setState(pre => {
            pre.loadMore = false;
            pre.hasList = res.hasData
            Taro.stopPullDownRefresh()
            if(!refresh){
              pre.items = pre.items.concat(res.items);
            }else{
              pre.items = (res.items);
          }
         })
        }else{
          Taro.showToast({icon:'none',title:'获取数据失败'})
        }
    })
  }
  render () {
    let {menu,items,loadMore,hasList} = this.state;
    const menuList = menu.map( item => {
      return (
         <View><Text key='this' className={item.id == tabId?'active':''} onClick={this.switchTab.bind(this,item.id)}>{item.text}</Text></View>
      )
    })
    const List = items.map(item => {
          return (
            <View onClick={this.goToDetail.bind(this,item.id,)} key="this" className="page-item">
                <View className="order-radio">
                    <Text className='text-1'>{item.ctime}</Text>
                    <Text>{item.status_map[item.status]}</Text>
                </View>
                <View className="order-content">
                    <Image src={item.cover_image}/>
                    <View className='order-info'>
                        <View>{item.goods_name}</View>
                        <View>成交价: ¥{item.deal_price}</View>
                        <View>佣金: ¥ {item.commissions}</View>
                    </View>
                </View>
                <View className="order-price">待结算的金额：<Text>¥{item.settle_accounts}</Text></View>
            </View>
          )
      })
    return (
        <View className="page">
            <View className='order-menu'>
                 {menuList}
            </View>
            {hasList ?
              <View>
                <ScrollView className={`order-list`} scroll-y scroll-with-animation>
                {List}
                <LoadMore loading={loadMore}></LoadMore>
                </ScrollView>
              </View>
              :<View className="no-data">暂无订单</View>
            }
        </View> 
    )
  }
}

