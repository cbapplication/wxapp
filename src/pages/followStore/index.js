import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import LoadMore from "../../components/loadMore/index"
import './index.less'
import { staticRecord } from '../../api/index'

import { getFocusStore } from '../../api/user'
export default class order extends Taro.Component {

  config = {
    navigationBarTitleText: '关注店铺',
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  }
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      items: [],//列表数据
      loadMore: true,//加载更多
      page: 1,//页码
      hasFollow: false,//是否有关注
    }
  }
  //进入店铺
  goToStore(id) {
    Taro.navigateTo({ url: `../sellerHomepage/index?id=${id}` })
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
    this.GetFocusStore(1, true);
    this.setState({ page: 1 })
  }
  componentDidShow() {
    staticRecord()
  }
  componentWillMount() {
    this.GetFocusStore(this.state.page, false);
    this.setState({ loadMore: true })
  }
  /**
   * 获取关注拍品
   * @param {页码} page 
   * @param {是否刷新} refresh 
   */
  GetFocusStore(page, refresh) {
    getFocusStore(page).then(res => {
      if (res.success) {
        this.setState(pre => {
          pre.loadMore = false;
          pre.hasFollow = res.success
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
    let { loadMore, items } = this.state;
    const follow = items.map((item) => {
      return (
        <View key="this" onClick={this.goToStore.bind(this, item.id)} className="page-item">
          <View className="page-name">
            <Image src={item.avatar} />
            <Text>{item.name}</Text>
          </View>
          <View className="page-info">
            <Text>{item.selling_goods_count}件拍品在售</Text>
            {item.recommend_goods_img.map((item) => {
              return (
                <Image key="this" />
              )
            })}
          </View>
        </View>
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

