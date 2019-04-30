import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import './index.less'
export default class AnimateLayer extends Component {
  constructor(props) {
    super(props)
  }
  static options = {
    addGlobalClass: true
  }
  hide(e) {
    this.props.onShowFun()
    return false
  }
  componentWillMount() {

  }

  componentDidMount() {

  }
  componentWillUpdate() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  render() {
    const showStatus = this.props.isShowModel
    return (
      <View>
        <View className={`${showStatus ? 'layer-box' : ''}`} onClick={this.hide} catchtouchmove="preventD"></View>
        <View className={`layer-content ${showStatus ? '' : 'hidden'}`} catchtouchmove="preventD">
          <Image className='arrow xCenter' src={require('../../static/images/arrow-down.png')} onClick={this.hide} />
          {this.props.children}
        </View>
      </View>
    )
  }
}