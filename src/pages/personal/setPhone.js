import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import './setPhone.less'

import {editMobile,confirmMobile} from '../../api/user'
import {getCode} from '../../api/common'
import { checkPhone } from '../../utils/funs'
import { staticRecord } from '../../api/index'

export default class PersonalSet extends Taro.Component {

  config = {
    navigationBarTitleText: '手机号修改',
  }
  constructor(props) {
    super(props)
    this.state = {
      oldPhone: '',//旧号码
      phone:'',
      btn:'下一步',
      isOld:true,//显示原手机号
      code_status:'获取动态码',
      code:'',
      coden:90,// 定义90秒的倒计时
    }
  }
  getPhone(e){
    this.setState(pre => {
			pre.phone = e.detail.value
		})
  }
  clear() {
    this.setState(pre => {
			pre.phone = ''
		})
  }
  //拿到验证码
  getVerify(e){
    let {value} = e.detail;
    this.setState( pre => {
        pre.code = value
    })
  }
  editBtn(){
    let params = {}
    if(this.state.btn == '下一步') {
        params = {
          mobile:this.state.oldPhone,
          verify_code: this.state.code
        }
         this.ConfirmMobile(params)
    }else{
      params = {
        mobile:this.state.phone,
        verify_code:this.state.code
      }
      this.EditMobile(params)
    }
  }
  componentDidShow(){
    staticRecord()
  }
  componentWillMount() {
    const {phone} = this.$router.params
    this.setState({oldPhone: phone})
  }
  getCode() {
    let _this = this;
    let {isOld,oldPhone,phone,coden} = this.state;
    let phoneNum = isOld ? oldPhone : phone;
		if (this.state.code_status == '获取动态码' && checkPhone(phoneNum)) {
      checkPhone(phoneNum)
      //发送验证码
			getCode(phoneNum).then( res => {
        if(!res.success) return 
        let codeV = setInterval( function() {
          _this.setState(pre => {
            pre.code_status = (coden--) + 's后重新发送'
          })
          if (coden == -1) {
            clearInterval(codeV)
            _this.setState(pre => {
              pre.code_status = '获取动态码'
            })
          }
        }, 1000)
      })
		}
  }
  //验证原手机号
  ConfirmMobile(params){
    confirmMobile(params).then( res => {
      if(res.success){
         this.setState( pre => {
           pre.btn = '保存';
           pre.isOld = false;
           pre.code = '',
           pre.coden = 0
         })
      }else{
        Taro.showToast({icon:'none',title:'验证码有误'})
      }
   })
  }
  //修改手机
  EditMobile(params){
    editMobile(params).then( res => {
       if(res.success){
          Taro.navigateBack()
       }else{
         Taro.showToast({icon:'none',title:'验证码有误'})
       }
    })
  }

  render() {
    let {oldPhone,btn,isOld,code_status,code} = this.state
    return (
      <View className="page">
      { isOld
        ?<View className="content">
          <View className="box">
             <View className='old-phone'>原手机号码</View>
             <View className='phone-number'>{oldPhone}</View>
          </View>
        </View>
        :<View className="content">
          <View className="box">
            <Input onInput={this.getPhone} maxLength='11' className="fl" type="text" placeholder="请输入手机号" />
            <Image className="yCenter" src={require('../../static/images/shanchu.png')} onClick={this.clear}></Image>
          </View>
        </View>
      }
        <View className="content">
          <View className="box">
            <Input onInput={this.getVerify} value={code} className="fl" maxLength='6' type="number" placeholder="请输入验证码" />
            <View onClick={this.getCode} className="code-btn">{code_status}</View>
          </View>
        </View>
        <View onClick={this.editBtn} className="save">{btn}</View>
      </View>
    )
  }
}

