import ajax from '../utils/ajax';
import Taro, { Component } from '@tarojs/taro'
import { IMG_BASE } from '../utils/const'
import { formatMoney, formatMoney2, formatDate } from '../utils/funs'
//个人中心信息
var getCenter = function () {
	const data = ajax.get(`index/user/center`)
	return data.then(r => {
		if (r && r.data && r.data.data) {
			return {
				"success": r.data.errcode == 0,
				"nick_name": r.data.data.nick_name,
				"avatar": r.data.data.avatar.indexOf("https") == -1 ? IMG_BASE + r.data.data.avatar : r.data.data.avatar,
				"order_num": r.data.data.order_num,
				"auction_num": r.data.data.auction_num,
				"servant_weixi": r.data.data.servant_weixi,
				"store_id": r.data.data.store_id
			}
		} else {
			return data.then(r => ({
				"success": r.data.errcode == 0,
				"nick_name": '',
				"avatar": '',
				"order_num": '',
				"auction_num": '',
				"servant_weixi": '',
				"store_id": ''
			}))
		}
	})
}
//个人资料
var getMyInfo = function () {
	const data = ajax.get(`index/user/myInfo`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			"avatar": r.data && r.data.data && (r.data.data.avatar.indexOf("https") == -1 ? IMG_BASE + r.data.data.avatar : r.data.data.avatar),
			"nickname": data.nickname,
			"gender": data.gender,
			"gender_desc": data.gender_desc,
			"birthday": data.birthday,
			"mobile": data.mobile
		}
	})
}
/**
 * 修改昵称
 * @param {*} params 
 * @nickname {*} 姓名
 */
var editNickName = function (params) {
	const data = ajax.post(`index/user/editNickName`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 修改性别
 * @param {*} params 
 * @gerder {*} 性别
 */
var editGender = function (params) {
	const data = ajax.post(`index/user/editGender`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 修改生日
 * @param {*} params 
 * @birthday {*} 生日
 */
var editBirthday = function (params) {
	const data = ajax.post(`index/user/editBirthday`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 验证原手机号
 * @param {*} params 
 * @mobile {*} 手机号
 * @verify_code {*} 售价验证码
 */
var confirmMobile = function (params) {
	const data = ajax.post(`index/user/confirmMobile`, params)
	return data.then(r => ({
		"success": r.data.msg == "手机号验证通过，可以执行下一步操作",
	}))
}
/**
 * 修改手机号
 * @param {*} params
 * @mobile {*} 手机号
 * @verify_code {*} 售价验证码
 */
var editMobile = function (params) {
	const data = ajax.post(`index/user/editMobile`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 我的钱包
 */
var myWallet = function () {
	const data = ajax.get(`index/user/myWallet`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			"money": formatMoney(data.money),
			"locked_money": formatMoney(data.locked_money),
			"active_money": (data.active_money),
			"percent": ((data.active_money) / data.money) * 100
		}
	})
}
/**
 * 获取微信客服号
 */
var getServantWeixin = function () {
	const data = ajax.get(`index/user/getServantWeixin`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			"weixin": data.weixin
		}
	})
}
/**
 * 获取用户关注拍品
 */
var getFocusGoods = function (page) {
	const data = ajax.get(`index/user/getFocusGoods?page=${page}`)
	return data.then(r => ({
		"success": r.data.errcode == 0,
		"items": (r.data.data || []).map(o => ({
			"id": o.id,
			"name": o.name,
			"cover_image": IMG_BASE + o.cover_image,
			"min_reference_price": formatMoney2(o.min_reference_price),
			"max_reference_price": formatMoney2(o.max_reference_price),
			"status": o.status,
			"start_price": formatMoney(o.start_price),
			"price": formatMoney(o.price),
			"status_map": o.status_map,
			"start_time": o.start_time,
			"expires_time": o.expires_time,
			"begin_count_down": o.begin_count_down,
			"begin_count_down_second": o.begin_count_down_second,
			"end_count_down": o.end_count_down,
			"end_count_down_second": o.end_count_down_second,
			"count_down": '距离结束'//倒计时时间
		}))
	}))
}
/**
 * 帮助中心
 */
var help = function () {
	const data = ajax.get(`index/user/help`)
	return data.then(r => ({
		"success": r.data.errcode == 0,
		"items": (r.data.data || []).map(o => ({
			"id": o.id,
			"name": o.name,
			"content": o.content
		}))
	}))
}

/**
 * 获取用户关注的店铺
 * @param {分页} page 
 */
var getFocusStore = function (page) {
	const data = ajax.get(`index/user/getFocusStore?page=${page}`)
	return data.then(r => ({
		"success": r.data.errcode == 0,
		"items": (r.data.data || []).map(o => ({
			"id": o.id,
			"name": o.name,
			"avatar": IMG_BASE + o.avatar,
			"selling_goods_count": o.selling_goods_count,
			"recommend_goods_img": o.recommend_goods_img
		}))
	}))
}
/**
 * 获取用户浏览历史
 * @param {拍品ID的数组} goods_ids 
 */
var browseHistory = function (page) {
	const goods_ids = Taro.getStorageSync("goodsIds") || [];
	const data = ajax.post(`index/user/browseHistory?`, { goods_ids: goods_ids, page, page })
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			"items": (data.data || []).map(o => ({
				"cover_image": IMG_BASE + o.cover_image,
				"id": o.id,
				"name": o.name,
				"start_price": formatMoney(o.start_price),
				"price": formatMoney(o.price),
				"status": o.status,
				"status_map": o.status_map,
				"min_reference_price": formatMoney2(o.min_reference_price),
				"max_reference_price": formatMoney2(o.max_reference_price),
				"start_time": o.start_time,
				"expires_time": o.expires_time,
				"count_down": '距离结束'//倒计时时间
			}))
		}
	})
}
/**
 * 获取收货地址列表
 * @param {*} token 
 */
var getAddress = function (params) {
	const data = ajax.get(`index/user/address`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
		"data": r.data.data
	}))
}
/**
 * 添加收货地址
 * @param {*} accept_man 
 * @param {*} accept_phone 
 * @param {*} address 
 * @param {*} province_id 
 * @param {*} province_name 
 * @param {*} city_id 
 * @param {*} city_name 
 * @param {*} area_id 
 * @param {*} area_name 
 * @param {*} is_default
 */
