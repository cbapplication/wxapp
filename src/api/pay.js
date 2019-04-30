import ajax from '../utils/ajax';
/**
 * 充值保障金
 * @param {money} params 
 */
var bail = function(params){
     const data = ajax.post(`index/pay/bail`,params)
     return data.then(r => {
          let data = {}
          if (r.data.data) {
               data = r.data.data
          }
          return {
               "success":r.data.errcode == 0,
               appId:data.appId,
               nonceStr:data.nonceStr,
               package:data.package,
               paySign:data.paySign,
               signType:data.signType,
               timeStamp:data.timeStamp,

          }
     })
}
/**
 * 支付订单
 * @param {*} params 
 */
var order = function(params){
     const data = ajax.post(`index/pay/order`,params)
     return data.then(r => ({
          data:r.data
     }))
}
module.exports = {
    bail,
    order
}