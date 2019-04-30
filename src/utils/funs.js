import Taro from '@tarojs/taro'
import { set as setGlobalData, get as getGlobalData } from '../globalData'
import { BASE, USER_INFO } from './const'
import { mtLogRecord } from '../api/admin'
//检查手机号
function checkPhone(phone) {
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
//价格转换格式
function formatMoney(s, type = 0) {
	if (/[^0-9\.]/.test(s))
		return "0";
	if (s == null || s == "")
		return "0";
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");
	if (type == 0) {
		var a = s.split(".");
		if (a[1] == "00") {
			s = a[0];
		}
	}
	return s;
}
//价格转换=>万
function formatMoney2(str) {
	if (parseInt(str) < 10000) {
		return formatMoney(str)
	}
	return (str / 10000).toFixed(1) + '万'
}
//时间转换函数  
function formatDate(sec) {
	let t = sec ? new Date(sec * 1000) : new Date();
	let year = t.getFullYear();
	let month = t.getMonth() + 1;
	month = month < 10 ? '0' + month : month;
	let date = t.getDate();
	date = date < 10 ? '0' + date : date;
	let hour = t.getHours()
	hour = hour < 10 ? '0' + hour : hour;
	let minute = t.getMinutes()
	minute = minute < 10 ? '0' + minute : minute;
	let second = t.getSeconds()
	second = second < 10 ? '0' + second : second;
	return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}
//时间字符串转时间戳（秒）
function formatTime(date) {
	date = date.substring(0, 19);
	date = date.replace(/-/g, '/');
	var timestamp = new Date(date).getTime();
	return timestamp / 1000
}
//设置用户信息
function setUserInfo(obj) {
	const userInfo = Taro.getStorageSync("USER_INFO") || {};
	Taro.setStorageSync('USER_INFO', { ...userInfo, ...obj })
}
//存储goods_ids
function setGoodsIds(id) {
	let goodsIds = Taro.getStorageSync("goodsIds") || [];
	let isRepeat = false
	for (let i = 0; i < goodsIds.length; i++) {//去重
		if (goodsIds[i] == id) {
			isRepeat = true
			break
		}
	}
	if (!isRepeat) {
		goodsIds.push(id)
		Taro.setStorageSync('goodsIds', goodsIds)
	}
}
//首页详情时间转化
function strToTime(start_time, end_time) {
	let currrent_time = new Date().getTime() / 1000;
	let time_sec = 0;
	if (currrent_time < start_time) {
		//预展中
		time_sec = (start_time - currrent_time);
		let day = Math.floor(time_sec / 3600 / 24) < 10 ? '0' + Math.floor(time_sec / 3600 / 24) : Math.floor(time_sec / 3600 / 24);
		let hour = Math.floor(time_sec / 3600 % 24) < 10 ? '0' + Math.floor(time_sec / 3600 % 24) : Math.floor(time_sec / 3600 % 24);
		let minute = Math.floor(time_sec / 60 % 60) < 10 ? '0' + Math.floor(time_sec / 60 % 60) : Math.floor(time_sec / 60 % 60);
		let second = Math.floor(time_sec % 60) < 10 ? '0' + Math.floor(time_sec % 60) : Math.floor(time_sec % 60);
		let time = '距离开始 ' + day + '天' + hour + '时' + minute + '分' + second + '秒'
		return { status: 1, time: time }
	} else if (currrent_time >= start_time && currrent_time < end_time) {
		//开拍
		time_sec = (end_time - currrent_time);
		let day = Math.floor(time_sec / 3600 / 24) < 10 ? '0' + Math.floor(time_sec / 3600 / 24) : Math.floor(time_sec / 3600 / 24);
		let hour = Math.floor(time_sec / 3600 % 24) < 10 ? '0' + Math.floor(time_sec / 3600 % 24) : Math.floor(time_sec / 3600 % 24);
		let minute = Math.floor(time_sec / 60 % 60) < 10 ? '0' + Math.floor(time_sec / 60 % 60) : Math.floor(time_sec / 60 % 60);
		let second = Math.floor(time_sec % 60) < 10 ? '0' + Math.floor(time_sec % 60) : Math.floor(time_sec % 60);
		let time = '距离结束 ' + day + '天' + hour + '时' + minute + '分' + second + '秒'
		return { status: 2, time: time }
	} else {
		//结束
		return { status: 3, time: '结束时间 ' + formatDate(end_time) }
	}
}
//商品列表返回时间格式
function clock(start_time, end_time) {
	let currrent_time = new Date().getTime() / 1000;
	let time_sec = 0;
	if (currrent_time < start_time) {
		//预展中
		time_sec = (start_time - currrent_time);
		let day = Math.floor(time_sec / 3600 / 24) < 10 ? '0' + Math.floor(time_sec / 3600 / 24) : Math.floor(time_sec / 3600 / 24);
		let hour = Math.floor(time_sec / 3600 % 24) < 10 ? '0' + Math.floor(time_sec / 3600 % 24) : Math.floor(time_sec / 3600 % 24);
		let minute = Math.floor(time_sec / 60 % 60) < 10 ? '0' + Math.floor(time_sec / 60 % 60) : Math.floor(time_sec / 60 % 60);
		let second = Math.floor(time_sec % 60) < 10 ? '0' + Math.floor(time_sec % 60) : Math.floor(time_sec % 60);
		if (day > 0) { return day + '日' }
		else {
			if (hour > 0) { return hour + '时' }
			else {
				if (minute > 0) { return minute + '分' }
				else {
					return second + '秒'
				}
			}
		}
	} else if (currrent_time >= start_time && currrent_time < end_time) {
		//开拍
		time_sec = (end_time - currrent_time);
		let day = Math.floor(time_sec / 3600 / 24) < 10 ? '0' + Math.floor(time_sec / 3600 / 24) : Math.floor(time_sec / 3600 / 24);
		let hour = Math.floor(time_sec / 3600 % 24) < 10 ? '0' + Math.floor(time_sec / 3600 % 24) : Math.floor(time_sec / 3600 % 24);
		let minute = Math.floor(time_sec / 60 % 60) < 10 ? '0' + Math.floor(time_sec / 60 % 60) : Math.floor(time_sec / 60 % 60);
		let second = Math.floor(time_sec % 60) < 10 ? '0' + Math.floor(time_sec % 60) : Math.floor(time_sec % 60);
		if (day > 0) { return day + '日' }
		else {
			if (hour > 0) { return hour + '时' }
			else {
				if (minute > 0) { return minute + '分' }
				else {
					return second + '秒'
				}
			}
		}
	} else {
		//结束
		return '已结束'
	}
}
//加价幅度
function scale(price) {
	if (Math.floor(price) >= 0 && Math.floor(price) < 10000) return 100;
	if (Math.floor(price) >= 10000 && Math.floor(price) < 100000) return 1000;
	if (Math.floor(price) >= 100000) return 5000;
}

function tip(val, type) {
	Taro.showToast({
		title: val,
		icon: type || 'none',
		duration: 2000
	})
}
//上传多张图片
function uploadImgs(data) {
	return new Promise(
		(resolve, reject) => {
			uploadFun(data, resolve)
		}
	)
	function uploadFun(data, resolve) {
		var i = data.i ? data.i : 0,//当前上传的哪张图片
			success = data.success ? data.success : 0,
			fail = data.fail ? data.fail : 0;
		Taro.uploadFile({
			url: data.url,
			filePath: data.path[i],
			name: 'file',//这里根据自己的实际情况改
			formData: null,//这里是上传图片时一起上传的数据
			success: (res) => {
				let resObj = JSON.parse(res.data)
				if (resObj.errcode == 0) {
					data.result.push(resObj.data.path)
					success++;//图片上传成功，图片上传成功的变量+1
				}
			},
			fail: (res) => {
				fail++;//图片上传失败，图片上传失败的变量+1
				console.log('fail:' + i + "fail:" + fail);
			},
			complete: () => {
				if (data.path.length < 1) {
					return
				}
				i++;//这个图片执行完上传后，开始上传下一张
				if (i == data.path.length) {   //当图片传完时，停止调用          
					console.log('执行完毕', data.result);
					console.log('成功：' + success + " 失败：" + fail);
					resolve && resolve(data.result)
				} else {//若图片还没有传完，则继续调用函数
					console.log(i);
					data.i = i;
					data.success = success;
					data.fail = fail;
					uploadFun(data, resolve);
				}
			}
		})
	}
}
function mtLog(param) {
	let systemInfo = getGlobalData('systemInfo')
	let mobile = Taro.getStorageSync('mobile')
	let { action, action_desc, arg1, arg2, arg3, arg4, arg5 } = param
	let defaultParam = {
		mobile: mobile,
		model: systemInfo.model,
		version: systemInfo.version,
		action: action || '',
		action_desc: action_desc || ''
	}
	defaultParam.arg1 = arg1 || ''
	defaultParam.arg2 = arg2 || ''
	defaultParam.arg3 = arg3 || ''
	defaultParam.arg4 = arg4 || ''
	defaultParam.arg5 = arg5 || ''
	mtLogRecord(defaultParam).then(
		res => {
			res.success
		}
	)
}

//订单倒计时
function countDown(express_time, type) {
	let new_time = new Date().getTime() / 1000;
	let interval = type == 0 ? 604800 : 1296000;
	let time_sec = interval - (new_time - express_time);
	if(time_sec<0) return { day: '00', hour: '00', minute: '00', second: '00' }
	let day = Math.floor(time_sec / 3600 / 24) < 10 ? '0' + Math.floor(time_sec / 3600 / 24) : Math.floor(time_sec / 3600 / 24);
	let hour = Math.floor(time_sec / 3600 % 24) < 10 ? '0' + Math.floor(time_sec / 3600 % 24) : Math.floor(time_sec / 3600 % 24);
	let minute = Math.floor(time_sec / 60 % 60) < 10 ? '0' + Math.floor(time_sec / 60 % 60) : Math.floor(time_sec / 60 % 60);
	let second = Math.floor(time_sec % 60) < 10 ? '0' + Math.floor(time_sec % 60) : Math.floor(time_sec % 60);
	return { day: day, hour: hour, minute: minute, second: second }
}
//海报时间
function postTime(str) {
	let timeStr = new Date(str * 1000);
	let month = timeStr.getMonth() + 1;
	month = month < 10 ? '0' + month : month;
	let date = timeStr.getDate();
	date = date < 10 ? '0' + date : date;
	let hour = timeStr.getHours()
	hour = hour < 10 ? '0' + hour : hour;
	let minute = timeStr.getMinutes()
	minute = minute < 10 ? '0' + minute : minute;
	return month + '/' + date + ' ' + hour + ':' + minute
}
module.exports = {
	tip,
	checkPhone,
	formatMoney,
	formatDate,
	formatTime,
	setUserInfo,
	strToTime,
	clock,
	formatMoney2,
	setGoodsIds,
	scale,
	uploadImgs,
	countDown,
	postTime,
	mtLog,
	countDown
}