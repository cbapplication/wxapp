import Taro from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.css'
import closeIcom from "../../static/images/rightIcon.png"
import guanzhuchenggong from "../../static/images/guanzhuchenggong.png"

export default class FollowModel extends Taro.Component {
    static defaultProps ={
        show : false,
        timeStr:''
    }
    state = {
        
    }
    close(){
        this.props.onCloseFollowModel()
    }
  componentWillMount () {}
  render () {
    return (
        <View className="page">
        <View onClick={this.close} className={this.props.show?'box':''} catchtouchmove="preventD"></View>
        <View className={`model ${this.props.show?'':'hidden'} ${getGlobalData('phoneModel')?'model-phone-padded':''}`} catchtouchmove="preventD">
             <View onClick={this.close} className="model-close">
                 <Image src={closeIcom}/>
             </View>
                <View className="model-title">
                    <Image src={guanzhuchenggong}/>关注成功
                </View>
                <View className="model-text">
                    1.您好，此拍品将在 {this.props.timeStr} 结拍我们会在结拍前提醒您，防止您错过结拍时间。
                </View>
                <View className="model-text">
                    2.为营造公平公正的良好环境，参与竞拍需缴纳起拍价10%的保证金
                </View>
                <View className="model-text">
                    3.如有疑问，请点击联系客服了解详情
                </View>
        </View>
    </View>
    )
  }
}