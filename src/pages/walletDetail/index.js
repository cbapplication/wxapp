import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView,Progress } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import {myWalletRecord} from '../../api/user'
import './index.less'
import { staticRecord } from '../../api/index'

export default class walletDetail extends Taro.Component {

  config = {
    navigationBarTitleText: '我的钱包',
    enablePullDownRefresh: true, 
    backgroundTextStyle:"dark",
  }
  constructor (props) {
    super(props)
    this.state = {
        date:'',
        time:'',
        total_expense:'0.00',//支出
        total_income:'0.00',//收入
        items:[],//订单数组
        hasList:false,//是否有数据
        page:1,//页码
     }
  }
  goToAccount(id){
      Taro.navigateTo({url:`../accountDetail/index?id=${id}`})
  }
  bindDateChange(e) {
    this.setState(pre => {
      pre.date = e.detail.value.replace("-","年")+'月'
      pre.time =  new Date(e.detail.value.replace("-","/")+'/01').getTime()/1000;
      this.MyWalletRecord(1,pre.time,true);
    })
  }
  //下拉刷新
  onPullDownRefresh(){
    let {time} = this.state;
    this.MyWalletRecord(1,time,true);
    this.setState({page:1})
  }
  //触底刷新
  onReachBottom(){
    let {time} = this.state;
    Taro.showLoading()
    this.setState( pre => {
      pre.page++;
      this.MyWalletRecord(pre.page,time,false)
    })
  }
  componentWillMount () {
    let {time} = this.state;
    //默认获取当前年月
    let now = new Date();
    this.setState ( pre => {
      pre.date = now.getFullYear() + '年' + (now.getMonth()+1) + '月';
      pre.time = new Date(now.getFullYear()+'/'+(now.getMonth()+1)).getTime()/1000;
    })
    this.MyWalletRecord(1,time,true)
  }
  componentDidShow(){
    staticRecord()
  }
  
  //获取钱包明细
  MyWalletRecord(page,time,refresh){
    myWalletRecord(page,time).then( res => {
        Taro.hideLoading()
        Taro.stopPullDownRefresh()
        if(res.success){
          this.setState(pre => {
            pre.hasList = res.success
            
            if(!refresh){
              pre.items = pre.items.concat(res.items);
            }else{
              pre.items = (res.items);
              pre.total_expense = res.total_expense;
              pre.total_income = res.total_income
          }
         })
        }else{
          Taro.showToast({icon:'none',title:'获取数据失败'})

        }
    })
  }
  render () {
    let {date,hasList,items,total_expense,total_income} = this.state;
    let listItems = items.map((item) => {
        return (
            <View key="this" onClick={this.goToAccount.bind(this,item.id)} className='details'>
                <View className='detail'>
                <View className='detail-left'>
                    <View className='name'>{item.reason_map[item.reason]}</View>
                    <View className='time'>{item.ctime}</View>
                </View>
                <Image src={require('../../static/images/rightIcon.png')}/>
                <View className='detail-right'>
                    {item.reason == 3 && <View className='money'>-￥{item.money}</View>}
                    {item.reason == 0 && <View className='money-no-status'>—￥{item.money}</View>}
                    {item.reason == 4 && <View className='money-no-status'>-￥{item.money}</View>}
                    {item.reason == 1 && <View className='money-no-status'>-￥{item.money}</View>}
                    {item.reason == 2 && <View className='money1'>+￥{item.money}</View>}
                    {item.reason == 5 && <View className='money1'>+￥{item.money}</View>}
                    {item.reason == 3 && <View className='status'>{item.status_map[item.status]}</View>}
                </View>
                </View>
            </View>
        )
    })
    return (
        <View className="page">
            <View className="page-head">
               <View className='page-head-left'>
               <Picker
                    mode="date"
                    value={date}
                    start="2018-01"
                    end="2118-01"
                    onChange={this.bindDateChange}
                    fields="month"
                    >
                    <View className="picker">
                     {date}
                    </View>
                </Picker>
                   <Image src={require("../../static/images/sousuoxiala.png")}/>
               </View>
               <View className='page-head-right'>
                   <View>支出 ¥{total_expense}</View>
                   <View>收入 ¥{total_income}</View>
               </View>
            </View>
            <ScrollView className='wallet-magin' scroll-y scroll-with-animation>
                { hasList
                   ?listItems
                   :<View className='no-data'>暂无钱包记录</View>
                }
            </ScrollView>
        </View>
    )
  }
}

