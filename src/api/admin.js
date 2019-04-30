import ajax from '../utils/ajax';
/**
 * 短信验证码
 * @param {*} mobile
 */
var mtLogRecord = function (params) {
  const data = ajax.post(`admin/auth/mtLogRecord`, params)
  return data.then(r => ({
    "success": r.data.errcode == 0,
  }))
}

module.exports = {
  mtLogRecord
}