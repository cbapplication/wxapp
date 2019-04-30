import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.css'
export default class FollowModel extends Taro.Component {
    static defaultProps ={
        loading:true,
    }
  render () {
    const {loading} = this.props;
    return (
        <View className={`i-class i-load-more ${ loading ? '' : 'i-load-more-line' }`}>
            {loading && <View className="i-load-more-loading"></View>}
            <View className="i-load-more-tip">
               {loading ? <View>加载更多</View>
               :<View></View>
               }
            </View>
        </View>
    )
  }
}