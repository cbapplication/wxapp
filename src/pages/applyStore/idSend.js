import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import './idSend.less'
import { tip, uploadImgs } from '../../utils/funs'
import { judgeId } from '../../api/user'
import { staticRecord } from '../../api/index'
import { HTTPS } from '../../utils/const'

export default class IdSend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      frontId: '',
      behindId: '',
      isSuccess: false //节流
    }
  }
  config = {
    navigationBarTitleText: '身份认证',
  }

  chooseImg(id) {
    Taro.chooseImage(
      {
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      }
    ).then(
      (res) => {
        const tempFilePaths = res.tempFilePaths;
        if (id == 1) {
          this.setState({
            frontId: tempFilePaths[0]
          })
        } else {
          this.setState({
            behindId: tempFilePaths[0]
          })
        }
      }
    )
  }
  submitId() {
    let { frontId, behindId, isSuccess } = this.state
    let imglist = []
    if (!frontId) {
      tip('正面照未上传')
      return
    }
    if (!behindId) {
      tip('反面照未上传')
      return
    }
    imglist.push(frontId)
    imglist.push(behindId)
    let param = {
      url: HTTPS + 'common/third/upload',
      path: imglist,
      result: []
    }
    if (!isSuccess) {
      this.setState({
        isSuccess: true
      })
      Taro.showLoading({
        title: '上传中...'
      })
      uploadImgs(param).then(
        res => {
          let param = {
            id_card_photo: res
          }
          judgeId(param).then(
            (res) => {
              if (res.success) {
                //去店铺
                Taro.navigateTo({
                  url: '../sellerHomepage/index?id=' + res.id
                })
                tip('上传成功')
              } else {
                tip(r.msg)
              }
              Taro.hideLoading()
              this.setState({
                isSuccess: false
              })
            }
          )
        }
      )
    }

  }
  componentWillMount() {
  }
  componentDidShow() {
    staticRecord()
  }

  render() {
    let { frontId, behindId } = this.state
    return (
      <View className="page">
        <View className='id-pic' onClick={this.chooseImg.bind(this, 1)}>
          {frontId
            ? ''
            : <Block>
              <Image className='bg xyCenter' src={require('../../static/images/front.png')}></Image>
              <Image className='icon xCenter' src={require('../../static/images/camera-yel.png')}></Image>
            </Block>
          }

          <Image className='id-img' src={frontId} mode='aspectFit'></Image>
          <View className='tip xCenter'>申请人身份证正面照片</View>
        </View>
        <View className='id-pic' onClick={this.chooseImg.bind(this, 2)}>
          {behindId
            ? ''
            : <Block>
              <Image className='bg xyCenter' src={require('../../static/images/behind.png')}></Image>
              <Image className='icon xCenter' src={require('../../static/images/camera-yel.png')}></Image>
            </Block>
          }
          <Image className='id-img' src={behindId} mode='aspectFit'></Image>
          <View className='tip xCenter'>申请人身份证背面照片</View>
        </View>
        <View className='friendly-tips'>
          <View className='head'>温馨提示</View>
          <View className='item'>1、上传申请人身份证并确保信息真实有效</View>
          <View className='item'>2、请用手机横向拍摄以保证图片正常显示</View>
          <View className='item'>3、请确保图片清晰</View>
        </View>
        <View class="order-bottom" onClick={this.submitId}>
          <View >提交认证</View>
        </View>
      </View>
    )
  }
}