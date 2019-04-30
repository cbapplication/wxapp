import ajax from '../utils/ajax';
/**
 * 短信验证码
 * @param {*} mobile
 */
var getCode = function (mobile) {
	const data = ajax.get(`common/third/getCode?mobile=${mobile}`)
	return data.then(r => ({
		"success": r.data.errcode == 0,
	}))
}

module.exports = {
	getCode
}