import Taro from '@tarojs/taro'
import {
	BASE
} from './const'
import {
	set as setGlobalData,
	get as getGlobalData
} from '../globalData'
import {
	tip,
	setUserInfo
} from './funs'
import ajax from './ajax'
/**
 * params参数只有code时只获取用户token，否则获取用户openId 和token
 * @param {*} params 
 * @param {*} success 
 * @param {*} fail 
 */
function wxLogin(params) {
	return ajax.post('/index/auth/wxLogin', params, "application/json")
}
//未绑定过手机号注册
function noPhoneGetToken(params) {
	return ajax.post('/index/auth/bindMobile', params, "application/json")
}
//绑定过手机号注册
function hasPhoneGetToken(params) {
	return ajax.get('/index/auth/authorizeMobile', params, "application/json")
}
function getNumber(params) {
	return ajax.post(`/index/auth/getEncryptedData`, params)
}
/**
 * 用户登录
 */
function login() {
	Taro.checkSession({
		success (res) {
			//未过期
		},
		fail(err){
			Taro.login()
			.then(res => {
				wxLogin({
					code: res.code
				}).then(res => {
					if (res.data.errcode == 0) {
						let data = {}
						if (res.data.data) {
							data = res.data.data
						}
						Taro.setStorageSync('mobile', data.mobile)
						Taro.setStorageSync('token', data.token)
						Taro.setStorageSync('user_id',data.user_id)
					}
				})
			})
		}
	})
}

function getUserInfo(params, success, fail) {
	Taro.getUserInfo()
		.then(res1 => {
			let data = {}
			data.user_id = params.user_id
			data.rawData = res1.rawData
			data.mobile = params.phone
			data.verify_code = params.authCode
			if (params.authCode) {
				noPhoneGetToken(data).then(res => {
					if (res.data.errcode == 1004) {
						tip("该手机号已被注册")
					} else {
						Taro.setStorageSync('token', res.data.data.token)
						tip('注册成功')
						success && success()
					}
				}).catch(res => fail && fail())
			} else {
				hasPhoneGetToken(data).then(res => {
					if (res.data.errcode == 1004) {
						tip("该手机号已被注册")
					} else {
						Taro.setStorageSync('token', res.data.data.token)
						tip('登录成功')
						success && success()
					}
				}).catch(res => fail && fail())
			}
		})
}
/**
 * 用户注册
 */
// phone, authCode = ''
function register(params, success, fail) {
	params.user_id = Taro.getStorageSync('user_id') || '' 
	return getUserInfo(params, success, fail).then(res => success && success(res)).catch( err=>fail && fail(err))
}

/**
 * 获取用户手机号
 */
function getPhone(params, success,fail) {
	params.user_id = Taro.getStorageSync('user_id') || ''
	return getNumber(params, success, fail).then(res => success && success(res)).catch( err=>fail && fail(err))
}

module.exports = {
	noPhoneGetToken,
	login,
	register,
	getPhone
}