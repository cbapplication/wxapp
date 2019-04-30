import Taro, { Component, Config } from '@tarojs/taro'
import { View, Form, Button } from '@tarojs/components'
import './personalInfo.less'
import { tip, checkPhone } from '../../utils/funs'
import { getCode, judgeVerifyCode } from '../../api/user'
import { staticRecord } from '../../api/index'

export default class PersonalInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tel: '',
      infoList: {},
      btntext: '获取验证码'
    }
  }
  config = {
    navigationBarTitleText: '个人信息',
  }
  formSubmit(e) {
    console.log(e, 'shijian')
    let list = e.currentTarget.value
    let nameReg = /^[\u2E80-\u9FFF]+$/
    this.setState({
      infoList: list
    })
    if (!nameReg.test(list.name)) {
      tip('申请人姓名为汉字')
      return
    }
    if (!checkPhone(list.tel)) {
      tip('请完善手机号')
      return
    }
    if (list.suggest.length > 6) {
      tip('推荐码错误')
      return
    } else {
      //判断推荐码存在否
    }
    if (!list.verify) {
      tip('请填写验证码')
      return
    } else {
      //判断验证码是否正确
    }
    this.goShopInfo(list)
  }
  setTel(e) {
    this.setState(pre => {
      pre.tel = e.detail.value
    })
  }
  getAuthCode() {
    let _this = this
    let coden = 60
    let tel = this.state.tel
    let param = {
      mobile: tel
    }
    if (this.state.btntext == '获取验证码' && checkPhone(tel)) {
      let codeV = setInterval(function () {
        _this.setState(pre => {
          pre.btntext = (coden--) + 's后重新发送'
        })
        if (coden == -1) {
          clearInterval(codeV)
          _this.setState(pre => {
            pre.btntext = '获取验证码'
          })
        }
      }, 1000)
      getCode(param).then(res => {
        if(res.errcode==0){
          tip('验证码获取成功')
        }else{
          tip('验证码获取达到次数上限,请稍后再试')
        }
      })
    }
  }
  goShopInfo(list) {
    let params = {
      mobile: list.tel,
      verify_code: list.verify
    }
    judgeVerifyCode(params).then(
      (res) => {
        if (res.data.errcode == 0) {//0代表校验通过
          Taro.navigateTo({
            url: './shopInfo'
          })
        }else{
          tip('验证码错误')
        }
      }
    )
  }

  componentWillMount() {

  }

  componentDidShow() { 
    staticRecord()
  }

  componentDidHide() { }
  render() {
    let { btntext } = this.state
    return (
      <View className="page">
        <View className='head-tip'>温馨提示：请填写本人真实资料，认证通过不可修改</View>
        <Form onSubmit={this.formSubmit}>
          <View className='info-list'>
            <View className='item clearfix'>
              <View className='fl'>申请人</View>
              <Input name='name' className='fl' placeholder='请输入真实姓名'></Input>
            </View>
            <View className='item clearfix'>
              <View className='fl'>手机号</View>
              <Input name='tel' type='tel' className='fl' placeholder='请输入手机号' maxlength='11' value={this.tel} onInput={this.setTel}></Input>
            </View>
            <View className='item clearfix'>
              <View className='fl'>推荐码</View>
              <Input name='suggest' className='fl' placeholder='请输入推荐码（选填）'></Input>
            </View>
            <View className='item clearfix'>
              <View className='fl'>验证码</View>
              <Input name='verify' type='tel' className='fl' placeholder='请输入验证码' maxlength='6'></Input>
              <View className='code-btn yCenter' onClick={this.getAuthCode}>{btntext}</View>
            </View>
          </View>
          <View class="order-bottom">
            <View >去申请</View>
            <Button form-type="submit"></Button>
          </View>
        </Form>
      </View>
    )
  }
}