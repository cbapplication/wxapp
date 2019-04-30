import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import LoadMore from "../../components/loadMore/index"
import './index.less'
import { getAddress, delAddress } from '../../api/user'
import { staticRecord } from '../../api/index'
import { AST_Debugger } from 'terser';

//import {} from "../../api/test"
export default class home extends Taro.Component {

  config = {
    navigationBarTitleText: '地址列表',
    usingComponents: {
      'swipeout': '../../components/base/swipeout/index' // 书写第三方组件的相对路径
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      actions: [
        {
          name: "删除",
          color: "#fff",
          width: 100,
          height: 100,
          background: "#ffc233",
          color: 'black'
        }
      ],
      addressList: [],
    }
  }

  componentWillMount() {
  }
  goToAdd() {
    let param = {
      isEdit: false
    }
    wx.navigateTo({ url: `../addressEdit/index?editAddress=${JSON.stringify(param)}` })
  }
  goToEdit(item,e) {
    e.stopPropagation()
    let region = []
    let code = []
    code.push(item.province_id)
    code.push(item.city_id)
    code.push(item.area_id)
    region.push(item.province_name)
    region.push(item.city_name)
    region.push(item.area_name)
    item.region = region
    item.code = code
    let param = {
      isEdit: true,
      curData: item
    }
    wx.navigateTo({ url: `../addressEdit/index?editAddress=${JSON.stringify(param)}` })
  }
  delete(id) {
    let param = {
      id: id
    }
    delAddress(param).then(
      res => {
        if (res.success) {
          this.getAddress()
        }
      }
    )
  }
  getAddress() {
    getAddress().then(
      res => {
        if (res.success) {
          this.setState({
            addressList: res.data || []
          })
        }
      }
    )
  }
  //选择地址
  chooseAddress(address,e){
    e.preventDefault();
    Taro.setStorageSync('address',address)
    Taro.navigateBack()
  }
  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() {
    staticRecord()
    this.getAddress()
  }

  componentDidHide() { }

  render() {
    const { actions, addressList } = this.state
    const Swiper = addressList.map((item, index) => {
      return (
        <swipeout key={index} onChange={this.delete.bind(this, item.id)} data-index={index} i-className="address-swiper" actions={actions}>
          <View onClick={chooseAddress.bind(this,item)} className="i-swipeout-item" slot="content">
            <View className="address-item address-content">
              <View className="address-username">{item.accept_man}<Text className='phone'>{item.accept_phone}</Text>{ item.is_default == 1 &&<Text className='default'>默认</Text>}</View>
              <View className="address-address">{item.province_name}{item.city_name}{item.area_name}{item.address}</View>
            </View>
            <View onClick={this.goToEdit.bind(this, item)} className="address-item address-edit"><Text>编辑</Text></View>
          </View>
        </swipeout>
      )
    })
    return (
      <View className="page">
        <ScrollView scroll-y scroll-with-animation className={`address-list ${getGlobalData('phoneModel') ? 'address-list-phone' : ''}`}>
          { addressList.length > 0
            ?Swiper
            :<View className='no-data'>暂无收货地址</View>
          }
        </ScrollView>
        <View className={`address-bottom ${getGlobalData('phoneModel') ? 'address-bottom-phone' : ''}`}>
          <View onClick={this.goToAdd}>新增地址</View>
        </View>
      </View>
    )
  }
}

