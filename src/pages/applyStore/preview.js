import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'
import './preview.less'
import { applyStore } from '../../api/user'
import { staticRecord } from '../../api/index'
import { tip, uploadImgs } from '../../utils/funs'
import { HTTPS } from '../../utils/const'
export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnIndex: 2,
      preData: {},
      isSubmit: false,
    }
  }
  config = {
    navigationBarTitleText: '信息确认',
  }
  clickBtmBtn(e) {
    let index = e.currentTarget.dataset.index
    this.setState({
      btnIndex: index
    }, () => {
      if (this.state.btnIndex == 1) {
        this.goBack()
      } else {
        this.goCheck()
      }
    })
  }
  goBack() {
    Taro.navigateBack({
      delta: 1
    })
  }
  uploadImg(imgs) {
    return new Promise(
      (resolve) => {
        let param = {
          url: HTTPS + 'common/third/upload',
          path: imgs,
          result: []
        }
        uploadImgs(param).then(
          res => {
            console.log(res, '44')
            resolve(res)
          }
        )
      }
    )
  }
  goCheck() {
    let { preData, chooseList, imgSrc, storeName, storeDesc, imgIntroduceList } = this.state.preData
    let { isSubmit } = this.state
    let idList = []
    let avatar = ''
    Taro.showLoading({
      title: '正在提交',
      mask: true
    })
    if (!isSubmit) {
      this.setState({
        isSubmit: true
      })
      chooseList.map(
        (item) => {
          idList.push(item.id)
        }
      )
      this.uploadImg([imgSrc]).then(
        res => {
          avatar = res[0]
          this.uploadImg(imgIntroduceList).then(
            res => {
              let params = {
                man: preData.infoList.name,
                mobile: preData.infoList.tel,
                recommend_code: preData.infoList.suggest,
                verify_code: preData.infoList.verify,
                avatar: avatar,
                name: storeName,
                description: storeDesc,
                desc_imgs: res,
                classify_ids: idList
              }

              applyStore(params).then(
                (res) => {
                  this.setState({
                    isSubmit: false
                  })
                  Taro.hideLoading()
                  if (res.success == 0) {
                    Taro.navigateTo({
                      url: './check?status=0'
                    })
                  } else {
                    switch (res.success + '') {
                      case '2000':
                        tip('你已有店铺，请跳转到店铺')
                        break;
                      case '2001':
                        tip('你已有店铺在申请中，请勿重复申请')
                        break;
                      default:
                        tip(res.msg)
                        break;
                    }
                  }
                }
              )
            }
          )
        }
      )
    } else {
      tip('请勿重复申请')
    }

  }

  componentWillMount() {
    let page = Taro.getCurrentPages()
    let prePage = page[page.length - 2]
    console.log(prePage.data, '上个页面')
    this.setState({
      preData: prePage.data
    })
  }

  componentDidShow() {
    staticRecord()
  }

  componentDidHide() { }
  render() {
    let { preData } = this.state
    let _preData = preData.preData || {}
    let personalList = _preData.infoList
    let imgList = preData.imgIntroduceList.map(
      (item) => {
        return (
          <Image className='' mode='widthFix' src={item} key={item}></Image>
        )
      }
    )
    return (
      <View className="page">
        <View className='head-tip'>温馨提示：请确认提交信息，确保填写的信息无误</View>
        <View className='column'>个人信息</View>
        <View className='personal-info-list'>
          <View className='item clearfix' onClick={this.goBusiness}>
            <View className='fl'>申请人</View>
            <View className='fl tip'>{personalList.name}</View>
          </View>
          <View className='item clearfix' onClick={this.goBusiness}>
            <View className='fl'>手机号</View>
            <View className='fl tip'>{personalList.tel}</View>
          </View>
          <View className='item clearfix' onClick={this.goBusiness}>
            <View className='fl'>推荐码</View>
            <View className='fl tip'>{personalList.suggest}</View>
          </View>
        </View>
        <View className='column'>店铺信息</View>
        <View className='store-info-list'>
          <View className='head-pic'>
            <Image className='upload-icon' src={preData.imgSrc} onClick={this.showModel} />
            <View className='tip'>店铺logo</View>
          </View>
          <View className='item clearfix' onClick={this.goBusiness}>
            <View className='fl'>店铺名称</View>
            <View className='fl tip'>{preData.storeName}</View>
          </View>
          <View className='item clearfix' onClick={this.goBusiness}>
            <View className='fl'>经营范围</View>
            <View className='fl tip'>{preData.storeScopeStr}</View>
          </View>
          <View className='introduce'>店铺介绍</View>
          <View className='intro-content'>
            {preData.storeDesc}
          </View>
          <View className='img-list'>
            {imgList}
          </View>
        </View>
        <View className="order-bottom">
          <View className='btn-box clearbox'>
            <View className={`btn ${btnIndex == 1 ? 'select' : ''}`} onClick={this.clickBtmBtn} data-index='1'>上一步</View>
            <View className={`btn ${btnIndex == 2 ? 'select' : ''}`} onClick={this.clickBtmBtn} data-index='2'>下一步</View>
          </View>
        </View>
      </View>
    )
  }
}