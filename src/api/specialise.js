import ajax from '../utils/ajax';
import {formatMoney,formatMoney2,formatDate} from '../utils/funs'

/**
 * 获取专题列表
 * @param {分页} page 
 */
var specialList = function(page){
    const data = ajax.get(`index/specialise/index?page=${page}`)
    return data.then(r => ({
        "success":r.data.errcode == 0,
        "items":(r.data.data || []).map(o =>({
            "id": o.id,
            "name": o.name,
            "cover_image": o.cover_image,
            "start_time": o.start_time,
            "expires_time": o.expires_time,
            "end_time":formatDate(o.expires_time),
            "click_times": o.click_times,
            "status": o.status,
            "status_map": o.status_map,
            "count_down":'',
            "goodsList": (o.goods_list || []).map( p => ({
                "id":p.id,
                "name":p.name,
                "cover_image": p.cover_image,
                "price": formatMoney(p.price),
            }))
           
        }))
    }))
}
//获取专题详情
var getSpecial = function(id,order){
    const data = ajax.get(`index/specialise/detail?id=${id}&order=${order}`)
    return data.then(r => {
        let data = {}
        if (r.data.data) {
            data = r.data.data
        }
        return {
            "success":r.data.errcode == 0,
            "id": data.id,
            "name": data.name,
            "cover_image": data.cover_image,
            "start_time": data.start_time,
            "expires_time": data.expires_time,
            "auction_numbers": data.auction_numbers,
            "click_times": data.click_times,
            "deal_numbers": data.deal_numbers,
            "goods_numbers": data.goods_numbers,
            "status": data.status,
            "status_map": data.status_map,
            "count_down":'距离结束 00天00时00分00秒',
            "items":(data.goods_list || []).map(o =>({
                "id":o.id,
                "name":o.name,
                "cover_image": o.cover_images,
                "start_time": o.start_time,
                "expires_time": o.expires_time,
                "click_times": o.click_times,
                "price": o.is_bidden == 1 ?formatMoney(o.price):formatMoney(o.start_price),
                "start_price": formatMoney(o.start_price),
                "status": o.status,
                "status_map":o.status_map,
                "count_down": '距离结束 00天00时00分00秒',
                "min_reference_price": formatMoney2(o.min_reference_price),
                "max_reference_price": formatMoney2(o.max_reference_price),
            }))
        }
    })
}
module.exports = {
    getSpecial,
    specialList
}