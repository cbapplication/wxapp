import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Block } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import setPic from '../../static/images/set.png'
import likePic from '../../static/images/like.png'
import unlikePic from '../../static/images/unlike.png'
import { IMG_BASE } from '../../utils/const'
import store from '../../api/store'
import { getCenter } from '../../api/user'
import { staticRecord } from '../../api/index'

import { formatMoney, clock, mtLog } from '../../utils/funs'
export default class SellerHomepage extends Taro.Component {

  config = {
    navigationBarBackgroundColor: '#ffc233',
  }
  constructor(props) {
    super(props)
    this.state = {
      source: false,//进入者是否该店铺主人
      ownerInfo: {},
      storeInfo: {},
      storeId: '',
      iconSrc: '',
      goodList: [],
      page: 1,
      isLeave: false//是否离开当前页
    }
  }
  goStoreInfo() {
    let { source } = this.state
    if (source) {
      Taro.navigateTo({
        url: '../storeInfo/index'
      })
    } else {
      let param = {
        store_id: this.state.storeId
      }
      store.focusOrDiscard(param).then(
        res => {
          if (res.is_focus == 1) {
            this.setState({
              iconSrc: likePic
            })
          } else {
            this.setState({
              iconSrc: unlikePic
            })
          }
        }
      )
    }
  }
  goToGoodsInfo(id) {
    console.log(id)
    Taro.navigateTo({
      url: `../goodsInfo/index?id=${id}`
    })
    let param = {
      action: 'wd_dianpupaipin click',
      action_desc: '点击店铺拍品'
    }
    mtLog(param)
  }
  goUploadGoods() {
    Taro.navigateTo({
      url: '../uploadGoods/index'
    })
  }
  //设置店铺来源
  setSource(id) {
    getCenter().then(res => {
      if (res.success) {
        setGlobalData('storeId', res.store_id)
        if (id) {
          this.setState({
            source: id == res.store_id
          })
        } else {
          this.setState({
            source: true
          })
        }
        let param = {
          id: id || res.store_id
        }
        this.getStoreInfo(param)
      } else {
        Taro.showToast({ icon: 'none', title: '获取数据失败' })
      }
    })
  }
  //获取店主信息
  getStoreOwner(param) {
    store.getStoreOwner(param).then(
      (res) => {
        this.setState(pre => {
          pre.ownerInfo = res
        })
      }
    )
  }
  //获取店铺信息
  getStoreInfo(param) {
    store.getStoreInfo(param).then(
      (res) => {
        this.setState(pre => {
          pre.storeInfo = res
          pre.iconSrc = pre.source ? setPic : (res.is_focus ? likePic : unlikePic)
          console.log(res)
          wx.setNavigationBarTitle({
            title: res.name 
          })
        })
        Taro.setNavigationBarTitle({
          title: res.name
        })
      }
    )
  }
  //店铺拍品列表
  getGoodList(param) {
    store.getGoodList(param).then(
      (res) => {
        this.setState(pre => {
          if (pre.isLeave) {
            pre.goodList = res.data
          } else {
            pre.goodList = pre.goodList.concat(res.data)
          }
          pre.isLeave = false
        })
      }
    )
  }
  componentWillMount() {
    let { id } = this.$router.params
    this.setState({
      storeId: id
    })
  }
  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() {
    let { storeId } = this.state
    let token=Taro.getStorageSync("token")
    let param = {
      id: storeId
    }
    let listParam = {
      id: storeId,
      page: 1
    }
    this.setState({
      page: 1
    })
    //游客模式不调用center接口，不做来源对比
    if(token){
      this.setSource(storeId)
    }else{
      this.getStoreInfo(param)
    }
    this.getStoreOwner(param)
    this.getStoreInfo(param)
    this.getGoodList(listParam)
    staticRecord()
  }
  //触底刷新
  onReachBottom() {
    this.setState(pre => {
      let param = {
        id: pre.storeId,
        page: ++pre.page
      }
      this.getGoodList(param)
    })
  }
  componentDidHide() {
    this.setState({
      isLeave: true
    })
  }

  render() {
    const { source, storeInfo, goodList, iconSrc } = this.state
    const list = goodList.map((item) => {
      return (
        <View className='good' onClick={this.goToGoodsInfo.bind(this, item.id)} key='this'>
          <View className='block'>
            <Image src={IMG_BASE + item.cover_image} mode='' lazy-load={true}></Image>
            <View className='block-bottom'>
              <View className='name'>{item.name}</View>
              <View className='price'><Text className='Text'>当前价：</Text>¥{formatMoney(item.price)}</View>
              <View className='time'>
                <Image src={require('../../static/images/time.png')}></Image><Text>{clock(item.start_time, item.expires_time)}</Text>
                {item.status == 2 ?
                  <Image className='marginL' src={require('../../static/images/chujia.png')} />
                  :
                  <Image className='marginL' src={require('../../static/images/guanzhu.png')} />
                }
                <Text>{item.status == 2 ? item.auction_times : item.focus_times}</Text>
                {item.store_id == 0 && <Text className='self-support'>自营</Text>}
              </View>
            </View>
          </View>
        </View>
      )
    })
    const btmBtn = source && <View className={`order-bottom ${getGlobalData('phoneModel') ? 'bottom-phone' : ''}`} onClick={this.goUploadGoods}>
      <View>上传拍品</View>
    </View>
    return (
      <View className='page' >
        <View className='head'>
          <View className='head-info'>
            <Image src={IMG_BASE + storeInfo.avatar} mode='aspectFill'></Image>
            <View className='store-info yCenter'>
              <View className='store-name'>{storeInfo.name}</View>
              <View className='info-list'>
                <View className='level item'>店铺等级 <Text className='yCenter'>v{storeInfo.level}</Text>
                </View>
                <View className='item'>成交 {storeInfo.done_count}</View>
                <View className='item'>在售 {storeInfo.selling_count}</View>
              </View>
            </View>
          </View>
          <View className='head-introduce'>{storeInfo.description}</View>
          <Image className='set-icon' src={iconSrc} onClick={this.goStoreInfo}></Image>
        </View>
        <View className={`content ${source ? 'bottom-phone1' : ''}`}>
          {goodList.length > 0 ? list
            : <View className='no-data'>{source ? '请上传你的拍品' : '店铺主⼈很懒，还未上传拍品'}</View>
          }
        </View>
        {btmBtn}
      </View>
    )
  }
}

