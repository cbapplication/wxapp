import ajax from '../utils/ajax';
import { formatMoney, formatMoney2, scale ,formatDate} from '../utils/funs'
//拍品详情
var getGoodsDetail = function (id) {
     const data = ajax.get(`index/goods/index?id=${id}`)
     return data.then(r => {
          let data = {}
          if (r.data.data) {
               data = r.data.data
          }
          return {
               "success": r.data.errcode == 0,
               "id": data.id,
               "start_price": formatMoney(data.start_price),
               "start_price_num": Math.floor(data.start_price),
               "price": data.is_bidden == 1 ? (data.price) : (data.start_price),
               "start_time": data.start_time,
               "expires_time": data.expires_time,
               "bailStr": formatMoney(data.bail),
               "bail": (data.bail),
               "cover_images": data.cover_images||[],
               "image_number": data.image_number,
               "min_reference_price": formatMoney2(data.min_reference_price),
               "max_reference_price":formatMoney2(data.max_reference_price),
               "auction_is_first":data.auction_is_first == 1,//是否出价优先
               "has_auctioned" : data.has_auctioned == 1,//是否缴纳保障金
               "scale": Math.floor((function(){
                    if(data.status == 1) {return scale(data.start_price)}
                    else{
                         if(data.is_bidden == 0){
                              return scale(data.start_price)
                         } else {
                              return scale(data.price)
                         }
                    }
               })()),
               "scaleStr": formatMoney((function(){
                    if(data.status == 1) {return scale(data.start_price)}
                    else{
                         if(data.is_bidden == 0){
                              return scale(data.start_price)
                         } else {
                              return scale(data.price)
                         }
                    }
               })()),
               "status": data.status,
               "status_desc": data.status_desc,
               'name': data.name,
               "count_down": '',
               "store_id": data.store_id,
               "protocol_id":data.protocol_id,
               "is_focus": data.is_focus == 1,//是否被关注
               "bail_is_enough": data.bail_is_enough == 1,//保障金是否充足
               "is_bidden": data.is_bidden == 1//是否被出价过
          }
     })
}
//获取出价记录
var getAuctionHistory = function (goods_id) {
     const data = ajax.get(`index/goods/auctionHistory?goods_id=${goods_id}`)
     return data.then(r => ({
          "success": r.data.errcode == 0,
          "items": (r.data.data || []).map(o => ({
               "user": o.user,
               "times": formatDate(o.times),
               "ctimes": formatDate(o.ctimes),
               "money": formatMoney(o.money)
          }))
     }))
}
//获取拍品介绍
var getIntro = function (id) {
     const data = ajax.get(`index/goods/intro?id=${id}`)
     return data.then(r => {
          let data = {}
          if (r.data.data) {
               data = r.data.data
          }
          return {
               "success": r.data.errcode == 0,
               "detail": data.detail,
          }
     })
}
//获取帮助条目
var getHelp = function () {
     const data = ajax.get(`index/goods/help`)
     return data.then(r => ({
          "success": r.data.errcode == 0,
          "items": (r.data.data || []).map(o => ({
               "id": o.id,
               "name": o.name,
          }))
     }))
}
//获取帮助内容
var getHelpContent = function (id) {
     const data = ajax.get(`index/goods/helpContent?id=${id}`)
     return data.then(r => {
          let data = {}
          if (r.data.data) {
               data = r.data.data
          }
          return {
               "success": r.data.errcode == 0,
               "detail": data.content,
          }
     })
}
//获取分类
var getClassify = function () {
     const data = ajax.get(`index/goods/classify`)
     return data.then(r => ({
          success: r.data.errcode == 0,
          items: (r.data.data || []).map(o => ({
               "id": o.id,
               "name": o.name,
               "photo": o.photo,
               "rank": o.rank,
               "goods_number": formatMoney(o.goods_number),
               "ctime": o.ctime,
               "utime": o.utime
          }))
     }))
}

/**
 * 获取海报详情
 * @param {商品ID} goods_id 
 */
var getPosterInfo = function (goods_id) {
     const data = ajax.get(`index/goods/getPosterInfo?goods_id=${goods_id}`)
     return data.then(r => {
          let data = {}
          if (r.data.data) {
               data = r.data.data
          }
          return {
               "success": r.data.errcode == 0,
               "cover_image": data.cover_image,
               "name": data.name,
               "start_time": data.start_time,
               "expires_time": data.expires_time,
               "price": formatMoney(data.price),
               "start_price": formatMoney(data.start_price),
               "min_reference_price":formatMoney2(data.min_reference_price),
               "max_reference_price":formatMoney2(data.max_reference_price),
               "goods_status": data.goods_status == 3//成交为1，其他为0
          }
     })
}
/**
 * 关注
 * @param {商品ID} goods_id 
 */
var focusOrDiscard = function (goods_id) {
     const data = ajax.post(`index/goods/focusOrDiscard`, { goods_id })
     return data.then(r => {
          let data = {}
          if (r.data.data) {
               data = r.data.data
          }
          return {
               "success": r.data.errcode == 0,
               "is_focus": data.is_focus == 1//关注为1，取消为0
          }
     })
}
/**
 * 出价
 * @param {goods_id,money} params 
 */
var auction = function (params) {
     const data = ajax.post(`index/goods/auction`, params)
     return data.then(r => ({
          "success": r.data.errcode == 0,
     }))
}
/**
 * 拍品ID做广播分组
 * @param {*} params 
 */
var socketGroup = function(params){
     const data = ajax.post(`index/goods/socketGroup`,params)
     return data.then(r => ({
          "success":r.data.errcode == 0,
     }))
}
module.exports = {
     getGoodsDetail,
     getAuctionHistory,
     getIntro,
     getHelp,
     getHelpContent,
     getClassify,
     getPosterInfo,
     focusOrDiscard,
     auction,
     socketGroup
}