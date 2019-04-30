import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
export default class Modal extends Taro.Component {
  static defaultProps = {
    msg: ''
  }
  state = {
  }
  static options = {
    addGlobalClass: true
  }
  componentDidMount() {

  }
  render() {
    const { msg } = this.props;
    return (
      <View className={`modal ${this.props.show ? '' : 'model-hidden'}`} catchtouchmove="preventD">
        <View className='content xyCenter'>
          <View className='result'>无法发布</View>
          <View className='cause'>开拍时间早于当前时间,是否把开拍时间改为现在</View>
          <View className='btn-box'>
            <View className='no fl' onClick={this.props.onNo}>否</View>
            <View className='yes fl' onClick={this.props.onYes}>是</View>
          </View>
        </View>
      </View>
    )
  }
}