import Taro from '@tarojs/taro'
import { View,Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.css'
import closeIcom from "../../static/images/rightIcon.png"
import {formatMoney,mtLog} from '../../utils/funs'
import {IMG_BASE} from '../../utils/const'
export default class recordModel extends Taro.Component {
    static defaultProps ={
        show : false,
        auctionHistory:[]
    }
    state = {
        
    }
    close(){
        this.props.onCloseOfferRecordModel()
    }
  render () {
    const auctionHistory = this.props.auctionHistory || []
    const show = this.props.show
    const goodsInfo = this.props.goodsInfo || {}
    const listItem = auctionHistory.map( item => {
            return <View className="model-record" key="this">
                        <View className="model-left">¥{item.money}</View>
                        <View className="model-right">
                            <View>{item.user.nickname}</View>
                            <View>{item.ctimes}</View>
                        </View>
                    </View>
        })
    return (
        <View className="page">
        <View onClick={this.close} className={show?'box':''} catchtouchmove="preventD"></View>
        <View className={`model ${show?'':'hidden'} ${getGlobalData('phoneModel')?'model-phone-offer':''}`} catchtouchmove="preventD">
             <View onClick={this.close} className="model-close">
                 <Image src={closeIcom}/>
             </View>
             <View className="model-title">
             <Image src={IMG_BASE+goodsInfo.cover_images[0]}/>
             <View className="model-goodsInfo">
                 <View className="model-goodName">{goodsInfo.name}</View>
                 <View className="model-goodPrice">当前价：<Text>￥{formatMoney(goodsInfo.price)}</Text></View>
                 <View className="model-range">起拍价:￥{goodsInfo.start_price}</View>
                 <View className="model-range">{goodsInfo.count_down} </View>
             </View>
            </View>
            <ScrollView className="scroll" scroll-y scroll-with-animation>
                { auctionHistory.length > 0
                 ? listItem
                 : <View className='noMore'>暂无出价记录</View>
                }
            </ScrollView>
        </View>
    </View>
    )
  }
}