import Taro, { Component } from '@tarojs/taro'
import { View, Textarea, Image, Input, ScrollView, Text, Switch, Picker } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import clear from "../../static/images/shanchu.png"
import rightIcon from "../../static/images/rightIcon.png"
import { checkPhone } from '../../utils/funs'
import { staticRecord } from '../../api/index'

import './index.less'
import { addAddress, editAddress } from '../../api/user'
export default class order extends Taro.Component {

	config = {
		navigationBarTitleText: '地址管理',
	}
	constructor(props) {
		super(props)
		this.state = {
			isSuccess: false,
			consignee: "",//收货人
			phone: "",//电话
			region: [],
			code: [],//省市区代码
			address: '',//详细地址
			is_default: false,//是否为默认地址
			editAddress: { isEdit: false }
		}
	}

	//收货人姓名
	getConsignee(e) {
		let { value } = e.detail;
		this.setState((pre) => {
			pre.consignee = value;
		})
	}
	clearName() {
		this.setState((pre) => {
			pre.consignee = '';
		})
	}
	//收货人电话
	getPhone(e) {
		let { value } = e.detail;
		this.setState((pre) => {
			pre.phone = value;
		})
	}
	clearPhone() {
		this.setState((pre) => {
			pre.phone = '';
		})
	}
	//地址
	regionChange(e) {
		console.log(e)
		this.setState((pre) => {
			pre.region = e.detail.value;
			pre.code = e.detail.code
		})
	}
	//详细地址
	getDetail(e) {
		let { value } = e.detail;
		this.setState((pre) => {
			pre.address = value;
		})
	}
	//设置默认
	setDefault(e) {
		let { value } = e.detail;
		this.setState((pre) => {
			pre.is_default = value;
		})
	}

	componentWillMount() {
		let editAddress = JSON.parse(this.$router.params.editAddress)
		if (editAddress.isEdit) {
			this.setState(pre => {
				pre.id = editAddress.curData.id;
				pre.consignee = editAddress.curData.accept_man;
				pre.phone = editAddress.curData.accept_phone;
				pre.address = editAddress.curData.address;
				pre.region = editAddress.curData.region;
				pre.code = editAddress.curData.code;
				pre.is_default = editAddress.curData.is_default;
				pre.editAddress.isEdit = editAddress.isEdit;
			})
		}
	}
	componentDidShow() {
		staticRecord()
	}

	//保存
	save() {
		let { consignee, phone, address, code, region, is_default, id, editAddress, isSuccess } = this.state;
		checkPhone(this.state.phone);
		let params = {}
		if (!isSuccess) {
			this.setState({
				isSuccess: true
			})
			Taro.showLoading()
			if (editAddress.isEdit) {
				params = {
					id: id,
					accept_man: consignee,
					accept_phone: phone,
					address: address,
					province_id: code[0],
					province_name: region[0],
					city_id: code[1],
					city_name: region[1],
					area_id: code[2],
					area_name: region[2],
					is_default: is_default
				}
				this.EditAddress(params)
			} else {
				params = {
					accept_man: consignee,
					accept_phone: phone,
					address: address,
					province_id: code[0],
					province_name: region[0],
					city_id: code[1],
					city_name: region[1],
					area_id: code[2],
					area_name: region[2],
					is_default: is_default
				}
				this.AddAddress(params)
			}
		}
	}
	//添加地址
	AddAddress(params) {
		addAddress(params).then(res => {
			if (res.success) {
				Taro.navigateBack()
			} else {
				Taro.showToast({ icon: 'none', title: '添加失败' })
			}
			Taro.hideLoading()
			this.setState({
				isSuccess: false
			})
		})
	}
	//编辑地址
	EditAddress(params) {
		editAddress(params).then(res => {
			if (res.success) {
				Taro.navigateBack()
			} else {
				Taro.showToast({ icon: 'none', title: '编辑失败' })
			}
			Taro.hideLoading()
			this.setState({
				isSuccess: false
			})
		})
	}
	render() {
		const { consignee, phone, region, address, is_default } = this.state;

		return (
			<View className="page">
				<ScrollView scroll-y scroll-with-animation className={`address-list ${getGlobalData('phoneModel') ? 'address-list-phone' : ''}`}>
					<View className="edit-input">
						<Input onInput={this.getConsignee} type="text" value={consignee} placeholder="请输入收货人姓名" />
						{consignee.length > 0 && <Image onClick={this.clearName} src={clear} />}
					</View>
					<View className="edit-input">
						<Input onInput={this.getPhone} type="number" maxLength="11" value={phone} placeholder="请输入联系人电话" />
						{phone.length > 0 && <Image onClick={this.clearPhone} src={clear} />}
					</View>
					<Picker mode="region" className='picker' onChange={this.regionChange} value={region}>
						<View className="edit-input">
							{region.length !== 0
								? <View className="input">
									{region[0]} {region[0] == region[1] ? '' : region[1]} {region[2]}
								</View>
								: <View className="input">请选择所在地区</View>}
							<Image src={rightIcon} />
						</View>
					</Picker>
					<View className="edit-textarea">
						<Textarea onInput={this.getDetail} value={address} auto-height='true' maxLength='200' type="text" placeholder="详细地址：如道路、小区、门牌号等"></Textarea>
					</View>
					<View className="edit-default">
						<Text>设为默认地址</Text>
						<Switch className="edit-switch" checked={is_default} onChange={this.setDefault} color="#ffc233" />
					</View>
				</ScrollView>
				<View className={`address-bottom ${getGlobalData('phoneModel') ? 'address-bottom-phone' : ''}`}>
					<View onClick={this.save}>保存</View>
				</View>
			</View>
		)
	}
}

