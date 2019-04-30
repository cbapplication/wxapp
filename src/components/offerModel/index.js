import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.css'
import closeIcom from "../../static/images/rightIcon.png"
import jian from "../../static/images/jian.png"
import jia from "../../static/images/jia.png"
import Alert from '../alert/index'
import { formatMoney, scale, mtLog } from '../../utils/funs'
import { auction } from '../../api/goods'
import {IMG_BASE} from '../../utils/const'
export default class offerModel extends Taro.Component {
	static defaultProps = {
		show: false,
	}
	state = {
		priceScale: 0,
	}
	close() {
		this.props.onCloseOfferModel();
	}
	offer() {
		const { goodsInfo } = this.props;
		let _this = this;
		if(this.props.show){
			if(goodsInfo.is_bidden){
				if(this.state.priceScale == 0){
					   this.setState( pre => {
						   pre.priceScale =  scale(Math.floor(goodsInfo.price));
						   _this.Auction({ goods_id: goodsInfo.id, money: pre.priceScale })
					   })
				}else{
				   this.setState( pre => {
					   pre.priceScale = pre.priceScale + scale(Math.floor(goodsInfo.price));
					   _this.Auction({ goods_id: goodsInfo.id, money: pre.priceScale })
				   })
				}
			   }else{
				if(goodsInfo.start_price_num == 0){
					if(this.state.priceScale == 0){
					   this.setState( pre => {
						   pre.priceScale = 100;
						   _this.Auction({ goods_id: goodsInfo.id, money: pre.priceScale })
					   })
					}else{
					   this.setState( pre => {
						   pre.priceScale = pre.priceScale+100 ;
						   _this.Auction({ goods_id: goodsInfo.id, money: pre.priceScale })
					   })
					}
				}else{
				   if(this.state.priceScale == 0){
					   this.setState( pre => {
						   pre.priceScale = 0;
						   _this.Auction({ goods_id: goodsInfo.id, money: pre.priceScale })
					   })
					}else{
					   this.setState( pre => {
						   pre.priceScale = pre.priceScale;
						   _this.Auction({ goods_id: goodsInfo.id, money: pre.priceScale })
					   })
					}
				}
			   }
		}
	}
	reduce() {
		const { goodsInfo } = this.props;
		if(goodsInfo.is_bidden){
			if (this.state.priceScale > 0)
			{return (
				this.setState(pre => {
					pre.priceScale = pre.priceScale - scale(Math.floor(goodsInfo.price) + pre.priceScale)
				})
			)}
		}else{
			if (this.state.priceScale >= 0)
			{return (
				this.setState(pre => {
					pre.priceScale = pre.priceScale - scale(Math.floor(goodsInfo.price) + pre.priceScale)
				})
			)}
		}

	}
	add() {
		const { goodsInfo } = this.props;
		this.setState(pre => {
			pre.priceScale =  (pre.priceScale) + scale(Math.floor(goodsInfo.price)+pre.priceScale);
		})
	}
	//出价
	Auction(params) {
		auction(params).then(res => {
			if (res.success) {
				Taro.showToast({ icon: 'none', title: '出价成功' })
				this.props.onCloseOfferModel();
			}
		})
	}
	componentDidShow() {
		let param = {
			action: 'ppxq_popup_bid click',
			action_desc: '出价弹窗',
		}
		mtLog(param)
	}
	render() {
    const goodsInfo = this.props.goodsInfo || {};
		const { priceScale } = this.state;
		let firstScale = goodsInfo.is_bidden? formatMoney(scale(Math.floor(goodsInfo.price))): 0
		return (
			<View className="page">
				<View onClick={this.close} className={this.props.show ? 'box' : ''} catchtouchmove="preventD"></View>
				<View className={`model ${this.props.show ? '' : 'hidden'}`} catchtouchmove="preventD">
					<View onClick={this.close} className="model-close">
						<Image src={closeIcom} />
					</View>
					<View className="model-title">
					    <Image src={IMG_BASE+goodsInfo.cover_images[0]}/>
						<View className="model-goodsInfo">
							<View className="model-goodName">{goodsInfo.name}</View>
							<View className="model-goodPrice">当前价：<Text>￥{formatMoney(goodsInfo.price)}</Text></View>
							<View className="model-range">加价幅度:￥{formatMoney(scale(Math.floor(goodsInfo.price) + priceScale))}</View>
							<View className="model-range">{goodsInfo.count_down} </View>
						</View>
					</View>
					<View className="model-num">
						<Image onClick={this.reduce} src={jian} />
						<View>¥{priceScale == 0 
							?firstScale
							:formatMoney(scale(Math.floor(goodsInfo.price)+priceScale)+priceScale)}</View>
						<Image onClick={this.add} src={jia} />
					</View>
					<View className="model-tip">
						{priceScale != 0 ? "即将出价金额为￥"  + formatMoney(Math.floor(goodsInfo.price)+priceScale+scale(Math.floor(goodsInfo.price)+priceScale)) : "按“+”“-”可以调整加价金额哦"}
					</View>
					<View onClick={this.offer} className="model-btn">
						出价
            </View>
				</View>

			</View>
		)
	}
}