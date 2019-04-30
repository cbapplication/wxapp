import Taro, {
  Component
} from '@tarojs/taro'
import Index from './pages/home/index'
import {
  set as setGlobalData,
  get as getGlobalData
} from './globalData'
import './app.less'
import './static/common-style/common.less'
import { login } from './utils/auth.js'
import { mtLog, formatTime } from './utils/funs'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/home/index',
      'pages/goodsInfo/index',
      'pages/category/index',
      'pages/special/index',
      'pages/specialDetail/index',
      'pages/mine/index',
      'pages/search/index',
      'pages/addressList/index',
      'pages/addressEdit/index',
      'pages/help/index',
      'pages/myBidding/index',
      'pages/browsingHistory/index',
      'pages/myFollow/index',
      'pages/followStore/index',
      'pages/myOrder/index',
      'pages/myOrderDetail/index',
      'pages/myOrderDetail/success/index',
      'pages/storeOrder/index',
      'pages/storeOrderDetail/index',
      'pages/storeOrderDetail/confirm',
      'pages/personal/index',
      'pages/sellerHomepage/index',
      'pages/storeInfo/index',
      'pages/storeInfo/storeName',
      'pages/storeInfo/address',
      'pages/uploadGoods/index',
      'pages/uploadGoods/preview',
      'pages/applyStore/index',
      'pages/applyStore/personalInfo',
      'pages/applyStore/shopInfo',
      'pages/applyStore/preview',
      'pages/applyStore/idSend',
      'pages/applyStore/business',
      'pages/applyStore/check',
      'pages/myWallet/index',
      'pages/walletDetail/index',
      'pages/accountDetail/index',
      'pages/personal/setName',
      'pages/personal/setPhone',
      'pages/myWallet/recharge/index',
      'pages/myWallet/cashWithdrawal/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      //custom:true,//自定义tabbar
      backgroundColor: '#fff',
      borderStyle: 'black',
      color: '#b7b2b3',
      selectedColor: '#423839',
      "list": [{
        "pagePath": "pages/home/index",
        "text": '精选'
        // "iconPath":"./static/images/jingxuan1.png",
        // "selectedIconPath":"./static/images/jingxuan.png",
      },
      {
        "pagePath": "pages/special/index",
        "text": '专题'
        // "iconPath":"./static/images/zhuanti1.png",
        // "selectedIconPath":"./static/images/zhuanti.png",
      },
      {
        "pagePath": "pages/category/index",
        "text": '分类'
        // "iconPath":"./static/images/fenlei1.png",
        // "selectedIconPath":"./static/images/fenlei.png",
      },
      {
        "pagePath": "pages/mine/index",
        "text": '我的',
        // "iconPath":"./static/images/guanzhu.png",
        // "selectedIconPath":"./static/images/guanzhu.png",
      }
      ]
    }
  }
  componentWillMount() {
    try {
      const res = Taro.getSystemInfoSync()
      setGlobalData('systemInfo', res)
      //适配iPhone X、iPhone XS、iPhone XS MAX、iPhone XR
      let model = res.model;
      if (-1 != model.search("iPhone X") || -1 != model.search("iPhone XS") || -1 != model.search("iPhone XS MAX") || -1 != model.search("iPhone XR")) {
        setGlobalData('phoneModel', true)
      } else {
        setGlobalData('phoneModel', false)
      }
      let token = Taro.getStorageSync('token')
      if (!token) {
        login()
      }
    } catch (e) {
      // Do something when catch error
    }
  }
  mtLogRecord(action) {
    let param = {
      action: action,
      action_desc: '关闭小程序'
    }
    mtLog(param)
  }
  componentDidMount() {
    // console.log('是否为iphone X:' + getGlobalData('phoneModel'))
    // wx.setTabBarBadge({ index: 3, text: "..." })
  }

  componentDidShow() { }

  componentDidHide() {
    let pages = Taro.getCurrentPages()
    let curPage = pages.length > 1 ? pages[1].route : pages[0].route
    if (curPage == 'pages/home/index') {
      this.mtLogRecord('sy_close program')
    }
    if (curPage == 'pages/special/index') {
      this.mtLogRecord('zclb_close program')
    }
    if (curPage == 'pages/goodsInfo/index') {
      this.mtLogRecord('ppxq_close program')
    }
    if (curPage == 'pages/category/index') {
      this.mtLogRecord('fl_close program')
    }
    if (curPage == 'pages/search/index') {
      this.mtLogRecord('fl_qbpp_close program')
    }
    if (curPage == 'pages/mine/index') {
      this.mtLogRecord('wd_close program')
    }
    if (curPage == 'pages/sellerHomepage/index') {
      this.mtLogRecord('wd_dianpu_close program')
    }
  }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(< App />, document.getElementById('app'))