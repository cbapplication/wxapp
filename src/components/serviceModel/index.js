import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.css'
import closeIcom from "../../static/images/rightIcon.png"
import kefuxiaolian from "../../static/images/kefuxiaolian.png"
import { getServantWeixin } from '../../api/user'

export default class serviceModel extends Taro.Component {
  static defaultProps = {
    show: false,
    weixin: ''
  }
  state = {
    btnStatus: "复制"
  }
  close() {
    this.setState({ btnStatus: "复制" });
    this.props.onCloseServiceModel()
  }
  copyBtn() {
    let _this = this;
    Taro.setClipboardData({
      data: _this.props.weixin,
      success: function (res) {
        if (res.errMsg == "setClipboardData:ok") {
          _this.setState({ btnStatus: "已复制" })
        }
      }
    });
  }
  //获取客服号
  GetServantWeixin() {
    let _this = this
    getServantWeixin().then(res => {
      if (res.success) {
        Taro.setStorageSync('weixin', res.weixin)
        _this.setState({
          weixin: res.weixin
        })
      }
    })
  }
  componentDidShow() {
    let wxkf = Taro.getStorageSync("weixin")
    if (!wxkf) {
      this.GetServantWeixin()
    } else {
      this.setState({
        weixin: wxkf
      })
    }
  }
  render() {
    // const { weixin } = this.props
    const { weixin } = this.state
    return (
      <View className="page">
        <View onClick={this.close} className={this.props.show ? 'box' : ''} catchtouchmove="preventD"></View>
        <View className={`model ${this.props.show ? '' : 'hidden'}`} catchtouchmove="preventD">
          <View onClick={this.close} className="model-close">
            <Image src={closeIcom} />
          </View>
          <View className="model-title">
            <Image src={kefuxiaolian} />客服服务
             </View>
          <View className="model-text">
            客服微信号
             </View>
          <View className="model-text">
            {weixin}
          </View>
          <View onClick={this.copyBtn} className={`model-button ${this.state.btnStatus == '已复制' ? 'copyed' : 'uncopy'}`}>
            {btnStatus}
          </View>
          <View className="model-bottom">
            添加即可获得专属服务
             </View>
        </View>
      </View>
    )
  }
}