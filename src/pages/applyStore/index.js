import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'
import './index.less'
import ServiceModel from '../../components/serviceModel/index'
import AlertTip from '../../components/alert/index'
import { staticRecord } from '../../api/index'

export default class applyStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showServiceModel: false,
      showAgreementModel: false,
      showAlert: false
    }
  }
  config = {
    navigationBarTitleText: '',
  }
  closeServiceModel() {
    this.setState({
      showServiceModel: false
    })
  }
  showServiceModel() {
    this.setState({
      showServiceModel: true
    })
  }
  closeAgreementModel() {
    this.setState({
      showAgreementModel: false
    })
  }
  showAgreementModel() {
    this.setState({
      showAgreementModel: true
    })
  }
  goApply() {
    Taro.navigateTo({
      url: './personalInfo'
    })
  }

  componentWillMount() {

  }

  componentDidShow() {
    staticRecord()
   }

  componentDidHide() { }
  render() {
    const { showServiceModel, showAgreementModel, showAlert } = this.state
    return (
      <View className="page">
        <View className='flow border-box'>
          <View className='head'>申请商家流程</View>
          <View className='content'>
            <View className='item'>
              <View className='yCenter tip-num'>1</View>
              <View className='tip'>填写申请人基本信息</View>
            </View>
            <View className='item'>
              <View className='yCenter tip-num'>2</View>
              <View className='tip'>设置店铺名称、店铺logo、店铺介绍和经营范围</View>
            </View>
            <View className='item'>
              <View className='yCenter tip-num'>3</View>
              <View className='tip'>提交申请后，工作人员将在14个工作日内进行审核，并会与您取得联系</View>
            </View>
          </View>
        </View>
        <View className='friendly-tips'>
          <View className='head'>温馨提示</View>
          <View className='item'>1、认证不通过可修改再次提交</View>
          <View className='item'>2、请上传本人真实资料，认证通过不可修改</View>
          <View className='item'><Text>3、如有其它任何问题请</Text><Text className='service-btn' onClick={this.showServiceModel}>联系客服</Text></View>
        </View>
        <View className='agreement'><Text>点击去申请即代表同意茗探平台</Text><Text className='agreement-btn' onClick={this.showAgreementModel}>卖家协议</Text></View>
        <View class="order-bottom" onClick={this.goApply}>
          <View >去申请</View>
        </View>
        <View className={`agreement-model ${showAgreementModel ? '' : 'hide-model'}`} catchtouchmove="preventD">
          <View className='content-box xyCenter'>
            <Image className='close-btn' src={require('../../static/images/shanchu.png')} onClick={this.closeAgreementModel} />
            <View className='head'>卖家协议</View>
            <View className='content'>丁酉岁末，五十五号院子将呈现一场以小坂明陶艺品、十时启悦漆器为主的展览——山先生的茶室，以迎接戊戌伊始。</View>
          </View>
        </View>
        {showAlert && <AlertTip msg='卖家协议未勾选'></AlertTip>}
        <ServiceModel onCloseServiceModel={this.closeServiceModel} show={showServiceModel}></ServiceModel>
      </View>
    )
  }
}