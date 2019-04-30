import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import LoadMore from "../../components/loadMore/index"
import './index.less'

import { getFocusGoods } from "../../api/user"
import { focusOrDiscard } from '../../api/goods'
import { strToTime } from '../../utils/funs'
import { staticRecord } from '../../api/index'

export default class home extends Taro.Component {

  config = {
    navigationBarTitleText: '关注拍品',
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
    usingComponents: {
      'swipeout': '../../components/base/swipeout/index' // 书写第三方组件的相对路径
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      actions: [
        {
          name: "删除",
          color: "#fff",
          width: 100,
          height: 100,
          background: "#FA3E3E",
          background: "#ffc233",
          color: 'black'
        }
      ],
      items: [],//列表数据
      loadMore: true,//加载更多
      page: 1,//页码
      hasFollow: false,//是否有关注
    }
  }
  goToGoodsInfo(id) {
    Taro.navigateTo({ url: `../goodsInfo/index?id=${id}` })
  }
  delete(e) {
    const { id } = e.currentTarget.dataset
    this.FocusOrDiscard(id)
  }
  //触底分页加载
  onReachBottom() {
    this.setState(pre => {
      pre.page++;
      pre.loadMore = true;
      this.GetFocusGoods(pre.page, false)
    })
  }
  //下拉刷新
  onPullDownRefresh() {
    this.GetFocusGoods(1, true);
    this.setState({ page: 1 })
  }
  componentDidShow() {
    staticRecord()
  }
  componentWillMount() {
    this.GetFocusGoods(this.state.page, false);
    this.setState({ loadMore: true })
    this.state.timer = setInterval(() => {
      this.setState(pre => {
        pre.items.map(item => {
          item.count_down = strToTime(item.start_time, item.expires_time).time
          //item.status = strToTime(1554279997032,1556287802032).status
        })
      })
    }, 1000)
  }
  //关注取消
  FocusOrDiscard(id) {
    focusOrDiscard(id).then(res => {
      if (res.success) {
        this.GetFocusGoods(1, true);
      }
    })
  }
  /**
   * 获取关注拍品
   * @param {页码} page 
   * @param {是否刷新} refresh  
   */
  GetFocusGoods(page, refresh) {
    getFocusGoods(page).then(res => {
      if (res.success) {
        this.setState(pre => {
          pre.loadMore = false;
          pre.hasFollow = res.success;
          Taro.stopPullDownRefresh()
          if (!refresh) {
            pre.items = pre.items.concat(res.items);
          } else {
            pre.items = (res.items);
          }
        })
      } else {
        Taro.showToast({ icon: 'none', title: '获取数据失败' })
      }
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
  render() {
    const { actions, items, hasFollow, loadMore } = this.state;
    const follow = items.map((item, index) => {
      return (
        <swipeout key={index} onChange={this.delete} data-index={item.index} data-id={item.id} i-className="follow-swiper" actions={actions}>
          <View slot="content">
            <View onClick={this.goToGoodsInfo.bind(this, item.id)} className="body-title">
              <Image src={item.cover_image}/>
              <View className="body-goodsInfo">
                <View className="body-goodName">{item.name}</View>
                <View className="body-goodPrice">
                  {item.status == 1 ? '起拍价 ' : '当前价 '}
                  <Text className={`common-status${item.status}`}>¥{item.status == 1 ? item.start_price : item.price}</Text>
                </View>
                <View className="body-range">参考价: ¥{item.min_reference_price}～{item.max_reference_price}</View>
                <View className="body-range">{item.count_down}
                  <Text className={`status common-bg-status${item.status}`}>{item.status_map[item.status]}</Text>
                </View>
              </View>
            </View>
          </View>
        </swipeout>
      )
    })
    return (
      <View className="page">
        {items.length > 0
          ? <ScrollView scroll-y scroll-with-animation>
            {follow}
            <LoadMore loading={loadMore}></LoadMore>
          </ScrollView>

          : <View className="no-data">暂无关注</View>
        }
      </View>
    )
  }
}

