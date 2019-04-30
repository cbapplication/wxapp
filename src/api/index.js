import ajax from '../utils/ajax';
import { formatMoney, formatDate } from '../utils/funs'
//精选专场
var getSpecialise = function () {
	const data = ajax.get(`index/index/getSpecialise`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			id: data.id,
			click_times: data.click_times,
			start_time: data.start_time,
			expires_time: data.expires_time,
			end_time: formatDate(data.expires_time),
			cover_images: data.cover_images,
			name: data.name,
			status: data.status,
			status_map: data.status_map,
			success: r.data.errcode == 0
		}

	})
}
//精品推荐
var getRecommend = function (page) {
	const data = ajax.get(`index/index/getRecommend?page=${page}`)
	return data.then(r => {
		let data = {}
		if (r.data.data) {
			data = r.data.data
		}
		return {
			success: r.data.errcode == 0,
			items: (data.data || []).map(o => ({
				name: o.name,
				id: o.id,
				cover_images: o.cover_images,
				start_time: o.start_time,
				expires_time: o.expires_time,
				focus_times: o.focus_times,//关注次数
				start_price: formatMoney(o.start_price),
				is_bidden: o.is_bidden == 1,//是否出过价
				price: formatMoney(o.price),
				auction_times: o.auction_times,//出价次数
				status_desc: o.status_desc,
				status: o.status,
				count_down: '',
				is_proprietary: o.is_proprietary == 1
			}))
		}
	})
}
//搜索拍品
var searchGoods = function (params) {
	const data = ajax.post(`index/index/searchGoods`, params)
	return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      success: r.data.errcode == 0,
      hasData: data.total != 0,
      items: (data.data || []).map(o => ({
        name: o.name,
        id: o.id,
        cover_image: o.cover_image,
        start_time: o.start_time,
        expires_time: o.expires_time,
        focus_times: o.focus_times,//关注次数
        start_price: formatMoney(o.start_price),
        is_bidden: o.is_bidden == 1,//是否出过价
        price: formatMoney(o.price),
        auction_times: o.auction_times,
        status: o.status,
        count_down: '',
        is_proprietary: o.is_psroprietary == 1
      }))
    }
  })
}
//搜索店铺
var searchStore = function (params) {
	const data = ajax.post(`index/index/searchStore`, params)
	return data.then(r => {
    let data = {}
    if (r.data.data) {
      data = r.data.data
    }
    return {
      success: r.data.errcode == 0,
      hasData: data.total != 0,
      items: (data.data || []).map(o => ({
        "id": o.id,
        "name": o.name,
        "avatar": o.avatar,
        "description": o.description,
      }))
    }
  })
}
//搜索店铺
var staticRecord = function () {
	const data = ajax.get(`index/index/statistics`)
	return data.then(r => ({
		success: r.data.errcode == 0
	}))
}
module.exports = {
	staticRecord,
	getSpecialise,
	getRecommend,
	searchGoods,
	searchStore,
}