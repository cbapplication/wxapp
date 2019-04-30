import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import GetPhone from '../../components/getPhone/index'
import Badge from '../../components/badge/index'
import { getCenter, getServantWeixin, orderNum } from '../../api/user'
import { storeStatus } from '../../api/store'
import { mtLog } from '../../utils/funs'
import Login from '../../components/login/index'
import { staticRecord } from '../../api/index'

export default class mine extends Taro.Component {

	config = {
		navigationBarTitleText: '个人中心',
		navigationBarBackgroundColor: '#ffc233',
	}
	constructor(props) {
		super(props)
		this.state = {
			header: '',
			nickName: '点击登录',
			userInfo: {},
			showGetPhone: false,//手机号绑定弹窗
			status: "点击登陆",
			hasApply: false,//是否申请过店铺
			checkStatus: '',//申请店铺状态
			idStatus: '',//身份认证状态
			storeText: '',//申请店铺按钮文案
			orderNum: 0,//订单数
		}
	}
	closeGetPhoneModel() {
		this.setState({
			showGetPhone: false
		})
	}
	loginSuccess(){
		this.GetCenter();
		this.getStoreStatus()
	}
	//登录
	getUserInfo(e) {
		let param = ''
		if (e.detail.errMsg === 'getUserInfo:ok') {
			param = {
				action: 'dl_grxx_yunxu click',
				action_desc: '点击允许'
			}
			this.setUserInfo(e.detail)
		} else {
			param = {
				action: 'dl_grxx_quxiao click',
				action_desc: '点击取消'
			}
		}
		mtLog(param)
	}
	setUserInfo(userInfo) {
		let token = this.getToken()
		if (this.state.userInfo && !token) {
			Taro.setStorageSync("userInfo", userInfo)
			this.setState({
				userInfo: userInfo
			}, (res) => {
				if (!token) {
					this.setState({ showGetPhone: true })
				}
			})
		} else {
			// Taro.navigateTo({
			// 	url: '../personal/index'
			// })
		}
	}
	getToken() {
		let token = Taro.getStorageSync('token')
		if (token) {
			return token
		} else {
			this.setState({
				showGetPhone: true
			})
		}
	}
	// closeGtPhoneModel() {
	// 	this.setState({
	// 		showGetPhone: false
	// 	})
	// }
	//进入我的订单
	goToMyOrder(e) {
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
			let token = this.getToken()
			if (token) {
				Taro.navigateTo({ url: '../myOrder/index' })
			}
		}
		let param = {
			action: 'wd_wodedingdan click',
			action_desc: '点击我的订单',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//进入我的竞拍
	goToMyBidding(e) {
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
			let token = this.getToken()
			if (token) {
				Taro.navigateTo({ url: '../myBidding/index' })
			}
		}
		let param = {
			action: 'wd_wodejingpai click',
			action_desc: '点击我的竞拍',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//进入我的关注
	goToMyFollow() {
		Taro.navigateTo({ url: '../myFollow/index' })
		let param = {
			action: 'wd_guanzhupaipin click',
			action_desc: '点击关注拍品',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//进入竞拍历史
	goToHistory(e) {
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
			let token = this.getToken()
			if (token) {
				Taro.navigateTo({ url: '../browsingHistory/index' })
			}
		}
		let param = {
			action: 'wd_liulanlishi click',
			action_desc: '点击浏览历史',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	goToFollowStore() {
		Taro.navigateTo({ url: '../followStore/index' })
		let param = {
			action: 'wd_guanzhudianpu click',
			action_desc: '点击关注店铺',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	copyBtn() {
		let wx = Taro.getStorageSync("weixin")
		Taro.setClipboardData({
			data: wx,
			success: function (res) {
			}
		})
		let param = {
			action: 'wd_weixinkefu click',
			action_desc: '点击微信客服',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//地址管理
	goToAddress(e) {
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
			let token = this.getToken()
			if (token) {
				Taro.navigateTo({ url: '../addressList/index' })
			}
		}
		let param = {
			action: 'wd_dizhiguanli click',
			action_desc: '点击地址管理',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//帮助中心
	goToHelp() {
		Taro.navigateTo({ url: '../help/index' })
		let param = {
			action: 'wd_bangzhuzhongxin click',
			action_desc: '点击帮助中心'
		}
		mtLog(param)
	}
	// 去个人
	goPersonal(e) {
		let token = Taro.getStorageSync('token')
		if (e && token) {
			Taro.navigateTo({ url: '../personal/index' })
		}
		let param = {
			action: 'wd_gerenxinxi click',
			action_desc: '点击个人信息',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//商铺订单
	goStoreOrder() {
		Taro.navigateTo({ url: '../storeOrder/index' })
		let param = {
			action: 'wd_dianpudindan click',
			action_desc: '点击店铺订单'
		}
		mtLog(param)
	}
	//店铺主页
	goSellerHomepage() {
		let id = getGlobalData('storeId')
		Taro.navigateTo({ url: `../sellerHomepage/index?id=${id}` })
	}
	//开通店铺
	goApplyStore(e) {
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
			let token = this.getToken()
			if (token) {
				let { checkStatus, idStatus, userInfo } = this.state
				if (userInfo.store_id) {
					if (checkStatus == 1 && idStatus == 0) {//认证中去店铺
						this.goSellerHomepage()
					} else {
						Taro.navigateTo({ url: `../applyStore/check?status=${checkStatus}&idStatus=${idStatus}` })
					}
				} else {
					Taro.navigateTo({ url: '../applyStore/index' })
				}
			}
		}
		let param = {
			action: 'wd_kaitongdianpu',
			action_desc: '点击开通店铺',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//个人钱包
	goMyWallet(e) {
		if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
			let token = this.getToken()
			if (token) {
				Taro.navigateTo({ url: '../myWallet/index' })
			}
		}
		let param = {
			action: 'wd_wodeqianbao click',
			action_desc: '点击我的钱包 ',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	mtLogPage() {
		let pages = getGlobalData('from')
		let param = ''
		if (pages == '/pages/home/index') {
			param = {
				action: 'sy_wode click',
				action_desc: '点击我的icon'
			}
		}
		if (pages == '/pages/special/index') {
			param = {
				action: 'zt_wode click',
				action_desc: '点击我的icon'
			}
		}
		if (pages == '/pages/category/index') {
			param = {
				action: 'fl_wode click',
				action_desc: '点击我的icon'
			}
		}
		mtLog(param)
	}
	componentWillMount() {
		// this.setState(
		// 	pre => {
		// 		pre.timer = setInterval(() => {
		// 			let token = Taro.getStorageSync("token")
		// 			if (token) {
		// 				this.GetCenter();
		// 				this.getStoreStatus()
		// 				clearInterval(pre.timer)
		// 			}
		// 		}, 1000)
		// 	}
		// )
	}
	componentDidShow() {
		let userInfo = Taro.getStorageSync('userInfo')
		let token = Taro.getStorageSync("token")
		if (token) {
			this.GetCenter();
			this.getStoreStatus()
		}
		if (userInfo) {
			let userInfoData = userInfo.userInfo
			let header = userInfo.avatar || userInfoData.avatarUrl || ''
			let nickName = userInfo.nick_name || userInfoData.nickName || '点击登录'
			this.setState({
				userInfo: userInfo,
				header: header,
				nickName: nickName
			})
		}
		this.mtLogPage()
		staticRecord()
	}
	componentDidHide() {
		setGlobalData('from', this.$router.path)
	}

	//获取个人中心
	GetCenter() {
		getCenter().then(res => {
			if (res.success) {
				this.setState(pre => {
					pre.userInfo = res;
					pre.header = res.avatar;
					pre.nickName = res.nick_name;
					Taro.setStorageSync("userInfo", res)
				})
				setGlobalData('storeId', res.store_id)
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}
	//获取我的订单数
	getOrderNum() {
		orderNum().then(res => {
			if (res.success) {
				this.setState(pre => {
					pre.orderNum = res.order_num
				})
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}

	//判断申请店铺状态
	getStoreStatus() {
		storeStatus().then(
			(res) => {
				let text = ''
				if (res.success == 2003) {
					//去开通
					this.setState({
						storeText: '去开通'
					})
					return
				}
				if (res.success == 0) {
					if (res.check_status == 0) {
						text = '审核中'
					}
					if (res.check_status == -1) {
						text = '审核失败'
					}
					if (res.check_status == 1) {
						if (res.authrize_status == 2) {
							text = '未认证'
						}
						if (res.authrize_status == 0) {
							text = '认证中'
						}
						if (res.authrize_status == -1) {
							text = '认证失败'
						}
						this.setState(
							pre => {
								pre.idStatus = res.authrize_status
							}
						)
					}
					this.setState({
						checkStatus: res.check_status,
						storeText: text
					})
				}
			}
		)
	}

	render() {
		let { userInfo, showGetPhone, storeText, idStatus, checkStatus, header, nickName } = this.state
		// let userInfoData = userInfo.userInfo
		// let header = userInfo.avatar || userInfoData.avatarUrl || ''
		// let nickName = userInfo.nick_name || userInfoData.nickName || '点击登录'
		return (
			<View className="page">
				<View className="page-head"></View>
				<ScrollView scroll-y scroll-with-animation>
					{/* <!-- 我的相关 --> */}
					<View className="mine">
						<View className="mine-head">
							<View className="head-user">
								<Button className="header" open-type="getUserInfo" onGetUserInfo={this.getUserInfo} onClick={this.goPersonal.bind(this, nickName)}>
									<Image className="head-cover" src={header} />
								</Button>
								<Button className="detail" open-type="getUserInfo" onGetUserInfo={this.getUserInfo} onClick={this.goPersonal.bind(this, nickName)}>
									<View className="name">{nickName}</View>
									<View className="number">{userInfo.nick_name && '查看或编辑账户设置'}</View>
								</Button>
								<Image className="image-set" src={require("../../static/images/shezhi.png")} onClick={this.goPersonal.bind(this, 1)} />
								<Button open-type="getUserInfo" onGetUserInfo={this.goMyWallet} className="mine-wallet">
									<View className="wallet-left">我的钱包</View>
									<Image src={require("../../static/images/rightIcon.png")} />
									<View className="wallet-right">点击查看账户余额</View>
								</Button>
							</View>
							<View className="user-manage">
								<Button open-type="getUserInfo" onGetUserInfo={this.goToMyOrder} className="manage-item">
									<Badge count={userInfo.order_num}></Badge>
									<Image src={require("../../static/images/quanbudingdan.png")} />
									<View>全部订单</View>
								</Button>
								<Button open-type="getUserInfo" onGetUserInfo={this.goToMyBidding} className="manage-item">
									<Badge count={userInfo.auction_num}></Badge>
									<Image src={require("../../static/images/wodejingpai.png")} />
									<View>我的竞拍</View>
								</Button>
								<Button open-type="getUserInfo" onGetUserInfo={this.goToHistory} className="manage-item">
									<Image src={require("../../static/images/liulanlishi.png")} />
									<View>浏览历史</View>
								</Button>
							</View>
							<View className="user-manage">
								<View onClick={this.goToMyFollow} className="manage-item">
									<Image src={require("../../static/images/guanzhupaipin.png")} />
									<View>关注拍品</View>
								</View>
								<View onClick={this.goToFollowStore} className="manage-item">
									<Image src={require("../../static/images/guanzhudianpu.png")} />
									<View>关注店铺</View>
								</View>
								<View className="manage-item">
								</View>
							</View>
						</View>
					</View>
					{/* <!-- 我的店铺 --> */}
					{userInfo.store_id && checkStatus > 0 && <View className="page-my-store">
						<View className="title">我的店铺</View>
						<View className="user-manage">
							<View className="manage-item" onClick={this.goSellerHomepage}>
								<Image src={require("../../static/images/wodejingpai.png")} />
								<View>店铺拍品</View>
							</View>
							<View className="manage-item" onClick={this.goStoreOrder}>
								<Image src={require("../../static/images/quanbudingdan.png")} />
								<View>店铺订单</View>
							</View>
							<View className="manage-item">
							</View>
						</View>
					</View>}
					{/* <!-- 我的服务 --> */}
					<View className="store-selected">
						<View className="title">我的服务</View>
						{idStatus !== 1 && <Button open-type="getUserInfo" onGetUserInfo={this.goApplyStore} className="store">
							<Image className="image" src={require("../../static/images/kaidian.png")} />
							<View className="detail">
								<View className="name">开通店铺</View>
								<View className="number">申请成为商家、开通店铺</View>
							</View>
							<View className="goStore">
								{storeText}
								<Image src={require("../../static/images/rightIcon.png")} />
							</View>
						</Button>}
						<View onClick={this.copyBtn} className="store">
							<Image className="image" src={require("../../static/images/weixinkefu.png")} />
							<View className="detail">
								<View className="name">微信客服</View>
								<View className="number">您的专属客服</View>
							</View>
							<View className="goStore">
								复制客服微信号
                    {/*  <image src="../static/images/sy_jinrudianpu_jiantou@3x.png"/>  */}
							</View>
						</View>
						<Button open-type="getUserInfo" onGetUserInfo={this.goToAddress} className="store">
							<Image className="image" src={require("../../static/images/dizhi.png")} />
							<View className="detail">
								<View className="name">地址管理</View>
								<View className="number">管理收货地址</View>
							</View>
							<View className="goStore">
								<Image src={require("../../static/images/rightIcon.png")} />
							</View>
						</Button>
						<View onClick={this.goToHelp} className="store">
							<Image className="image" src={require("../../static/images/bangzhu.png")} />
							<View className="detail">
								<View className="name">帮助中心</View>
								<View className="number">拍卖规则及说明</View>
							</View>
							<View className="goStore">
								<Image src={require("../../static/images/rightIcon.png")} />
							</View>
						</View>
					</View>
				</ScrollView>
				<GetPhone userInfo={userInfo} onCloseGetPhoneModel={this.closeGetPhoneModel} onLoginSuccess={this.loginSuccess} showGetPhone={showGetPhone}></GetPhone>
			</View>
		)
	}
}

