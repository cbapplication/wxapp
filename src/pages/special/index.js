import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.less'
import searchIcon from "../../static/images/searchIcon.png"
import people from "../../static/images/people.png"
import PreLoading from '../../components/preLoading/index'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import { specialList } from '../../api/specialise'
import { strToTime, mtLog } from '../../utils/funs'
import { IMG_BASE } from '../../utils/const'
import { staticRecord } from '../../api/index'

export default class special extends Taro.Component {

	config = {
		navigationBarTitleText: '专题',
		enablePullDownRefresh: true,
		backgroundTextStyle: "dark",
	}
	constructor(props) {
		super(props)
		this.state = {
			timer: null,
			items: [],//列表数据
			loadMore: true,//加载更多
			page: 1,//页码
			hasList: false,//是否有数据
		}
	}
	//进专题列表
	goToSpecialDetail(id) {
		Taro.navigateTo({ url: `../specialDetail/index?id=${id}` })
		let param = {
			action: 'zt_zhuangchang click',
			action_desc: '点击专场',
			arg1: id
		}
		mtLog(param)
	}
	goToSearch() {
		Taro.navigateTo({ url: `../search/index` })
	}
	//进入详情
	goToGoodsInfo(id, e) {
		e.stopPropagation();
		Taro.navigateTo({ url: `../goodsInfo/index?id=${id}` })
		let param = {
			action: 'zt_paiping click',
			action_desc: '点击拍品',
			arg1: '图录号'
		}
		mtLog(param)
	}
	mtLogPage() {
		let pages = getGlobalData('from')
		let param = ''
		if (pages == '/pages/home/index') {
			param = {
				action: 'sy_zhuanti click',
				action_desc: '点击专题icon'
			}
		}
		if (pages == '/pages/category/index') {
			param = {
				action: 'fl_zhuanti click',
				action_desc: '点击专题icon'
			}
		}
		if (pages == '/pages/mine/index') {
			param = {
				action: 'wd_zhuanti click',
				action_desc: '点击专题icon'
			}
		}
		mtLog(param)
	}
	//触底分页加载
	onReachBottom() {
		this.setState(pre => {
			pre.page++;
			pre.loadMore = true;
			this.SpecialList(pre.page, false)
		})

	}
	//下拉刷新
	onPullDownRefresh() {
		this.SpecialList(1, true)
		this.setState({ page: 1 })
	}
	componentWillMount() {
		this.SpecialList(this.state.page, false);
		this.state.timer = setInterval(() => {
			this.setState(pre => {
				pre.items.map(item => {
					item.count_down = strToTime(item.start_time, item.expires_time).time;
					//item.status = strToTime(1554279997032,1556287802032).status
				})
			})
		}, 1000)
	}
	componentWillUnmount(){
        clearInterval(this.state.timer)
	}
	componentDidShow(){
		this.mtLogPage()
		staticRecord()
	}
	componentDidHide() {
		setGlobalData('from', this.$router.path)
	}
  /**
  * 获取关注拍品
  * @param {页码} page 
  * @param {是否刷新} refresh 
  */
	SpecialList(page, refresh) {
		specialList(page).then(res => {
			if (res.success) {
				this.setState(pre => {
					pre.loadMore = false;
					pre.hasList = res.success
					Taro.stopPullDownRefresh()
					if (!refresh) {
						pre.items = pre.items.concat(res.items);
					} else {
						pre.items = (res.items);
					}
				})
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}
	render() {
		const { items, hasList, loadMore } = this.state;
		const special = items.map((item) => {
			return <View onClick={this.goToSpecialDetail.bind(this, item.id)} key='this' className="page-head">
				<View className="select">
					<View className="select-name">
						<View className="name-left">
							<View className="left-name">{item.name}</View>
							<View className="left-time">{item.end_time}</View>
						</View>
						<View className="name-right">
							<Image src={people} />
							<View>{item.click_times}次围观</View>
						</View>
					</View>
					<View className="select-body" style={`background-image: url(${IMG_BASE + item.cover_image})`}>
						<View className="body-status">
							<Text className={`status common-bg-status${item.status}`}>{item.status_map[item.status]}</Text>
							<Text className="time">{item.count_down}</Text>
						</View>
					</View>
				</View>
				<ScrollView scrollX scrollWithAnimation className="goods-cont">
					{
						item.goodsList.map((item1) => {
							return <View onClick={this.goToGoodsInfo.bind(this, item1.id)} key="this" className="goods">
								<Image mode="aspectFill" src={IMG_BASE + item1.cover_image} />
								<View className="name">{item1.name}</View>
								<View className="price">当前价：￥{item1.price}</View>
							</View>
						})
					}
				</ScrollView>
			</View>
		})
		return (
			<View className="page">
				{hasList
					? <View>
						<View onClick={this.goToSearch} className="search">
							<View>
								<Image src={searchIcon} />
								大家都在搜索泥春华
            </View>
						</View>
						<View className="page-block"></View>
						<ScrollView scrollY scrollWithAnimation>
							{special}
							<LoadMore loading={loadMore}></LoadMore>
						</ScrollView>
					</View>
					: <PreLoading></PreLoading>
				}
			</View>
		)
	}
}
