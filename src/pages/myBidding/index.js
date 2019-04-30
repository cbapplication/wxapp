import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import LoadMore from "../../components/loadMore/index"
import './index.less'

import {auctionList} from '../../api/user'
import {strToTime} from '../../utils/funs'
import { staticRecord } from '../../api/index'

export default class browse extends Taro.Component {

  config = {
    navigationBarTitleText: '我的竞拍',
    enablePullDownRefresh: true, 
    backgroundTextStyle:"dark",
  }
  constructor (props) {
    super(props)
    this.state = {
      timer:null,
      items:[],//列表数据
      loadMore:true,//加载更多
      page:1,//页码
      hasFollow:false,//是否有数据
     }
  }
    //进入详情
    goToGoodsInfo(id){
      Taro.navigateTo({url:`../goodsInfo/index?id=${id}`})
    }
    //触底分页加载
    onReachBottom(){
      this.setState(pre => {
        pre.page++;
        pre.loadMore =true;
        this.AuctionList(pre.page,false)
      })
      
    }
    //下拉刷新
    onPullDownRefresh(){
      this.AuctionList(1,true)
      this.setState({page:1})
    }
    componentDidShow(){
      staticRecord()
    }
    componentWillMount () { 
      this.AuctionList(this.state.page,false);
      this.setState({loadMore:true});
      this.state.timer = setInterval(() => {
        this.setState( pre => {
           pre.items.map(item => {
             item.count_down = strToTime(item.start_time,item.expires_time).time
             //item.status = strToTime(1554279997032,1556287802032).status
           })
        })
     },1000)
    }
     /**
     * 获取关注拍品
     * @param {页码} page 
     * @param {是否刷新} refresh 
     */
    AuctionList(page,refresh){
      auctionList(page).then(res => {
        if(res.success){
         this.setState(pre => {
          pre.loadMore = false;
          pre.hasFollow = res.success
          Taro.stopPullDownRefresh()
          if(!refresh){
            pre.items = pre.items.concat(res.items);
          }else{
            pre.items = (res.items);
        }
       })
        } else{
          Taro.showToast({icon:'none',title:'获取数据失败'})
        }
      })
    }
    componentWillUnmount () { 
      clearInterval(this.state.timer)
    }
  render () {
    const {items,loadMore} = this.state;
    const bidList = items.map(item => {
            return  <View taroKey="this">
                      <View onClick={this.goToGoodsInfo.bind(this,item.id)} className="body-title">
                          <Image src={item.cover_image}/>
                          <View className="body-goodsInfo">
                              <View className="body-goodName">{item.name}</View>
                              <View className="body-goodPrice">
                                {'当前价 '}
                                <Text className={`common-status2`}>¥{item.price}</Text>
                              </View>
                              <View className="body-range">参考价: ¥{item.min_reference_price}～{item.max_reference_price}</View>
                              <View className="body-range">{item.count_down} 
                                { item.auction_is_first
                                  ?<Text className="text1">优先</Text>
                                  :<Text className="text2">被超</Text>
                                }
                              </View>
                          </View>
                      </View>
                    </View>
      })
    return (
      <View className="page">
      { items.length>0
        ?<ScrollView scroll-y scroll-with-animation>
           <View>
             {bidList}
           </View>
           <LoadMore loading={loadMore}></LoadMore>
        </ScrollView>
        :<View className="no-data">暂无竞拍</View>
      }
    </View>
    )
  }
}