var addAddress = function (params) {
	const data = ajax.post(`index/user/addAddress`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 删除地址
 * @param {*} id
 */
var delAddress = function (params) {
	const data = ajax.post(`index/user/delAddress`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 编辑收货地址
 * @param {*} id
 * @param {*} accept_man 
 * @param {*} accept_phone 
 * @param {*} address 
 * @param {*} province_id 
 * @param {*} province_name 
 * @param {*} city_id 
 * @param {*} city_name 
 * @param {*} area_id 
 * @param {*} area_name 
 * @param {*} is_default
 */
var editAddress = function (params) {
	const data = ajax.post(`index/user/editAddress`, params)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}
/**
 * 获取验证码(申请店铺)
 */
var getCode = function (param) {
	const data = ajax.get(`index/user/getCode`, param)
	return data.then(r => ({
		'errcode': r.data.errcode,
		'msg': r.data.msg
	}))
}
/**
 *  获取我的订单数
 */
var orderNum = function () {
	const data = ajax.get(`index/user/orderNum`, param)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			'order_num': data.order_num
		}
	})
}

/**
 * 获取我的订单列表
 * @param {分页} page 
 */
var orderList = function (page) {
	const data = ajax.get(`index/user/orderList?page=${page}`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			"items": (data.data || []).map(o => ({
				"id": o.id,
				"goods_name": o.goods_list.name,
				"cover_images": o.goods_list.cover_image,
				"order_number": o.order_number,
				"ctime": formatDate(o.ctime),
				"status": o.status,
				"status_map": o.status_map,
				"deal_price": formatMoney(o.deal_price),
				"service_charge": formatMoney(o.service_charge),
				"total_price": formatMoney(o.total_price)
			}))
		}
	})
}
/*
 * 获取经营范围类目
 */
var getStoreScope = function () {
	const data = ajax.get('index/user/getAllClassifyInfo')
	return data.then(r => ({
		'data': r.data.data
	}))
}
/**
 * 申请店铺
 */
