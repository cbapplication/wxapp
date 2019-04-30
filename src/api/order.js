import ajax from '../utils/ajax';
import { formatMoney, formatDate } from '../utils/funs'
/**
 * 支付订单详情
 * @param {id} params 
 */
var orderDetail = function (params) {
    const data = ajax.post(`index/order/payDetails`, params)
    return data.then(r => {
        let data = {}
        if (r.data.data) {
            data = r.data.data
        }
        return {
            "success": r.data.errcode == 0,
            address: data.address,
            prepay_money: (data.prepay_money),
            total_bail: formatMoney(data.total_bail),
            total_fee: formatMoney(data.total_fee),
            status: 0,
            balance: (data.balance),
            mix_prepay_money: (data.mix_prepay_money),
            ctime: data.ctime,
            countDown: {},//倒计时
            isEnough: Number(data.balance) > Number(data.prepay_money),
            order_list: (data.order_list || []).map(o => ({
                deal_price: formatMoney(o.deal_price),
                goods_cover_images: o.goods_cover_image,
                goods_id: o.goods_id,
                goods_name: o.goods_name,
                order_id: o.order_id,
                service_charge: formatMoney(o.service_charge),
            }))
        }
    })
}
/**
 * 订单详情
 * @param {*} params 
 */
var detail = function (params) {
    const data = ajax.post(`index/order/detail`, params)
    return data.then(r => {
        let data = {}
        if (r.data.data) {
            data = r.data.data
        }
        return {
            "success": r.data.errcode == 0,
            address: data.address,
            total_bail: formatMoney(data.bail),
            ctime: (data.ctime),
            money: formatMoney(data.money),
            order_id: data.order_id,
            order_number: data.order_number,
            pay_time: formatDate(data.pay_time),
            auto_accept_time: formatDate(data.auto_accept_time),
            express_time: (data.express_time),
            total_fee: formatMoney(data.deal_price),
            express_name: data.express_name,
            express_sn: data.express_sn,
            countDown: {},//倒计时
            order_list: [
                {
                    deal_price: formatMoney(data.deal_price),
                    goods_cover_images: data.goods_cover_images,
                    goods_id: data.goods_id,
                    goods_name: data.goods_name,
                    service_charge: formatMoney(data.service_charge),
                }
            ],
                status: data.status,
            status_map: data.status_map,
            wx_paid_money: formatMoney(data.wx_paid_money)
        }
    })
}
/**
 * 生成预支付订单
 * @param {order_ids} params 
 */
var prePay = function (params) {
    const data = ajax.post(`index/order/prePay`, params)
    return data.then(r => {
        let data = {}
        if (r.data.data) {
            data = r.data.data
        }
        return {
            success: r.data.errcode == 0,
            prepay_id: data.prepay_id,//预支付ID
        }
    })
}
/**
 * 发货界面信息
 * @param {订单ID} id 
 */
var shipments = function (id) {
    const data = ajax.get(`index/order/shipments?id=${id}`)
    return data.then(r => ({
        success: r.data.errcode == 0,
        data: r.data.data
    }))
}
/**
 * 确认发货
 * @param {id,express_name,express_sn} params 
 */
var deliver = function (params) {
    const data = ajax.post(`index/order/deliver`, params)
    return data.then(r => ({
        success: r.data.errcode == 0,
    }))
}
module.exports = {
    orderDetail,
    prePay,
    detail,
    shipments,
    deliver
}