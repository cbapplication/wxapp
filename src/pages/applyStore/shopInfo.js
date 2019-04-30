import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './shopInfo.less'
import { tip } from '../../utils/funs'
import { staticRecord } from '../../api/index'
import addImg from '../../static/images/addpic.png'
import WeCropper from '../../components/weCropper/index.js'
export default class ShopInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnIndex: 2,
      preData: {},//上个页面数据
      isShowCropper: false,//显示裁切插件
      imgSrc: '',//店铺logo
      chooseList: [],//经营范围列表
      imgIntroduceList: [],//描述图片列表
      storeName: '',//商铺名称
      storeDesc: '',//商铺描述
      storeScopeStr: '',//经营范围
    }
  }
  config = {
    navigationBarTitleText: '店铺信息'
  }
  clickBtmBtn(e) {
    let index = e.currentTarget.dataset.index
    this.setState({
      btnIndex: index
    }, () => {
      if (this.state.btnIndex == 1) {
        this.goBack()
      } else {
        this.goPreview()
      }
    })
  }
  goBack() {
    Taro.navigateBack({
      delta: 1
    })
  }
  goPreview() {
    let { imgSrc, chooseList, storeName, storeDesc, imgIntroduceList } = this.state
    if (!imgSrc) {
      tip('请上传店铺头像')
      return
    }
    if (!storeName) {
      tip('请填写店铺名称')
      return
    }
    if (chooseList.length < 1) {
      tip('请选择经营范围')
      return
    }

    if (!storeDesc) {
      tip('请填写店铺介绍')
      return
    }
    if (imgIntroduceList.length < 5) {
      tip('图⽚介绍最少需要上传5张')
      return
    }
    Taro.navigateTo({
      url: './preview'
    })
  }
  goBusiness() {
    Taro.navigateTo({
      url: './business'
    })
  }
  showModel() {
    this.setState({
      isShowCropper: true
    })
    Taro.chooseImage(
      {
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      }
    ).then(
      (res) => {
        console.log(res, '图片信息71')
        const tempFilePaths = res.tempFilePaths[0];
        this.setState({
          imgSrc: tempFilePaths
        })
      }
    )
  }
  closeModel() {
    this.setState({
      isShowCropper: false
    })
  }
  selectImg() {
    Taro.chooseImage(
      {
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      }
    ).then(
      (res) => {
        const tempFilePaths = res.tempFilePaths;
        let list = this.state.imgIntroduceList.concat(tempFilePaths)
        if (list.length > 10) {
          tip('最多只能上传10张')
          list = this.state.imgIntroduceList
        }
        this.setState({
          imgIntroduceList: list
        })
      }
    )
  }
  setImgResult(src) {
    this.setState({
      imgSrc: src
    })
  }
  setStoreName(e) {
    this.setState({
      storeName: e.detail.value
    })
  }
  setStoreDesc(e) {
    this.setState({
      storeDesc: e.detail.value
    })
  }

  componentWillMount() {
    let page = Taro.getCurrentPages()
    let prePage = page[page.length - 2]
    console.log(prePage.data, '上个页面')
    this.setState({
      preData: prePage.data
    })
  }

  componentDidMount() {

  }
  componentWillUpdate() {

  }

  componentWillUnmount() { }

  componentDidShow() {
    let chooseList = getGlobalData('chooseList') || []
    this.setState(
      (pre) => {
        pre.chooseList = chooseList
        let storeScopeStr = ''
        chooseList.map(
          (item) => {
            storeScopeStr += (item.name + '、')
          }
        )
        storeScopeStr = storeScopeStr.split('')
        storeScopeStr.pop()
        storeScopeStr = storeScopeStr.join('')
        pre.storeScopeStr = storeScopeStr
      }
    )
    staticRecord()
  }

  componentDidHide() { }
  render() {
    const { btnIndex, isShowCropper, imgSrc, imgIntroduceList, storeName, storeDesc, storeScopeStr } = this.state
    const imgList = imgIntroduceList.map(
      (item) => {
        return (
          <Image className='icon' src={item} key={item}></Image>
        )
      }
    )
    return (
      <View className="page">
        <View className={`head-pic ${imgSrc ? 'has-tip' : ''}`}>
          <Image className='upload-icon' src={imgSrc ? imgSrc : addImg} onClick={this.showModel} />
          <View className='tip'>{imgSrc ? '店铺logo' : '点击上传店铺logo'}</View>
        </View>
        <View className='content'>
          <View className='item clearfix'>
            <View className='fl'>店铺名称</View>
            <Input name='name' className='fl' placeholder='请输入店铺名称' placeholder-style='color:#b6b6b6;' value={storeName} onInput={this.setStoreName}></Input>
          </View>
          <View className='item clearfix' onClick={this.goBusiness}>
            <View className='fl'>经营范围</View>
            <View className='fl tip'>{storeScopeStr ? storeScopeStr : '请输入经营范围'}</View>
            <Image className='arrow yCenter' src={require('../../static/images/rightIcon.png')}></Image>
          </View>
          <View className='introduce'>
            <View>店铺介绍</View>
            {!isShowCropper && <Textarea placeholder='一个好的店铺介绍，可以增加审核通过的几率哦' maxlength='156' placeholder-style='color:#b6b6b6;' value={storeDesc} onInput={this.setStoreDesc}></Textarea>}
          </View>
          <View className='upload-tip'>请上传图片介绍（图片不可少于5张）</View>
          <ScrollView className='pic-introduce' scrollX>
            {imgList}
            <Image className='icon' src={require('../../static/images/addpic.png')} onClick={this.selectImg} />
          </ScrollView>
        </View>
        <View className="order-bottom">
          <View className='btn-box clearbox'>
            <View className={`btn ${btnIndex == 1 ? 'select' : ''}`} onClick={this.clickBtmBtn} data-index='1'>上一步</View>
            <View className={`btn ${btnIndex == 2 ? 'select' : ''}`} onClick={this.clickBtmBtn} data-index='2'>下一步</View>
          </View>
        </View>
        <WeCropper isShowCropper={isShowCropper} onCloseModel={this.closeModel.bind(this)} imgSrc={imgSrc} onSetImgResult={this.setImgResult}></WeCropper>
      </View>
    )
  }
}