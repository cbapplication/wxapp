import ajax from '../utils/ajax'
import { formatMoney, formatDate } from '../utils/funs'
import { getStorageSync } from '@tarojs/taro';
import { set as setGlobalData, get as getGlobalData } from '../globalData'
import { IMG_BASE } from '../utils/const'

var getStoreOwner = function (params) {//获取店铺所属人的用户信息
  const data = ajax.get(`index/store/getStoreOwner`, params)
  return data.then(r => ({
    avatar: r.data && r.data.data && r.data.data.avatar
  }))
}
var getStoreInfo = function (params) {//获取店铺介绍
  const data = ajax.get(`index/store/get`, params)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      name: data.name,
      description: data.description,
      level: data.level || 0,
      avatar: data.avatar,
      done_count: data.done_count,
      is_focus: data.is_focus,
      selling_count: data.selling_count
    }
  })
}
var getGoodList = function (params) {//获取指定店铺下的所有商品列表
  const data = ajax.get(`index/store/getGoodsList`, params)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      current_page: data.current_page,
      data: data.data,
      last_page: data.last_page,
      per_page: data.per_page,
      total: data.total,
      status: data.status,
      focus_times: data.focus_times,
      auction_times: data.auction_times
    }
  })
}
//获取详情页店铺介绍
var getStore = function (id) {
  const data = ajax.get(`index/store/get?id=${id}`)
  return data.then(r => {
    return {
      "success": r.data.errcode == 0,
      "id": r.data.data.id,
      "name": r.data.data.name,
      "avatar": r.data.data.avatar,
      "selling_count": r.data.data.selling_count,
      "done_count": r.data.data.done_count,
      "is_focus": r.data.data.is_focus
    }
  })
}
//我的店铺资料
var getMyStore = function () {
  const data = ajax.get(`index/store/myInfo`)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      "success": r.data.errcode == 0,
      "name": data.name,
      "avatar": data.avatar,
      "level": data.level,
      "address": data.address,
      "recommend_code": data.recommend_code,
      "ctime": data.ctime,
      "classify_name": data.classify_name,
      "classify_ids": data.classify_ids,
      "description": data.description
    }
  })
}
//修改店铺经营范围
var editClassify = function (params) {
  const data = ajax.post(`index/store/editClassify`, params)
  return data.then(r => ({
    "success": r.data.errcode == 0,
  }))
}
//修改店铺名字
var editName = function (params) {
  const data = ajax.post(`index/store/editName`, params)
  return data.then(r => ({
    "success": r.data.errcode == 0,
  }))
}
//修改商家头像
var editAvatar = function (params) {
  const data = ajax.post(`index/store/editAvatar`, params, 'multipart/form-data')
  return data.then(r => ({
    "success": r.data.errcode == 0,
  }))
}
//修改店铺地址
var editAddress = function (params) {
  const data = ajax.post(`index/store/editAddress`, params)
  return data.then(r => ({
    "success": r.data.errcode == 0,
  }))
}
//修改店铺介绍
var editDescription = function (params) {
  const data = ajax.post(`index/store/editDescription`, params)
  return data.then(r => ({
    "success": r.data.errcode == 0,
  }))
}
//关注或取关店铺
var focusOrDiscard = function (params) {
  const data = ajax.post(`index/store/focusOrDiscard`, params)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      "success": r.data.errcode == 0,
      "is_focus": data.is_focus
    }
  })
}
//关注或取关店铺
var publishGoods = function (params) {
  const data = ajax.post(`index/store/publishGoods`, params)
  return data.then(r => ({
    "success": r.data.errcode == 0,
    'msg': r.data.msg
  })
  )
}
/**
 * 店铺推荐
 */
var storeTops = function () {
  const data = ajax.get(`index/store/tops`)
  return data.then(r => ({
    "success": r.data.errcode == 0,
    "items": (r.data.data || []).map(o => ({
      avatar: o.avatar,
      description: o.description,
      id: o.id,
      name: o.name,
    }))
  }))
}
/**
 * 店铺订单列表
 * @param {store_id,status,page} params 
 */
var orderList = function (params) {
  params.store_id = getGlobalData('storeId');
  const data = ajax.get(`index/store/orderList`, params)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      "success": r.data.errcode == 0,
      "hasData": data.total != 0,
      "items": (data.data || []).map(o => ({
        "id": o.id,
        "goods_name": o.goods_name,
        "cover_image": IMG_BASE + o.cover_image,
        "commissions": formatMoney(o.commissions),
        "ctime": formatDate(o.ctime),
        "status": o.status,
        "status_map": data.status_map,
        "deal_price": formatMoney(o.deal_price),
        "settle_accounts": formatMoney(o.settle_accounts),
      }))
    }
  })
}
/**
* 店铺状态
*/
var storeStatus = function () {
  const data = ajax.get(`index/store/status`)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      "success": r.data.errcode,
      "check_status": (r && r.data && r.data.data && data.check_status) || '',
      "authrize_status": r && r.data && r.data.data && data.authrize_status
    }
  })
}
/**
 * 店铺订单详情
 * @param {订单ID} id 
 */
var orderDetail = function (id) {
  const data = ajax.get(`index/store/orderDetail?id=${id}`)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      "success": r.data.errcode == 0,
      "address": data.address,
      "auto_accept_time": (data.auto_accept_time),
      "express_name": data.express_name,
      "express_sn": data.express_sn,
      "express_time": (data.express_time),
      "order_number": data.order_number,
      "pay_time": formatDate(data.pay_time),
      "goods_name": data.goods_name,
      "cover_image": data.cover_image,
      "user_nickname": data.user_nickname,
      "commissions": formatMoney(data.commissions),
      "ctime": formatDate(data.ctime),
      "status": data.status,
      "status_map": data.status_map,
      "deal_price": formatMoney(data.deal_price),
      "settle_accounts": formatMoney(data.settle_accounts),
      "settle_time": formatDate(data.settle_time),
      "break_time": formatDate(data.break_time),
      "countDown": {},//倒计时
    }
  })
}
/**
 * 获取委托方信息
 * @param {protocol_id} params 
 */
var getProtocol = function (params) {
  const data = ajax.get(`index/store/getProtocol`, params)
  return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      success: r.data.errcode == 0,
      id:0,
      name: data.name,
      avatar: data.avatar,
      selling_count: data.selling_count,
      done_count:data.done_count
    }
  })
}
module.exports = {
  getStoreOwner,
  getStoreInfo,
  getGoodList,
  getStore,
  getMyStore,
  editClassify,
  editName,
  editAvatar,
  editAddress,
  editDescription,
  focusOrDiscard,
  publishGoods,
  storeTops,
  orderList,
  orderDetail,
  storeStatus,
  getProtocol
}