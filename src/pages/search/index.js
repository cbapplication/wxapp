import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import timeIcon from "../../static/images/time.png"
import chujia from "../../static/images/chujia.png"

import { searchGoods, searchStore,staticRecord } from '../../api/index'
import { getClassify } from '../../api/goods'
import { IMG_BASE } from '../../utils/const'
import './index.less'

import { clock, mtLog } from '../../utils/funs'
import CategoryFilter from '../../components/categoryFilter/index'
export default class search extends Taro.Component {

	config = {
		navigationBarTitleText: '铭探拍卖',
	}
	constructor(props) {
		super(props)
		this.state = {
			timer: null,
			drapDownInfo: [
				{ id: 1, name: "拍品" },
				{ id: 2, name: "店铺" },
			],
			drapDown: false,//下拉框
			selectedDrap: { id: 1, name: "拍品" },//下拉文字
			menuList: [],
			toView: '',//滑到可视区
			scrollId: '',//滑动选中ID
			orderFlag: '',//筛选
			searchHidden: false,//隐藏search
			categoryFilterModel: false,//筛选
			goodsParams: {},//搜索商品参数
			goods_name: '',
			store_name: '',
			hasGoods: false,
			hasStore: false,
			goodsList: [],//拍品列表
			storeList: [],//店铺列表
			goodsPage: 1,
			storePage: 1,
			value: ''
		}
	}
	//打开&关闭下拉框
	open() {
		if (this.state.drapDown == false) {
			this.setState({ drapDown: true })
		} else {
			this.setState({ drapDown: false })
		}
	}
	searchValue(e) {
		let { value } = e.detail;
		let { selectedDrap } = this.state;
		if (selectedDrap.id == 1) {
			this.setState(pre => {
				pre.goods_name = value;
				pre.scrollId = 1;
				pre.orderFlag = '';
				pre.goodsPage = 1;
				pre.goodsParams = { goods_name: value }
				this.SearchGoods(pre.goodsParams, true)
			})
		} else {
			this.setState(pre => {
				pre.store_name = value
				this.SearchStore({ store_name: value, page: 1 }, true)
			})
		}
	}
	//选择
	option(id) {
		this.setState((preState) => {
			preState.selectedDrap = preState.drapDownInfo[id - 1]
			preState.drapDown = false
		})
	}
	searchContent() {
		if (this.state.selectedDrap.id == 1) {
			this.searchGoods()
		} else {
			this.searchStore()
		}
	}
	mtLogCategory(id) {
		let param = ''
		if (id == 1) {
			param = {
				action: 'fl_qbpp_fenleiall click',
				action_desc: '全部拍品分类'
			}
		}
		if (id == 2) {
			param = {
				action: 'fl_qbpp_taociqi click',
				action_desc: '陶瓷器分类'
			}
		}
		if (id == 3) {
			param = {
				action: 'fl_qbpp_wenfangzaxiang click',
				action_desc: '文房杂项'
			}
		}
		if (id == 4) {
			param = {
				action: 'fl_qbpp_chaye  click',
				action_desc: '茶叶分类'
			}
		}
		if (id == 5) {
			param = {
				action: 'fl_qbpp_chaju  click',
				action_desc: '茶具分类'
			}
		}
		if (id == 6) {
			param = {
				action: 'fl_qbpp_jiu click',
				action_desc: '酒分类'
			}
		}
		if (id == 7) {
			param = {
				action: 'fl_qbpp_shuji click',
				action_desc: '书籍分类'
			}
		}
		if (id == 8) {
			param = {
				action: 'fl_qbpp_jiaju click',
				action_desc: '家具分类'
			}
		}
		if (id == 9) {
			param = {
				action: 'fl_qbpp_qita click',
				action_desc: '其他分类'
			}
		}
		mtLog(param)
	}
	scrollToView(index, id) {
		this.setState((pre) => {
			pre.toView = id;
			pre.scrollId = index;
			pre.orderFlag = '';
			pre.drapDown = false;
			pre.goods_name = ''
			pre.store_name = ''
			pre.goodsPage = 1;
			pre.goodsParams = { classify_id: pre.scrollId }
			this.SearchGoods(pre.goodsParams, true)
		})
		this.mtLogCategory(index)
	}
	mtLogOrder(order) {
		let param = ''
		if (order == '') {
			param = {
				action: 'fl_qbpp_moren click',
				action_desc: '点击默认'
			}
		}
		if (order == 'expires_time') {
			param = {
				action: 'fl_qbpp_jijiangjiepai click',
				action_desc: '点击即将结拍'
			}
		}
		if (order == 'ctime') {
			param = {
				action: 'fl_qbpp_zuixin click',
				action_desc: '点击最新'
			}
		}
		if (order == 'price') {
			param = {
				action: 'fl_qbpp_dangqianjia click',
				action_desc: '点击当前价'
			}
		}
		mtLog(param)
	}
	//排序
	orderSort(order, isPrice) {
		let { scrollId, goods_name } = this.state;
		if (isPrice) {
			if (order == 'price_desc') {
				order = 'price_asc'
			} else if (order == 'price_asc') {
				order = 'price_desc'
			} else {
				order = 'price_desc'
			}
		}
		if (goods_name != '') {
			this.setState(pre => {
				pre.orderFlag = order;
				pre.goodsPage = 1;
				pre.goodsParams = { order: order, goods_name: goods_name }
				this.SearchGoods(pre.goodsParams, true)
			})
		} else {
			this.setState(pre => {
				pre.orderFlag = order;
				pre.goodsPage = 1;
				pre.goodsParams = { order: order, classify_id: scrollId }
				this.SearchGoods(pre.goodsParams, true)
			})
		}
		this.mtLogOrder(order)
	}
	//筛选
	sortClick(order) {
		this.setState((pre) => {
			pre.categoryFilterModel = true;
			pre.orderFlag = order
		})
		let param = {
			action: 'fl_qbpp_shaixuan click',
			action_desc: '点击筛选'
		}
		mtLog(param)
	}
	closeFilterModel() {
		this.setState((pre) => {
			pre.categoryFilterModel = false
		})

	}
	onPageScroll(e) {
		if (e.scrollTop > 43) {
			!this.state.searchHidden && this.setState({ searchHidden: true, drapDown: false });
		} else {
			this.state.searchHidden && this.setState({ searchHidden: false });
		}
	}
	goToGoodsInfo(id) {
		Taro.navigateTo({ url: `../goodsInfo/index?id=${id}` })
	}
	confirm(arg) {
		let { scrollId, goods_name } = this.state;
		if (goods_name != '') {
			arg.classify_id = '';
			arg.goods_name = goods_name;
			this.setState(pre => {
				pre.goodsPage = 1;
				pre.goodsParams = arg;
				this.SearchGoods(arg, true)
			})
		} else {
			arg.goods_name = '';
			arg.classify_id = scrollId;
			this.setState(pre => {
				pre.goodsPage = 1;
				pre.goodsParams = arg;
				this.SearchGoods(arg, true)
			})
		}
	}
	//触底分页加载
	onReachBottom() {
		let { selectedDrap, store_name } = this.state;
		if (selectedDrap.id == 1) {
			this.setState(pre => {
				pre.goodsPage++;
				pre.goodsParams.page = pre.goodsPage;
				Taro.showLoading()
				this.SearchGoods(pre.goodsParams, false)
			})
		} else {
			this.setState(pre => {
				pre.storePage++;
				Taro.showLoading()
				this.SearchStore({ store_name: store_name, page: pre.storePage }, false)
			})
		}
	}
	//下拉刷新
	onPullDownRefresh() {

	}
	componentWillMount() {
		this.GetClassify();
		let { goodsParams, } = this.state;
		let { id } = this.$router.params;
		goodsParams.classify_id = id || ''
		this.SearchGoods(goodsParams, false)
		//this.SearchStore({ store_name: '', page: 1 }, true)
		this.state.timer = setInterval(() => {
			this.setState(pre => {
				pre.goodsList.map(item => {
					item.count_down = clock(item.start_time, item.expires_time)
				})
			})
		}, 1000)
	}
	componentDidShow(){
		staticRecord()
	}
	componentDidMount() {
		let { id } = this.$router.params;
		setTimeout(() => {
			this.setState(pre => {
				pre.scrollId = id;
				pre.toView = 'target' + id;
			})
		}, 200);
	}
	GetClassify() {
		getClassify().then(res => {
			if (res.success) {
				this.setState(pre => {
					pre.menuList = res.items;
				})
			}
		})
	}
	/**
	* 搜索拍品
	* @param {*} goodsParams 
	* @param {是否刷新} refresh  
	*/
	SearchGoods(goodsParams, refresh) {
		searchGoods(goodsParams).then(res => {
			if (res.success) {
				Taro.hideLoading()
				this.setState(pre => {
					pre.hasGoods = res.hasData;
					Taro.stopPullDownRefresh()
					if (!refresh) {
						pre.goodsList = pre.goodsList.concat(res.items);
					} else {
						pre.goodsList = (res.items);
					}
				})
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}
	/**
	 * 店铺
	 * @param {page,store_name} params 
	 */
	SearchStore(params, refresh) {
		searchStore(params).then(res => {
			if (res.success) {
				Taro.hideLoading()
				this.setState(pre => {
					pre.hasStore = res.hasData;
					Taro.stopPullDownRefresh()
					if (!refresh) {
						pre.storeList = pre.storeList.concat(res.items);
					} else {
						pre.storeList = (res.items);
					}
				})
			}
		})
	}
	//店铺主页
	goToStore(id) {
		Taro.navigateTo({ url: `../sellerHomepage/index?id=${id}` })
	}
	componentWillUnmount() {
		clearInterval(this.state.timer)
	}
	render() {
		let { goods_name, hasGoods, hasStore, orderFlag, drapDownInfo, drapDown, selectedDrap, menuList, toView, scrollId, searchHidden, categoryFilterModel, goodsList, storeList } = this.state;
		const menu = menuList.map((item) => {
			return (
				<View onClick={this.scrollToView.bind(this, item.id, ('target' + item.id))} key="this" id={'target' + item.id} className={`menu-item ${scrollId == item.id ? 'active' : ''}`}>
					{item.name}
				</View>
			)
		})
		const downList = drapDownInfo.map((item) => {
			return (
				<View onClick={this.option.bind(this, item.id)} key="this">{item.name}</View>
			)
		})
		let priceStatus = ['', '起拍价', '当前价', '成交价', '起拍价'];
		const goods = goodsList.map((item) => {
		return <View className="good" taroKey="this">
			<View onClick={this.goToGoodsInfo.bind(this,item.id)}  className="block">
				<Image src={`${IMG_BASE+item.cover_image}`}  mode lazy-load/>
				<View className="block-bottom">
					<View className="name"> {item.name}</View>
					<View className={`price common-status${item.status}`}>
						<Text className="text">{priceStatus[item.status] }</Text>
						¥{item.status == 1?item.start_price :item.price}
					</View>
					<View className="time">
						<Image src={timeIcon} />
						<Text>{item.count_down}</Text> 
						{ item.status > 1 && <Image className="marginL" src={chujia}/>}
						{ item.status == 1 && <Image className="marginL" src={require('../../static/images/guanzhu.png')} />}
						{item.status == 1
							? <Text>{item.focus_times}次</Text>
							: <Text>{item.auction_times}次</Text>
						}
						{item.is_proprietary && <Text className="self-support">自营</Text>}
						</View>
					</View>
				</View>
			</View>
		})
		let Goods = hasGoods ? goods : <View className='no-data'>没有找到相关内容</View>
		const storeCon = storeList.map((item) => {
			return (
				<View onClick={this.goToStore.bind(this, item.id)} key="this" className="store">
					<Image src={IMG_BASE + item.avatar} />
					<View className="detail">
						<View className="name">{item.name}</View>
						<View className="number">{item.description}</View>
					</View>
					<View className="goStore">
						<Image src={require("../../static/images/rightIcon.png")} />
					</View>
				</View>
			)
		})
		let Store = hasStore ? storeCon : <View className='no-data'>没有找到相关内容</View>
		return (
			<View className="page">
				<View className={`search ${searchHidden ? 'search-hid' : ''}`}>
					<View className="page-input">
						<View className='select-box'>
							<Text onClick={this.open}>{selectedDrap.name}</Text>
							<Image onClick={this.open} src={require("../../static/images/sousuoxiala.png")} />
						</View>
						<Input className='yCenter' type="Text" placeholder='请输入您要找的内容' value={goods_name} onChange={this.searchValue} />
					</View>
					<View className={`drop-down ${drapDown ? '' : 'drap-down-close'}`}>
						{downList}
					</View>
				</View>
				{
					selectedDrap.id == 1 && <View className={`menu ${searchHidden ? 'menu-fixed' : ''}`}>
						<ScrollView className="menu-scroll" scroll-x scroll-into-view={toView} scroll-with-animation>
						<View onClick={this.scrollToView.bind(this, '', 'target')}  id={'target'} className={`menu-item ${scrollId == '' ? 'active' : ''}`}>
							全部
						</View>
							{menu}
						</ScrollView>
						<View className="menu-sort">
							<View onClick={this.orderSort.bind(this, '', false)} className={`sort-item sort-first ${orderFlag == '' ? 'active' : ''}`}>
								默认
              </View>
							<View onClick={this.orderSort.bind(this, 'expires_time', false)} className={`sort-item ${orderFlag == 'expires_time' ? 'active' : ''}`}>
								即将结拍
              </View>
							<View onClick={this.orderSort.bind(this, 'ctime', false)} className={`sort-item ${orderFlag == 'ctime' ? 'active' : ''}`}>
								最新
              </View>
							<View onClick={this.orderSort.bind(this, orderFlag, true)} className={`sort-item ${orderFlag == 'price_desc' || orderFlag == 'price_asc' ? 'active' : ''}`}>
								当前价
							{!orderFlag ? <Image src={require("../../static/images/dangqianjia.png")} />
									:
									orderFlag == 'price_desc'
										? <Image src={require("../../static/images/dangqianjiagao.png")} />
										: <Image src={require("../../static/images/dangqianjiadi.png")} />
								}
							</View>
							<View onClick={this.sortClick.bind(this, 'sort')} className={`sort-item sort-last ${orderFlag == 'sort' ? 'active' : ''}`}>
								筛选
              <Image src={require("../../static/images/shaixuan.png")} />
							</View>
						</View>
					</View>
				}
				<ScrollView scroll-y scroll-with-animation className={`recommend ${searchHidden ? 'recommend-top' : ''}`}>
					{
						selectedDrap.id == 1
							? <View className="goodslist">
								{Goods}
							</View>
							: <View className='store-list'>
								{Store}
							</View>
					}
				</ScrollView>
				<CategoryFilter onConfirm={this.confirm} onCloseFilterModel={this.closeFilterModel} show={categoryFilterModel}></CategoryFilter>
			</View>
		)
	}
}

