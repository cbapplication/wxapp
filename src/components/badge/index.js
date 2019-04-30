import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
export default class FollowModel extends Taro.Component {
	static defaultProps = {
		count: 0
	}
	componentDidMount() {

	}
	render() {
		const { count } = this.props;
		let right = count > 9 ? 'right:55rpx;' : 'right:70rpx;'
		if (count <= 0) return
		return (
			<View className="model-badge" style={`${right}color: #ffffff;font-family: PingFang-SC;font-size: 22rpx;font-weight: 500;`}>
				{count > 99 ? '99+' : count}
			</View>
		)
	}
}