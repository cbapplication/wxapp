import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import { strToTime } from '../../utils/funs'
import { getSpecial } from '../../api/specialise'
import { IMG_BASE } from '../../utils/const'
import { staticRecord } from '../../api/index'

export default class home extends Taro.Component {

	config = {
		navigationBarTitleText: '专题详情',
		enablePullDownRefresh: true,
		backgroundTextStyle: "dark",
	}
	constructor(props) {
		super(props)
		this.state = {
			curId: '',
			timer: null,
			sortInfo: [
				{ id: 0, name: "默认排序", icon: require("../../static/images/morenpaixu.png") },
				{ id: 1, name: "价格升序", icon: require("../../static/images/jiageshengxu.png") },
				{ id: 2, name: "价格降序", icon: require("../../static/images/jiagejiangxu.png") },
			],
			index: 1,
			selected: { id: 0, name: "默认排序", icon: require("../../static/images/morenpaixu.png") },
			menuFixed: false,//是否固定menu
			goodsInfo: {},//列表
		}
	}
	//筛选
	sort() {
		this.setState((preState) => {
			preState.selected = preState.sortInfo[preState.index];
			if (preState.index == 0) {
				this.GetSpecial(preState.curId)
			}
			if (preState.index == 1) {
				this.GetSpecial(preState.curId, 'start_price_asc')
			}
			if (preState.index == 2) {
				this.GetSpecial(preState.curId, 'start_price_desc')
			}
			preState.index++;
		})
		if (this.state.index == 2) {
			this.setState({ index: 0 })
		};
	}
	onPageScroll(e) {
		if (e.scrollTop > 295) {
			this.setState({
				menuFixed: true
			})
		} else {
			this.setState({
				menuFixed: false
			})
		}
	}
	goToGoodsInfo(id) {
		Taro.navigateTo({ url: `../goodsInfo/index?id=${id}` })
	}
	//下拉刷新
	onPullDownRefresh() {
		this.GetSpecial(this.state.curId)
	}
	componentWillMount() {
		const { id } = this.$router.params;
		this.GetSpecial(id)
		this.state.timer = setInterval(() => {
			this.setState(pre => {
				pre.curId = id
				pre.goodsInfo.count_down = strToTime(pre.goodsInfo.start_time, pre.goodsInfo.expires_time).time;
				pre.goodsInfo.status = strToTime(pre.goodsInfo.start_time, pre.goodsInfo.expires_time).status
				pre.goodsInfo.items.map(item => {
					item.count_down = strToTime(item.start_time, item.expires_time).time
					// item.status = strToTime(item.start_time, item.expires_time).status
				})
			})
		}, 1000)
	}
	componentDidShow(){
		staticRecord()
	}

	//获取专题详情
	GetSpecial(id, order = '') {
		getSpecial(id, order).then(res => {
			if (res.success) {
                Taro.stopPullDownRefresh()
				this.setState(pre => {
					pre.goodsInfo = res;
				})
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}
	componentWillUnmount() {
		clearInterval(this.state.timer)
	}
	render() {
		let { selected, menuFixed, goodsInfo } = this.state;
		const goodsList = goodsInfo.items.map((item) => {
			return (
				<View onClick={this.goToGoodsInfo.bind(this, item.id)} key="this" className="body-title">
					<Image src={IMG_BASE + item.cover_image} />
					<View className="body-goodsInfo">
						<View className="body-goodName">{item.name}</View>
						<View className="body-goodPrice">
							{item.status == 1 ? '起拍价 ' : '当前价 '}
							<Text className={`common-status${item.status}`}>¥{item.status == 1 ? item.start_price : item.price}</Text>
						</View>
						<View className="body-range">参考价: ¥{item.min_reference_price}～{item.max_reference_price}</View>
						<View className="body-range">{item.count_down}</View>
					</View>
				</View>
			)
		})
		return (
			<View className="page">
				<View className="page-head">
					<View className="select-body" style={`background-image: url(${IMG_BASE + goodsInfo.cover_image})`}>
						<View className="body-status">
							<Text className={`status common-bg-status${goodsInfo.status}`}>{goodsInfo.status_map[goodsInfo.status]}</Text>
							<Text className="time">{goodsInfo.count_down}</Text>
						</View>
					</View>
					<View className="select-name">
						<View className="goods-name">{goodsInfo.name}</View>
						<View className="goods-info">
							<View className="side-l">拍品：{goodsInfo.goods_numbers}件</View>
							<View className="middle">出价：{goodsInfo.auction_numbers}次</View>
							<View className="side-r">围观：{goodsInfo.click_times}次</View>
						</View>
					</View>
				</View>
				<View className="page-scroll">
					<View className={`page-body ${menuFixed ? 'menuFixed' : ''}`}>
						<View className="page-left">本期拍品</View>
						<View onClick={this.sort} className="page-right">
							{selected.name}
							<Image src={selected.icon} />
						</View>
					</View>
					<ScrollView className={menuFixed ? 'page-margin-top' : ''} scroll-y scroll-with-animation>
						{goodsList}
					</ScrollView>
				</View>
			</View>
		)
	}
}

