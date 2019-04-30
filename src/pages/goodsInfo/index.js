import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper, Button } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import rightIcon from '../../static/images/rightIcon.png'
import RecordModel from '../../components/recordModel/index'
import ServiceModel from '../../components/serviceModel/index'
import FollowModel from '../../components/followModel/index'
import OfferModel from '../../components/offerModel/index'
import Share from '../../components/share/index'
import GetPhone from '../../components/getPhone/index'
import PayModel from '../../components/payModel/index'
import WxParse from '../../utils/wxParse/wxParse'
import './index.less'

import { strToTime, setGoodsIds, formatMoney, scale, mtLog, formatDate } from '../../utils/funs'
import { WSS, IMG_BASE } from '../../utils/const'
import { getGoodsDetail, getAuctionHistory, getIntro, getHelp, getPosterInfo, focusOrDiscard, socketGroup } from '../../api/goods'
import { getStore,getProtocol } from '../../api/store'
import { myWallet,getCenter } from '../../api/user'
import { staticRecord } from '../../api/index'

export default class goodsInfo extends Taro.Component {

	config = {
		navigationBarTitleText: '拍品详情',
	}
	constructor(props) {
		super(props)
		this.state = {
            timer: null,//定时器ID
            timer2:null,
			showFollowPreView: false,//预展关注
			showFollowModel: false,//关注
			showBail: false,//充值保障金
			showServiceModel: false,//客服
			offerRecordModel: false,//出价记录
			shareShow: false,//分享
			phoneModel: false,//手机
			showTip: false,//tip
			showOfferModel: false,//出价
			posterShow: false,//海报图
			showGetPhone: false,//手机号绑定弹窗
			indicatorDots: false,
			autoplay: true,
			interval: 3000,
			duration: 1000,
			current: 0,//轮播图index
			goodsInfo: {},//商品信息
			auctionHistory: [],//出价记录
			storeInfo: {},//店铺信息
			helpList: [],//帮助条目
			postDate: {},//海报数据
			weixin: '',
            bailObj: {},//保障金充值信息
            isLogin:false,//是否登录态
            userInfo:{}
		}
    }
    //关闭授权手机号弹窗
    closeGetPhoneModel() {
		this.setState({
			showGetPhone: false
		})
    }
    //注册登录
    login(e){
        if (e.detail.errMsg === 'getUserInfo:ok') {
			this.setUserInfo(e.detail)
		}
    }
    setUserInfo(userInfo) {
		let token = Taro.getStorageSync('token');
		if (this.state.userInfo && !token) {
			Taro.setStorageSync("userInfo", userInfo)
			this.setState({
				userInfo: userInfo
			}, () => {
				if (!token) {
					this.setState({ showGetPhone: true })
				}
			})
		} 
    }
    loginSuccess(){
        const { id } = this.$router.params;
        let token = Taro.getStorageSync('token');
        if(token){
            this.setState( pre => {
                pre.isLogin = true
            })
        }else{
            this.setState( pre => {
                pre.isLogin = false
            })
        }
		this.GetGoodsDetail(id);
    }
    //获取个人中心
	GetCenter() {
		getCenter().then(res => {
			if (res.success) {
				this.setState(pre => {
					pre.userInfo = res;
					Taro.setStorageSync("userInfo", res)
				})
				setGlobalData('storeId', res.store_id)
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}
	//切换图片
	swiperImg(e) {
		this.setState(pre => {
			pre.current = e.detail.current;
		})
	}
	//预览轮播图
	previewImg() {
		let { goodsInfo, current } = this.state;
		let imgs = [];
		goodsInfo.cover_images.map(item => {
			imgs.push(IMG_BASE + item)
		})
		Taro.previewImage({
			current: IMG_BASE + goodsInfo.cover_images[current],
			urls: imgs
		})
	}
	//预展中关注
	showFollowPreView() {
		const { id } = this.state.goodsInfo;
		this.FocusOrDiscard(id)
		this.setState(pre => {
			pre.showFollowModel = true
			pre.goodsInfo.is_focus = true
		})
		let param = {
			action: 'wd_gerenxinxi click',
			action_desc: '点击个人信息',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	//预展中客服
	preServer() {
		this.setState({ showServiceModel: true })
	}
	//关注
	showFollowModel() {
		const { id } = this.state.goodsInfo;
		focusOrDiscard(id).then(res => {
			if (res.success) {
				if (res.is_focus) {
					this.setState(pre => {
						pre.showFollowModel = true;
						pre.goodsInfo.is_focus = true
					})
				} else {
					this.setState(pre => {
						pre.showFollowModel = false;
						pre.goodsInfo.is_focus = false
					})
				}
			}
		})
		let param = {
			action: 'ppxq_attention click',
			action_desc: '点击关注icon',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)

	}
	closeFollowModel() {
		this.setState({ showFollowModel: false })
	}
	//缴纳保障金
	showPayModel() {
		this.setState({ showBail: true })
	}
	closeBail() {
		this.setState({ showBail: false })
		const { id } = this.$router.params;
		this.GetGoodsDetail(id);
		//获取保障金余额
		this.getBail();
		this.state.timer = setInterval(() => {
			this.setState(pre => {
				pre.goodsInfo.count_down = strToTime(pre.goodsInfo.start_time, pre.goodsInfo.expires_time).time
			})
		}, 1000)
	}
	//客服
	server() {
		this.setState({ showServiceModel: true, showFollowModel: false, offerRecordModel: false, showBail: false, })
		let param = {
			action: 'ppxq_customerservice click',
			action_desc: '点击客服icon',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
	}
	closeServiceModel() {
		this.setState({ showServiceModel: false });
	}
	//分享
	ShareModel() {
		this.setState({ shareShow: true })
		let param = {
			action: 'ppxq_share click',
			action_desc: '点击分享'
		}
		mtLog(param)
	}
	closeShareModel() {
		this.setState({ shareShow: false })
	}
	// 点击分享海报
	poster(e) {
		this.setState({ shareShow: false, posterShow: true })
		let param = {
			action: 'ppxq_poster click',
			action_desc: '点击生成海报'
		}
		mtLog(param)
	}
	closePoster() {
		this.setState({ posterShow: false })
		let param = {
			action: 'ppxq_ closeposter click',
			action_desc: '点击关闭海报'
		}
		mtLog(param)
	}
	//出价记录
	offerRecord() {
		this.setState({ offerRecordModel: true })
		const { id } = this.$router.params;
		this.GetAuctionHistory(id);
		let param = {
			action: 'ppxq_record click',
			action_desc: '点击出价记录icon'
		}
		mtLog(param)
	}
	closeOfferRecordModel() {
		this.setState({ offerRecordModel: false })
	}
	//出价
	showOfferModel(e) {
		let param = {
			action: 'ppxq_bid click',
			action_desc: '点击出价按钮',
			arg1: !!Taro.getStorageSync('token')
		}
		mtLog(param)
		const { goodsInfo } = this.state;
		if (goodsInfo.has_auctioned) {
			if (goodsInfo.auction_is_first) {
				Taro.showToast({ icon: 'none', title: '出价优先' })
			} else {
				this.setState(pre => {
					pre.showOfferModel = true
					pre.showFollowModel = false
					pre.offerRecordModel = false
				})
			}
		} else {
			if (goodsInfo.bail_is_enough) {
				if (goodsInfo.auction_is_first) {
					Taro.showToast({ icon: 'none', title: '出价优先' })
				} else {
					this.setState(pre => {
						pre.showOfferModel = true
						pre.showFollowModel = false
						pre.offerRecordModel = false
					})
				}
			} else {
				this.setState({ showBail: true })
			}
		}
	}
	closeOfferModel(e) {
		this.setState({ showOfferModel: false })
	}
	closeGtPhoneModel() {
		//this.setState({getPhoneModel:false})
	}
	//去帮助
	goToHelp(id) {
		Taro.navigateTo({ url: `../help/index?id=${id}` })
    }
	componentWillMount() {
        const { id } = this.$router.params;
        let {goodsInfo} = this.state;
        let _this = this;
        //判断登录态
        let token = Taro.getStorageSync('token');
        if(token){
            this.setState( pre => {
                pre.isLogin = true
            })
        }else{
            this.setState( pre => {
                pre.isLogin = false
            })
        }
		//海报数据
		this.GetPosterInfo(id)
		this.GetGoodsDetail(id);
		//获取保障金余额
		this.getBail();
		this.GetIntro(id)
		this.GetHelp()
		this.state.timer = setInterval(() => {
			this.setState(pre => {
                pre.goodsInfo.count_down = strToTime(pre.goodsInfo.start_time, pre.goodsInfo.expires_time).time;
                pre.goodsInfo.status = strToTime(pre.goodsInfo.start_time, pre.goodsInfo.expires_time).status;
                if(pre.goodsInfo.status>2){
                    this.GetGoodsDetail(id);
                }
			})
        }, 1000)
        //websocket连接
        wx.connectSocket({
            url: WSS + 'wss',
        })
        wx.onSocketOpen(function () {
            //心跳
            _this.state.timer2 = setInterval(() => {
                wx.sendSocketMessage({ data: '心跳' })
            }, 20000);
            wx.onSocketMessage(function (r) {
                let data = JSON.parse(r.data);
                switch (data.type) {
                    case 'init':
                        socketGroup({ action: 'init', client_id: data.client_id, goods_id: goodsInfo.id, token: Taro.getStorageSync('token') })
                        break;
                    case 'heart':
                        //心跳
                        break;
                    case 'msg':
                        if (data.data.price) {
                            _this.setState(pre => {
                                pre.goodsInfo.price = data.data.price
                                pre.goodsInfo.scale = scale(data.data.price)
                                pre.goodsInfo.scaleStr = formatMoney(scale(data.data.price))
                            })
                        } else {
                            _this.setState(pre => {
                                pre.goodsInfo.auction_is_first = true;
                            })
                        }
                        if (!data.data.auction_is_first) {
                            _this.setState(pre => {
                                pre.goodsInfo.auction_is_first = false
                            })
                        }
                        break;
                }
            })
        })
		//存储拍品ID 
		if (typeof id == "string") {
			setGoodsIds(id)
		}
		//客服号
		this.setState(pre => {
			pre.weixin = Taro.getStorageSync('weixin')
		})
		staticRecord()
	}
	//进入店铺
	goToStore(id) {
        if(id == 0) return
		Taro.navigateTo({ url: `../sellerHomepage/index?id=${id}` })
	}
	//获取钱包余额
	getBail() {
		myWallet().then(res => {
			if (res.success) {
				this.setState(pre => {
					pre.bailObj.money = res.active_money
				})
			}
		})
	}
	//关注取消
	FocusOrDiscard(id) {
		focusOrDiscard(id).then(res => {
			if (res.success) {
			}
		})
	}
	//拍品信息
	GetGoodsDetail(id) {
		let _this = this;
		getGoodsDetail(id).then(res => {
			if (res.success) {
                if(res.store_id == 0){
                    this.GetProtocol({protocol_id:res.protocol_id})
                }else{
                    this.GetStore(res.store_id)
                }
				this.setState(pre => {
					pre.goodsInfo = res;
					pre.bailObj.bail = res.bail;
				})
			} else {
				Taro.showToast({ icon: 'none', title: '获取数据失败' })
			}
		})
	}
	//出价记录
	GetAuctionHistory(id) {
		getAuctionHistory(id).then(res => {
			if (res.success) {
				this.setState(pre => {
                    pre.auctionHistory = res.items;
                })
            }
        })
    }
    //获取店铺详情
    GetStore(storeId) {
        getStore(storeId).then(res => {
            if (res.success) {
                this.setState(pre => {
					pre.storeInfo = res
                })
            } else {
                Taro.showToast({ icon: 'none', title: '获取数据失败' })
            }
        })
    }
    //获取委托方信息
    GetProtocol(storeId) {
        getProtocol(storeId).then(res => {
            if (res.success) {
                this.setState(pre => {
                    pre.storeInfo = res
                })
            } else {
                Taro.showToast({ icon: 'none', title: '获取数据失败' })
            }
        })
    }
    //进入店铺
    goStore() {
		let { goodsInfo } = this.state
		if(goodsInfo.store_id==0){
			return
		}
        Taro.navigateTo({ url: `../sellerHomepage/index?id=${goodsInfo.store_id}` })
        let param = {
            action: 'ppxq_shop click',
            action_desc: '点击进入店铺'
        }
        mtLog(param)
    }
    //获取拍品介绍
    GetIntro(id) {
        getIntro(id).then(res => {
            if (res.success) {
                this.setState(pre => {
                    pre.desc = res.detail
                })
            } else {
                Taro.showToast({ icon: 'none', title: '获取数据失败' })
            }
        })
    }
    //获取帮助条目
    GetHelp() {
        getHelp().then(res => {
            if (res.success) {
                this.setState(pre => {
                    pre.helpList = res.items
                })
            } else {
                Taro.showToast({ icon: 'none', title: '获取数据失败' })
            }
        })
    }
    //海报数据
    GetPosterInfo(id){
        getPosterInfo(id).then( res => {
            if(res.success){
                this.setState( pre => {
                    pre.postDate = res
                })
            }else{
                Taro.showToast({icon:'none',title:'获取数据失败'})
            }
        })
     }
    componentWillUnmount () { 
        clearInterval(this.state.timer);
        clearInterval(this.state.timer2);
        wx.closeSocket()
      }
      componentDidHide(){
        clearInterval(this.state.timer2);
        wx.closeSocket()
      }
  render () {
    let {showGetPhone,userInfo,isLogin,bailObj,showBail,weixin,postDate,current,indicatorDots,autoplay,interval,duration,showServiceModel,showFollowModel,desc,offerRecordModel,shareShow,auctionHistory,storeInfo,helpList} = this.state;
    //拍品详情
    let {status,bail_is_enough,expires_time,status_desc,count_down,cover_images,name,max_reference_price,min_reference_price,price,bailStr,scaleStr,start_price,auction_is_first} = this.state.goodsInfo
    //富文本解析
    WxParse.wxParse("htmlStr", "html", desc, this.$scope, 5);
    const imgItem = cover_images.map((item) => {
        return <swiper-item key="this">
                    <Image mode='widthFit' src={IMG_BASE+item}/>
                </swiper-item>
    })
    let previewBtn = !bail_is_enough
       ?<View>
           <View onClick={this.preServer} className="left-btn">联系客服</View>
           <View onClick={this.showPayModel} className="right-btn">缴纳保证金</View>
        </View>
        :<View onClick={this.preServer} className={`right common-bg-status${status}`}>联系客服</View>
    return (
        <View className="page">
        <ScrollView scroll-y scroll-with-animation>
            <import src="../../utils/wxParse/wxParse.wxml"/>
            <View className="page-head">
                <Swiper className="swiper"
                    indicator-dots={indicatorDots}
                    autoplay={autoplay}
                    interval={interval}
                    duration={duration}
                    onChange={this.swiperImg}
                    onClick = {this.previewImg}
                    >
                    {imgItem}
                </Swiper>
                <View className="index">{(current + 1)+'/'+cover_images.length}</View>
                <View className="body-status">
                    <Text className={`status common-bg-status${status}`}>{status_desc[status]}</Text>
                    <Text className="time">
                     {count_down}</Text>
                </View>
                <View className="goods-info">
                    <View className="goods-name">
                        <View className="name">{name}</View>
                        <View onClick={this.ShareModel} className="share">
                            {status == 1 &&<Image src={require('../../static/images/share_yuzhan.png')}/>}
                            {status == 2 &&<Image src={require('../../static/images/share_paimai.png')}/>}
                            {status == 3 &&<Image src={require('../../static/images/share_yiwancheng.png')}/>}
                            {status == 4 &&<Image src={require('../../static/images/share_liupai.png')}/>}
                            <View>分享</View>
                        </View>
                    </View>
                    <View className="curPrice">
                        {status ==1?'起拍价':'当前价'}：
                        <Text className={`common-status${status}`}>¥{status==1?start_price:formatMoney(price)}</Text>
                    </View>
                    <View className="flex">
                        <View>参考价:¥{min_reference_price}～{max_reference_price}</View>
                        <View>图录号:{goodsInfo.image_number}</View>
                    </View>
                    <View className="flex marginL">
                        <View>保证金:¥{bailStr}</View>
                        <View>加价幅度:¥{scaleStr}</View>
                    </View>
                </View>
            </View>
            <View className="introduce">店铺介绍</View>
            <View className="store">
                <Image className="image" src={IMG_BASE+storeInfo.avatar}/>
                <View className="detail">
                    <View className="name">{storeInfo.name}</View>
                    <View className="number">在售件数：{storeInfo.selling_count}件 成交数：{storeInfo.done_count}件</View>
                </View>
                {goodsInfo.store_id !=0 && <View className="goStore" onClick={this.goStore}>进入店铺
                    <Image src={rightIcon}/>
                </View>}
            </View>
            <View className="introduce">拍品介绍</View>
            <View className="goods-info-desc">
              {desc !='' && <template is="wxParse" data="{{wxParseData:htmlStr.nodes}}"></template>}
            </View>
            <View className="introduce">帮助中心</View>
            {
                helpList.map((item) => {
                   return <View onClick={this.goToHelp.bind(this,item.id)} className="role">
                        {item.name}
                        <Image src={rightIcon}/>
                    </View>
                })
            }
            <View className="margin-bottom"></View>
        </ScrollView>
        { isLogin 
        ?<View>
        {   status == 1 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                {  goodsInfo.is_focus
                  ? previewBtn
                  :<View onClick={this.showFollowPreView} className={`right common-bg-status${status}`}>关注拍品</View>
                }
            </View>
        }
        {
            status == 2 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <View onClick={this.showFollowModel} className="left">
                    { !goodsInfo.is_focus
                      ?<Image src={require('../../static/images/meiguanzhu.png')}/>
                      :<Image src={require('../../static/images/guanzhu.png')}/>
                    }
                    <View>关注</View>
                </View>
                <View onClick={this.server} className="left">
                    <Image src={require('../../static/images/kefu.png')}/>
                    <View>客服</View>
                </View>
                <View onClick={this.offerRecord} className="left">
                    <Image src={require('../../static/images/chujiajilu.png')}/>
                    <View>出价记录</View>
                </View>
                <View onClick={this.showOfferModel} className={`right common-bg-status${status}`}>{auction_is_first?'出价优先':'出价'}</View>
            </View>
        }
        {
            status == 3 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <View onClick={this.showFollowModel} className="left">
                    { !goodsInfo.is_focus
                      ?<Image src={require('../../static/images/meiguanzhu.png')}/>
                      :<Image src={require('../../static/images/guanzhu.png')}/>
                    }
                    <View>关注</View>
                </View>
                <View onClick={this.server} className="left">
                    <Image src={require('../../static/images/kefu.png')}/>
                    <View>客服</View>
                </View>
                <View onClick={this.offerRecord} className="left">
                    <Image src={require('../../static/images/chujiajilu.png')}/>
                    <View>出价记录</View>
                </View>
                <View className={`right common-bg-status${status}`}>已成交</View>
            </View>
        }
        {
            status == 4 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <View onClick={this.showFollowModel} className="left">
                    { !goodsInfo.is_focus
                      ?<Image src={require('../../static/images/meiguanzhu.png')}/>
                      :<Image src={require('../../static/images/guanzhu.png')}/>
                    }
                    <View>关注</View>
                </View>
                <View onClick={this.server} className="left">
                    <Image src={require('../../static/images/kefu.png')}/>
                    <View>客服</View>
                </View>
                <View className={`right common-bg-status${status}`}>已流拍</View>
            </View>
        }
        </View>
        :<View>
        {   status == 1 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className={`right common-bg-status${status}`}>关注拍品</Button>
            </View>
        }
        {
            status == 2 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className="left">
                    { !goodsInfo.is_focus
                      ?<Image src={require('../../static/images/meiguanzhu.png')}/>
                      :<Image src={require('../../static/images/guanzhu.png')}/>
                    }
                    <View>关注</View>
                </Button>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className="left">
                    <Image src={require('../../static/images/kefu.png')}/>
                    <View>客服</View>
                </Button>
                <View onClick={this.offerRecord} className="left">
                    <Image src={require('../../static/images/chujiajilu.png')}/>
                    <View>出价记录</View>
                </View>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className={`right common-bg-status${status}`}>出价</Button>
            </View>
        }
        {
            status == 3 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className="left">
                    { !goodsInfo.is_focus
                      ?<Image src={require('../../static/images/meiguanzhu.png')}/>
                      :<Image src={require('../../static/images/guanzhu.png')}/>
                    }
                    <View>关注</View>
                </Button>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className="left">
                    <Image src={require('../../static/images/kefu.png')}/>
                    <View>客服</View>
                </Button>
                <View onClick={this.offerRecord} className="left">
                    <Image src={require('../../static/images/chujiajilu.png')}/>
                    <View>出价记录</View>
                </View>
                <View className={`right common-bg-status${status}`}>已成交</View>
            </View>
        }
        {
            status == 4 &&
            <View className={`bottom ${getGlobalData('phoneModel')?'bottom-phone':''}`}>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className="left">
                    { !goodsInfo.is_focus
                      ?<Image src={require('../../static/images/meiguanzhu.png')}/>
                      :<Image src={require('../../static/images/guanzhu.png')}/>
                    }
                    <View>关注</View>
                </Button>
                <Button open-type="getUserInfo" onGetUserInfo={this.login} className="left">
                    <Image src={require('../../static/images/kefu.png')}/>
                    <View>客服</View>
                </Button>
                <View className={`right common-bg-status${status}`}>已流拍</View>
            </View>
        }
        </View>
        }
        {/* 自定义组件 */}
        <ServiceModel weixin={weixin} onCloseServiceModel={this.closeServiceModel} show={showServiceModel}></ServiceModel>
        <OfferModel goodsInfo={this.state.goodsInfo} onCloseOfferModel={this.closeOfferModel} show={showOfferModel}></OfferModel>
        <FollowModel onCloseFollowModel={this.closeFollowModel} show={showFollowModel} timeStr={formatDate(expires_time)}></FollowModel>
        <RecordModel auctionHistory={auctionHistory} goodsInfo={this.state.goodsInfo} onCloseOfferRecordModel={this.closeOfferRecordModel} show={offerRecordModel}></RecordModel>
        <Share onCloseShareModel={this.closeShareModel} show={shareShow} postDate={postDate}></Share>
        <PayModel onContactService={this.server} onCloseBail={this.closeBail} show={showBail} bailObj={bailObj}></PayModel>
        <GetPhone userInfo={userInfo} onCloseGetPhoneModel={this.closeGetPhoneModel} onLoginSuccess={this.loginSuccess} showGetPhone={showGetPhone}></GetPhone>
    </View>
    )
  }
}

