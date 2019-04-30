import Taro from '@tarojs/taro'
import { View, Button, Image, Block } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import auth from '../../utils/auth'
import Login from '../login/index'
import { mtLog } from '../../utils/funs'
export default class getPhone extends Taro.Component {
  static options = {
    addGlobalClass: true
  }
  config = {
    navigationBarBackgroundColor: 'black',
  }
  constructor(props) {
    super(props)
    this.state = {
      showLogin: false,
      timer: ''
    }
  }
  componentWillMount() {
    //openId(this.props.params);

  }
  getPhone(e) {
    let param = {
      action: 'dl_zjy_shouquanbangding click',
      action_desc: '点击授权手机号绑定'
    } 
    mtLog(param)
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let logParam = {
        action: 'dl_sjh_yunxu click',
        action_desc: '点击允许'
      }
      mtLog(logParam)
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      auth.getPhone(
        params,
        res => {
          if (res.data.errcode == 0) {
            let phoneNumber = res.data.data.phoneNumber || ''
            if (phoneNumber) {
              auth.register({ phone: phoneNumber },
                res => {
                  this.closeSelf()
                }
              )
            }
          } else {
            Taro.showToast({
              title: '解密失败' + res.data.errcode,
              icon: 'none'
            })
          }
        },
        err => {
          //console.log(err)
        }
      )
    } else {
      let logParam = {
        action: 'dl_sjh_jujue click',
        action_desc: '点击拒绝'
      }
      mtLog(logParam)
      this.closeSelf()
      Taro.showToast({
        title: '当前账号未绑定手机号',
        icon: 'none'
      })
    }
  }
  showLoginModel() {//自输入手机号弹窗
    let param = {
      action: 'dl_zjy_shurubangding click',
      action_desc: '点击输入手机号绑定'
    }
    mtLog(param)
    this.setState({
      showLogin: true
    })
    this.closeSelf()
  }
  closeLoginModel() {
    this.setState(pre => {
      pre.timer = setInterval(() => {
        let token = Taro.getStorageSync("token")
        if (token) {
          this.props.onLoginSuccess()
          clearInterval(pre.timer)
          pre.timer = 0
        }
      }, 1000)
    })
    this.setState({
      showLogin: false
    })
  }
  closeSelf() {
    this.setState(pre => {
      pre.timer = setInterval(() => {
        let token = Taro.getStorageSync("token")
        if (token) {
          this.props.onLoginSuccess()
          clearInterval(pre.timer)
          pre.timer = 0
        }
      }, 1000)
    })
    this.props.onCloseGetPhoneModel()
  }
  render() {
    let { showLogin } = this.state
    let { showGetPhone } = this.props
    let content =
      <Block>
        <View className='layer-box' onClick={this.closeSelf} catchtouchmove="preventD"></View>
        <View className={`content ${getGlobalData('phoneModel')?'phone-bottom':''}`} catchtouchmove="preventD">
          <View className='head clearfix'>
            <Image className='logo fl' src=''></Image>
            <View className='fl'>茗探</View>
          </View>
          <View className='tip'>绑定手机号,即可完成登录</View>
          <View className='btn-box'>
            <Button openType='getPhoneNumber' onGetPhoneNumber={this.getPhone} className='auth-btn'>
              <View className='btn-content'><Image className='btn yCenter' src=''></Image>授权手机号绑定</View>
            </Button>
            <View className='enter-btn' onClick={this.showLoginModel}>
              <View className='btn-content'><Image className='btn yCenter' src=''></Image>输入手机号绑定</View>
            </View>
          </View>
          <View className='btm-tip'><Text>登录即代表同意</Text><Text className='agreement-btn'>茗探平台拍卖协议</Text> </View>
        </View>
      </Block>
    return (
      <View className='page'>
        {this.props.userInfo.errMsg === 'getUserInfo:ok' && showGetPhone && content}
        <Login show={showLogin} onCloseLoginModel={this.closeLoginModel}></Login>
      </View>
    )
  }
}