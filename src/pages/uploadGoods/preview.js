import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import rightIcon from '../../static/images/rightIcon.png'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './preview.less'
import { tip, scale, strToTime } from '../../utils/funs'
import { judgeId } from '../../api/user'
import { getStoreInfo } from '../../api/store'
import { staticRecord } from '../../api/index'


export default class IdSend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      preData: {},//上个界面数据
      storeInfo: {},//店铺信息
      current: 0,//轮播图index
    }
  }
  config = {
    navigationBarTitleText: '拍品详情',
  }
  swiperImg(e) {
    this.setState(pre => {
      pre.current = e.detail.current;
    })
  }
  goUploadGoods() {
    Taro.navigateBack({
      delta: 1
    })
  }
  componentWillMount() {
    debugger
    let path = this.$router.params.path
    let page = Taro.getCurrentPages()
    let prePage = page[page.length - 2]
    console.log(prePage.data, '上个页面')
    this.setState({
      preData: prePage.data || {},
      path: path
    })
    getStoreInfo({ id: getGlobalData('storeId') }).then(
      res => {
        this.setState({
          storeInfo: res
        })
      }
    )
  }

  componentDidShow() {
    staticRecord()
   }

  componentDidHide() { }
  render() {
    let { path } = this.state
    let _preData = {}
    if (this.state.preData) {
      _preData = this.state.preData
    }
    const swiperPic = _preData.swiperPic || ''
    const descPic = _preData.descPic || ''
    const startTime = _preData.startTime || ''
    const endTime = _preData.endTime || ''
    const inputData = _preData.inputData || {}
    const storeInfo = _preData.storeInfo || {}
    // let { swiperPic, descPic, startTime, endTime, inputData, storeInfo } = this.state.preData
    let cur = startTime.replace(/-/g, '/')
    let end = endTime.replace(/-/g, '/')
    let curString = new Date(cur).getTime()
    let endString = new Date(end).getTime()
    const endStr = strToTime(curString/1000, endString/1000)
    const imgItem = swiperPic.map((item, index) => {
      return <swiper-item key={item}>
        <Image src={item} />
      </swiper-item>
    })
    const descImg = descPic.map((item, index) => {
      return (
        <Image className='desc-img' src={item} key={item} mode='widthFix' />
      )
    })
    return (
      <View className="page">
        <ScrollView scroll-y scroll-with-animation>
          <View className="page-head">
            <Swiper className="swiper"
              autoplay={true}
              duration='1000'
              onChange={this.swiperImg}
            >
              {imgItem}
            </Swiper>
            <View className="index">{(current + 1) + '/' + swiperPic.length}</View>
            <View className="body-status">
              <Text className='status common-bg-status'>预展中</Text>
              <Text className="time">{endStr.time}</Text>
            </View>
            <View className="goods-info">
              <View className="goods-name">
                <View className="name">{inputData.goodsName}</View>
                <View className="share">
                  <Image src={require('../../static/images/share_yuzhan.png')} />
                  <View>分享</View>
                </View>
              </View>
              <View className="curPrice">当前价:￥{inputData.startPrice} <Text className={`common-status`}></Text></View>
              <View className="flex">
                <View>参考价：¥{inputData.referStart}～{inputData.referEnd}</View>
                <View>图录号</View>
              </View>
              <View className="flex marginL">
                <View>保证金：¥ {inputData.startPrice <= 1000 ? 100 : Math.floor(inputData.startPrice / 10)}</View>
                <View>加价幅度：¥ {scale(inputData.startPrice)}</View>
              </View>
            </View>
          </View>
          <View className="introduce">店铺介绍</View>
          <View className="store">
            <Image className="image" src={`http://pp0af5pha.bkt.clouddn.com/` + storeInfo.avatar} />
            <View className="detail">
              <View className="name">{storeInfo.name}</View>
              <View className="number">已成交：{storeInfo.done_count}件 在售：{storeInfo.selling_count}件</View>
            </View>
            <View className="goStore">进入店铺
                <Image src={rightIcon} />
            </View>
          </View>
          <View className="introduce">拍品详情</View>
          <View className="goods-info-desc">
            <View>{inputData.desc}</View>
          </View>
          {descImg}
          <View className="introduce">帮助中心</View>
          <View className="role">
            加价幅度
            <Image src={rightIcon} />
          </View>
          <View className="role">
            保证金规则
            <Image src={rightIcon} />
          </View>
          <View className="margin-bottom"></View>
        </ScrollView>
        <View className='order-bottom' onClick={this.goUploadGoods}>
          <View>{path == 1 ? '编辑拍品' : '关闭预览'}</View>
        </View>
      </View>
    )
  }
}