import Taro from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import close from "../../static/images/close.png"
import auth from '../../utils/auth'
import { BASE } from '../../utils/const'
import { getCode } from '../../api/common'
import { mtLog } from '../../utils/funs'
import './index.css'
export default class login extends Taro.Component {
	config = {
		navigationBarBackgroundColor: 'black',
	}
	static defaultProps = {
	}
	constructor(props) {
		super(props)
		this.state = {
			btntext: '获取验证码',
			phone: "",
			code: "",
		}
	}

	phone(e) {
		this.setState(pre => {
			pre.phone = e.detail.value
		})
	}
	code(e) {
		this.setState(pre => {
			pre.code = e.detail.value
		})
	}
	getCode() {
		let _this = this;
		let coden = 60// 定义60秒的倒计时
		let tel = this.state.phone
		if (true && this.state.btntext == '获取验证码' && this.checkPhone(this.state.phone)) {
			this.checkPhone(this.state.phone)
			let codeV = setInterval(function () {
				_this.setState(pre => {
					pre.btntext = (coden--) + 's后重新发送'
				})
				if (coden == -1) {
					clearInterval(codeV)
					_this.setState(pre => {
						pre.btntext = '获取验证码'
					})
				}
			}, 1000)
			getCode(tel).then(res => { console.log(res) })
		}
	}
	handclose() {
		this.props.onCloseLoginModel()
	}
	login() {
		let phone = this.state.phone
		let code = this.state.code
		let _this=this
		let param = {
			action: 'dl_qtsjh_shoujihaodenglu click',
			action_desc: '点击登录'
		}
		mtLog(param)

		if (phone && code) {
			auth.register({
				phone: phone,
				authCode: code
			}).then(res=>{
				_this.handclose()
			})
		} else if (!phone) {
			Taro.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
		} else {
			Taro.showToast({
				title: '请输入验证码',
				icon: 'none'
			})
		}
	}
	checkPhone(phone) {
		if (!(/^1[34578]\d{9}$/.test(phone))) {
			Taro.showToast({
				title: '手机号有误',
				icon: 'none',
				duration: 2000
			})
			return false;
		}
		return true
	}
	componentWillMount() { }

	render() {
		let { show } = this.props
		return (
			<View className={`page ${show ? 'show' : 'hidden'}`}>
				<View onClick={this.handclose} className={show ? 'box' : ''} catchtouchmove="preventD"></View>
				<View className={`modal ${show ? '' : 'model-hidden'}`} catchtouchmove="preventD">
					<View className="modal-title">
						<View>手机号登录</View>
						<Image onClick={this.handclose} src={close} />
					</View>
					<View className="modal-phone">
						<Input onInput={this.phone} type="number" maxlength="11" placeholder="请输入手机号"></Input>
					</View>
					<View className="modal-Code">
						<Input onInput={this.code} className="code" type="number" maxlength="6" placeholder="请输入验证码"></Input>
						<View className="btn" onClick={this.getCode}>{btntext}</View>
					</View>
					<View className="modal-read">登录即代表同意<Text>茗探平台拍卖协议</Text></View>
					<View onClick={this.login} className="modal-btn">登录</View>
				</View>
			</View>
		)
	}
}