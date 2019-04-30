import Taro from '@tarojs/taro'
import { View, Block } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import Poster from '../posterModel/index'
import './index.css'


export default class shareModel extends Taro.Component {
	static defaultProps = {
		show: false,
		choices: {
			firstChoice: '',
			secondChoice: '',
			needPoster: false
		}
	}
	state = {
		showPosterModel: false
	}
	cancal() {
		this.props.onCloseShareModel()
	}

	poster() {
		this.props.onCloseShareModel()
		this.setState({ showPosterModel: true })
	}
	choosePic() {
		this.props.onCloseShareModel()

	}
	closePosterModel() {
		this.setState({ showPosterModel: false })
	}
	componentWillMount() { }
	render() {

		const { showPosterModel } = this.state;
		const { firstChoice, secondChoice, needPoster } = this.props.choices
		return (
			<View className="page">
				<View onClick={this.cancal} className={this.props.show ? 'box' : ''} catchtouchmove="preventD"></View>
				<View className={`model ${this.props.show ? '' : 'hidden'} ${getGlobalData('phoneModel') ? 'model-phone' : ''}`} catchtouchmove="preventD">
					<View className="model-bottom">
						<View className="model-frends" onClick={this.firstHandleFun}>
							{firstChoice}
						</View>
						{needPoster
							? <View onClick={this.poster} className="model-pic">
								{secondChoice}
							</View>
							: <View onClick={this.choosePic} className="model-pic">
								{secondChoice}
							</View>
						}
					</View>
					<View onClick={this.cancal} className={`model-cancal ${getGlobalData('phoneModel') ? 'model-bottom-phone' : ''}`}>
						<View>取消</View>
					</View>
				</View>
				{needPoster && <Poster onShowPosterModel={this.poster} onClosePosterModel={this.closePosterModel} show={showPosterModel}></Poster>}
			</View>
		)
	}
}