var applyStore = function (params) {
	const data = ajax.post(`index/user/applyStore`, params)
	return data.then(r => ({
		success: r.data.errcode,
		msg: r.data.msg
	}))
}
/**
 * 判断当前用户是否为卖家
 */
var judegSeller = function () {
	const data = ajax.post(`index/user/isSeller`)
	return data.then(r => ({
		data: r.data.data
	}))
}
/**
 * 店铺审核状态
 */
var judegStoreStatus = function (params) {
	const data = ajax.post(`index/user/AppliedStoreStatus`, params)
	return data.then(r => ({
		data: r.data
	}))
}
/**
 * 身份认证状态
 */
var judegIdStatus = function (params) {
	const data = ajax.get(`index/store/authrizeStatus`, params)
	return data.then(r => ({
		data: r.data
	}))
}
/**
 * 校验手机验证码是否正确
 */
var judgeVerifyCode = function (params) {
	const data = ajax.post(`index/user/checkVerifyCode`, params)
	return data.then(r => ({
		data: r.data
	}))
}
/**
 * 验证身份证
 */
var judgeId = function (params) {
	const data = ajax.post(`index/user/identityStore`, params)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			success: r.data.errcode == 0,
			msg:r.data.msg,
			id: data.store_id
		}
	})
}
/**
 * 我的竞拍
 * @param {分页} page 
 */
var auctionList = function (page) {
	const data = ajax.get(`index/user/auctionList?page=${page}`)
	return data.then(r => ({
		"success": r.data.errcode == 0,
		"items": (r.data.data || []).map(o => ({
			"id": o.id,
			"cover_image": IMG_BASE + o.cover_image,
			"name": o.name,
			"cover_image": IMG_BASE + o.cover_image,
			"price": formatMoney(o.price),
			"min_reference_price": formatMoney2(o.min_reference_price),
			"max_reference_price": formatMoney2(o.max_reference_price),
			"start_time": o.start_time,
			"expires_time": o.expires_time,
			"auction_is_first": o.auction_is_first == 1,
			"count_down": '距离结束'//倒计时时间
		}))
	}))
}
/**
 * 提现
 * @param {money} params 
 */
var cash = function (params) {
	const data = ajax.post(`index/user/cash`, params)
	return data.then(r => ({
		success: r.data.errcode == 0
	}))
}
/**
 * 账户明细
 * @param {分页} page 
 */
var myWalletRecord = function (page, time) {
	const data = ajax.get(`index/user/myWalletRecord?page=${page}&time=${time}`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			"success": r.data.errcode == 0,
			"total_expense": formatMoney(data.total_expense) || '0.00',
			"total_income": formatMoney(data.total_income) || '0.00',
			"items": (data.list || []).map(o => ({
				ctime: formatDate(o.ctime),
				id: o.id,
				money: formatMoney(String(o.money)),
				reason: o.reason,
				status: o.status,
				type: o.type,
				status_map: data.status_map,
				reason_map: data.reason_map,
				type_map: data.type_map
			}))
		}
	})
}
/**
 * 获取记录详情
 * @param {记录ID} id 
 */
var walletRecordDetail = function (id) {
	const data = ajax.get(`index/user/walletRecordDetail?id=${id}`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			success: r.data.errcode == 0,
			classify: data.classify,
			record_number: data.record_number,
			ctime: formatDate(data.ctime),
			money: formatMoney(data.money),
			status: data.status,
			type: data.type
		}
	})
}
module.exports = {
	getCenter,
	getMyInfo,
	editNickName,
	confirmMobile,
	editMobile,
	myWallet,
	editGender,
	editBirthday,
	getServantWeixin,
	getFocusGoods,
	help,
	getFocusStore,
	browseHistory,
	getAddress,
	addAddress,
	delAddress,
	getCode,
	editAddress,
	getStoreScope,
	applyStore,
	judegSeller,
	judegStoreStatus,
	judegIdStatus,
	judgeVerifyCode,
	judgeId,
	orderNum,
	orderList,
	auctionList,
	cash,
	myWalletRecord,
	walletRecordDetail
}



