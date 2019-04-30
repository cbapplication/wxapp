import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'
import './check.less'
import checkWait from '../../static/images/check-wait.png'
import checkSucess from '../../static/images/check-sucess.png'
import checkFail from '../../static/images/check-fail.png'
import ServiceModel from '../../components/serviceModel/index'
import { staticRecord } from '../../api/index'

export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headText: '',
      imgSrc: '',
      pageStatus: '',
      pageDesc: '',
      btnText: '',
      showService: false//显示客服
    }
  }

  goIdSend() {
    let { btnText, storeId } = this.state
    if (btnText == '联系客服') {
      this.setState({
        showService: true
      })
      return
    }
    if (btnText == '去认证') {
      Taro.navigateTo({
        url: './idSend?id=' + storeId
      })
    }
    if (btnText == '再次申请') {
      Taro.navigateTo({
        url: './personalInfo'
      })
    }
  }

  componentWillMount() {
    let { status, idStatus } = this.$router.params
    if (status == 0) {
      this.setState({
        headText: '审核中',
        imgSrc: checkWait,
        pageStatus: '提交成功，请等待管理员审核',
        pageDesc: '预计14工作日内审核完成，工作人员会与你取得联系，请耐心等待，如有疑问，可点击联系客服',
        btnText: '联系客服'
      })
    }
    if (status == -1) {
      this.setState({
        headText: '审核失败',
        imgSrc: checkFail,
        pageStatus: '很遗憾，您的审核未通过!',
        pageDesc: '您可以修改申请资料之后，再次提交申请。如有其它疑问，可以联系客服',
        btnText: '再次申请'
      })
    }
    if (status == 1 && idStatus == 2) {
      this.setState({
        headText: '审核成功',
        imgSrc: checkSucess,
        pageStatus: '恭喜您，您的审核通过了!',
        pageDesc: '现在您只需上传身份证信息，即可通过认证，成功开店了',
        btnText: '去认证'
      })
    }
    if (status == 1 && idStatus == -1) {
      this.setState({
        headText: '认证失败',
        imgSrc: checkSucess,
        pageStatus: '很遗憾，您的认证未通过!',
        pageDesc: '客服会在7工作日内联系你，请耐心等待，如有疑问，可点击联系客服',
        btnText: '联系客服'
      })
    }
    Taro.setNavigationBarTitle(
      {
        title: this.state.headText
      }
    )
  }

  componentDidMount() {

  }
  componentWillUpdate() {

  }

  componentWillUnmount() { }

  componentDidShow() { 
    staticRecord()
  }

  componentDidHide() { }
  closeServiceModel() {
    this.setState({
      showService: false
    })
  }
  render() {
    let { imgSrc, pageStatus, pageDesc, btnText, showService } = this.state
    let wx = Taro.getStorageSync('weixin')
    return (
      <View className="page">
        <View className='tip-box'>
          <View className='icon'>
            <Image src={imgSrc}></Image>
          </View>
          <View className='tips'>
            <View className='status-tip'>{pageStatus}</View>
            <View className='detail-tip'>{pageDesc}</View>
          </View>
        </View>
        <View className='btn' onClick={this.goIdSend}>{btnText}</View>
        <ServiceModel show={showService} onCloseServiceModel={this.closeServiceModel} weixin={wx}></ServiceModel>
      </View>
    )
  }
}