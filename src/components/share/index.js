import Taro from '@tarojs/taro'
import { View,Button } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import Poster from '../posterModel/index'
import './index.css'


export default class shareModel extends Taro.Component {
    static defaultProps ={
        show : false,
        phoneModel:false,
    }
    state = {
        showPosterModel:false
    }
    cancal(){
        this.props.onCloseShareModel()
    }
    poster(){
        this.props.onCloseShareModel()
        this.setState({showPosterModel:true})
    }
    closePosterModel(){
        this.setState({showPosterModel:false})
    }
    onShareAppMessag(res) {
        if (res.from === 'button') {
          // From the forward button within the page
          console.log(res.target)
        }
        return {
          title: "铭探",
          path: '/page/goodsInfo/index?id=1'
        }
      }
  render () {
    const {showPosterModel} = this.state;
    const {postDate} = this.props;
    return (
        <View className="page">
        <View onClick={this.cancal} className={this.props.show?'box':''}></View>
        <View className={`model ${this.props.show?'':'hidden'} ${getGlobalData('phoneModel')?'model-phone':''}`} catchtouchmove="preventD">
            <View className="model-bottom">
                <Button openType="share" className="model-frends">
                    发送给朋友
                </Button>
                <View onClick={this.poster} className="model-pic">
                    生成海报
                </View>
            </View>
            <View onClick={this.cancal} className={`model-cancal ${getGlobalData('phoneModel')?'model-bottom-phone':''}`}>
                <View>取消</View>
            </View>
        </View>
        <Poster onShowPosterModel={this.poster} onClosePosterModel={this.closePosterModel} show={showPosterModel} postDate={postDate}></Poster>
    </View>
    )
  }
}