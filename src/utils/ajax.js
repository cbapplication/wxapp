import Taro from '@tarojs/taro'
import { HTTPS } from './const'
import { set as setGlobalData, get as getGlobalData } from '../globalData'
import { tip, formatTime } from './funs'
export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    let _this = this
    data = data || {}
    let token = Taro.getStorageSync('token')
    data.token = token || ''
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    const option = {
      url: HTTPS + url,
      data: data,
      method: method,
      header: { 'content-type': contentType },
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.errcode == 1002) {
            _this.wxLogin()
          }
          return res.data
        }
      },
      error(e) {
        //console.error(e)
      }
    }
    return Taro.request(option)
  },
  wxLogin() {
    Taro.login()
      .then(res => {
        Taro.request({
          url: HTTPS + '/index/auth/wxLogin',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json'
          }
        }).then(
          res => {
            if (res.data.errcode == 0) {
              Taro.setStorageSync('mobile', res.data.data.mobile)
              Taro.setStorageSync('expTokenTime', res.data.data.token_expire)
              Taro.setStorageSync('token', res.data.data.token)
              Taro.setStorageSync('user_id',data.user_id)
            }
          }
        )
      }).catch(res)
  },
  get(url, data = '') {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post(url, data, contentType) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }
}