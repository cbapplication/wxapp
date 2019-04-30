import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import NavItem from "../../components/navItem/index"
import { IMG_BASE,HTTPS } from '../../utils/const'
import { getMyStore, editAvatar, editDescription } from '../../api/store'
import { staticRecord } from '../../api/index'
import { tip } from '../../utils/funs'
export default class StoreInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSrc: '',
      name: '',
      level: '',
      classify: '',//经营范围
      classifyIds: [],
      address: '',
      time: '',//开店时间
      recommendCode: '',//推荐码
      detail: ''//描述
    }
  }
  config = {
    navigationBarTitleText: '店铺资料',
  }
  setInfo(e) {
    console.log(e, '16')
    let { name, address } = this.state
    let itemType = e.currentTarget.dataset.value
    if (itemType == '店铺名称') {
      Taro.navigateTo({ url: `./storeName?storeName=${name}` })
    }
    if (itemType == '经营范围') {
      Taro.navigateTo({
        url: '../applyStore/business?source=storeInfo'
      })
    }
    if (itemType == '商家地址') {
      Taro.navigateTo({
        url: './address?address=' + address
      })
    }
  }
  chooseHeader() {
    let _this = this
    Taro.chooseImage(
      {
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      }
    ).then(
      (res) => {
        const tempFilePaths = res.tempFilePaths[0];
        Taro.uploadFile({
          url: HTTPS+'index/store/editAvatar?store_id=' + getGlobalData('storeId'),
          filePath: tempFilePaths,
          name: 'avatar',
          success: function (res) {
            let result = JSON.parse(res.data)
            tip('头像修改成功')
            _this.setState({
              imgSrc: IMG_BASE + result.data.path
            })
          },
          fail: function () {
            tip('头像修改失败')
          }
        })
      }
    )
  }
  inputDesc(e) {
    this.setState({
      detail: e.detail.value
    })
  }
  setDesc(e) {
    let val = e.detail.value
    if (!val) { return }
    let obj = {
      store_id: getGlobalData('storeId'),
      description: val
    }
    editDescription(obj)(res => {
      if (res.success) {
        //...
        tip('描述修改成功')
      } else {
        Taro.showToast({ icon: 'none', title: '修改失败' })
      }
    }
    )
  }
  componentWillMount() {

  }
  componentDidShow() {
    getMyStore().then(
      (res) => {
        this.setState({
          imgSrc: IMG_BASE + res.avatar,
          name: res.name,
          level: res.level,
          classify: res.classify_name,
          classifyIds: [],
          address: res.address,
          time: res.ctime,
          recommendCode: res.recommend_code,
          detail: res.description
        })
      }
    )
    staticRecord()
  }
  componentDidHide() { }
  render() {
    const { imgSrc, name, level, classify, address, time, recommendCode, detail } = this.state
    const infoList = [
      { itemKey: '店铺名称', itemValue: `${name || '请输入'}`, isShowArrow: true },
      { itemKey: '店铺等级', itemValue: `${level}` },
      { itemKey: '经营范围', itemValue: `${classify || '请选择'}`, isShowArrow: true },
      { itemKey: '商家地址', itemValue: `${address || '请选择'}`, isShowArrow: true },
      { itemKey: '店铺推荐码', itemValue: `${recommendCode}` },
      { itemKey: '平台开店时间', itemValue: `${time}` }
    ]
    const navList = infoList.map((value) => {
      return <NavItem key={value.itemKey} itemData={value} onSet={this.setInfo}></NavItem>
    })
    return (
      <View className="page">
        <View className='column'>基本信息</View>
        <View className='list'>
          <View className='head-icon clearfix'>
            <View className='fl'>店铺头像</View>
            <View className='fr' onClick={this.chooseHeader}>
              <View className='icon yCenter'>
                <Image src={imgSrc} mode='aspectFill' />
              </View>
              <Image className='arrow yCenter' src={require('../../static/images/rightIcon.png')} />
            </View>
          </View>
          {navList}
        </View>
        <View className='column'>店铺介绍</View>
        {!this.state.isShowChoice && <Textarea className='store-introduce' placeholder='店铺介绍6-78字' maxlength='78' value={detail} onInput={this.inputDesc} onConfirm={this.setDesc} onBlur={this.setDesc}></Textarea>}
      </View>
    )
  }
}