import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Textarea, ScrollView } from '@tarojs/components'
import './index.less'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import Modal from '../../components/modal/index'
import { tip, uploadImgs, formatDate, formatTime } from '../../utils/funs'
import { getClassify } from '../../api/goods'
import { publishGoods } from '../../api/store'
import { staticRecord } from '../../api/index'
import { HTTPS } from '../../utils/const'

export default class UploadGoods extends Taro.Component {

  config = {
    navigationBarTitleText: '发布拍品',
  }
  constructor(props) {
    super(props)
    this.state = {
      isSubmit: false,
      isShowModal: false,//显示弹窗
      publishIndex: 2,//底部按钮
      swiperPic: [],
      descPic: [],
      startTime: '请选择',
      isNow: false,
      endTime: '请选择',
      classify: '请选择',
      classifyId: '',
      classifyIdList: [],
      classifyList: [],
      desc: '',
      inputData: {},//form内所有input信息
    }
  }
  chooseImg(param) {
    Taro.chooseImage(
      {
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      }
    ).then(
      (res) => {
        const tempFilePaths = res.tempFilePaths;
        let list = this.state[param].concat(tempFilePaths)
        if (list.length > 10) {
          tip('最多只能上传10张')
          list = this.state[param]
        }
        this.setState({
          [param]: list
        })
      }
    )
  }
  chooseDescPic() {
    this.chooseImg('descPic')
  }
  chooseSwiperPic() {
    this.chooseImg('swiperPic')
  }
  deleteImg(index) {
    this.setState(
      (pre) => {
        pre.swiperPic.splice(index, 1)
      }
    )
  }
  deleteDescImg(index) {
    this.setState(
      (pre) => {
        pre.descPic.splice(index, 1)
      }
    )
  }
  formSubmit(e) {
    console.log(e, '57')
    let index = e.currentTarget.target.dataset.index
    let list = e.currentTarget.value
    this.setState({
      inputData: list,
      publishIndex: index
    })
    if (index == 1) {
      Taro.navigateTo({
        url: './preview'
      })
    }
    if (index == 2) {
      this.publish(list)
    }
  }
  uploadImg(imgs) {
    return new Promise(
      (resolve, reject) => {
        let id = getGlobalData('storeId')
        let param = {
          url: HTTPS + 'common/third/upload?store_id=' + id,
          path: imgs,
          result: []
        }
        if (param.path.length > 0) {
          uploadImgs(param).then(
            res => {
              console.log(res, '99')
              resolve(res)
            }
          )
        } else {
          reject(1)
        }
      }
    )
  }
  publish(list) {
    let { swiperPic, startTime, endTime, classifyId, descPic, isNow, isSubmit } = this.state
    let swiperList = [], descList = []
    let cur = formatTime(startTime) * 1000
    let end = formatTime(endTime) * 1000
    let now = new Date().getTime() - (3600 * 24 * 1000)
    if (cur < now && !isNow) {
      this.setState({
        isShowModal: true
      })
      return
    }
    if (swiperPic.length < 1) {
      tip('无法发布,请上传拍品轮播图')
      return
    }
    if (!list.goodsName) {
      tip('无法发布,请输⼊拍品名称')
      return
    }
    if (!list.startPrice) {
      tip('无法发布,请输⼊起拍价')
      return
    }
    if (!startTime) {
      tip('无法发布,请选择开始时间')
      return
    }
    if (!endTime) {
      tip('无法发布,请选择结束时间')
      return
    }
    if (!classifyId) {
      tip('无法发布,请选择拍品分类')
      return
    }
    if (!list.desc) {
      tip('无法发布,请填写拍品描述')
      return
    }
    if (cur > end) {
      tip('⽆法发布,结束时间不能早于开始时间')
      return
    }
    if (!isSubmit) {
      this.setState({
        isSubmit: true
      })
      Taro.showLoading({
        title: '正在提交'
      })
      this.uploadImg(swiperPic)
        .then(
          res => {
            swiperList = res
            this.uploadImg(descPic).then(
              res => {
                descList = res
                this.pbGoods(swiperList, descList, list, cur, end, classifyId)
              }
            ).catch(res => {
              if (res == 1) {
                this.pbGoods(swiperList, [], list, cur, end, classifyId)
              }
            })
          }
        )
    }
  }
  pbGoods(swiperList, descList, list, cur, end, classifyId) {
    let params = {
      cover_images: swiperList,//拍品轮播图（1~10）1
      name: list.goodsName,	//拍品名1
      start_price: list.startPrice,	//起拍价1
      min_reference_price: list.referStart,	//参考价下限
      max_reference_price: list.referEnd,	//参考价上限
      start_time: Math.ceil(cur / 1000),//拍卖开始时间戳1
      expires_time: Math.ceil(end / 1000),//拍卖结束时间戳1
      classify_id: classifyId,//拍品分类的ID1
      detail: list.desc,	//拍品详细文字描述
      desc_imgs: descList	//拍品描述图片
    }
    publishGoods(params).then(
      res => {
        if (res.success) {
          Taro.navigateTo(
            { url: './preview?path=1' }
          )
          tip('上传成功')
        } else {
          tip(res.msg)
        }
        this.setState({
          isSubmit: false
        })
        Taro.hideLoading()
      }
    )
  }
  changeStartTime(e) {
    let { value } = e.detail
    this.setState({
      startTime: value,
      isNow: false
    })
  }
  changeEndTime(e) {
    let { value } = e.detail
    this.setState({
      endTime: value
    })
  }
  preview(url) {
    Taro.previewImage({
      current: url,
      urls: [url]
    })
  }
  changeClassify(e) {
    let { classifyList, classifyIdList } = this.state
    let { value } = e.detail
    this.setState({
      classify: classifyList[value],
      classifyId: classifyIdList[value]
    })
  }
  onNo() {
    this.setState({
      isShowModal: false
    })
  }
  onYes() {
    let curString = formatDate().split(' ')[0]
    this.setState({
      isNow: true,
      startTime: curString,
      isShowModal: false
    })
  }
  componentWillMount() {
    getClassify().then(
      res => {
        let cList = []
        let idList = []
        res.items.map(
          (item) => {
            cList.push(item.name)
            idList.push(item.id)
          }
        )
        this.setState(
          (pre) => {
            pre.classifyList = cList
            pre.classifyIdList = idList
          }
        )
      }
    )
  }
  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() {
    staticRecord()
  }

  componentDidHide() { }

  render() {
    const { publishIndex, swiperPic, descPic, startTime, endTime, classify, classifyList, isShowModal } = this.state
    const imgList = swiperPic.map((item, index) => {
      return (
        <View className='choose-btn'>
          <Image className='del' src={require('../../static/images/close.png')} onClick={this.deleteImg.bind(this, index)}></Image>
          <Image className='pic-item' src={item} onClick={this.preview.bind(this, item)}></Image>
        </View>
      )
    })
    const descImgList = descPic.map((item, index) => {
      return (
        <Image className='desc-pic-item' src={item} mode='widthFix' onClick={this.preview.bind(this, item)}></Image>
      )
    })
    {/* <Image className='del' src={require('../../static/images/close.png')} onClick={this.deleteDescImg.bind(this, index)}></Image> */ }
    return (
      <View className="page">
        <Form onSubmit={this.formSubmit}>
          <View className='column'>请上传拍品轮播图(1-10张)</View>
          <View className='goods-info'>
            <ScrollView className='choose-pic' scrollX>
              {imgList}
              <View className='choose-btn' onClick={this.chooseSwiperPic}>
                <View className='tip'>头图</View>
                <Image className='xyCenter' src={require('../../static/images/camera.png')}></Image>
              </View>
            </ScrollView>
            <View className='info-item clearfix'>
              <View className="fl">拍品名称</View>
              <View className="fr"><Input name='goodsName' className='store-name' placeholder='请输入2-32个字拍品名称' maxLength='32' /></View>
            </View>
            <View className='info-item clearfix'>
              <View className="fl">起拍价</View>
              <View className="fr">
                <Text>￥</Text>
                <Input name='startPrice' placeholder='请输入起拍价' maxLength='8' type='number' />
              </View>
            </View>
            <View className='info-item clearfix'>
              <View className="fl">参考价</View>
              <View className="fr">
                <Text>￥</Text>
                <Input name='referStart' placeholder='请输入参考价' maxLength='8' type='number' />
                <Text style='margin-left:10rpx;'>至 ￥</Text>
                <Input name='referEnd' placeholder='请输入参考价' maxLength='8' type='number' />
              </View>
            </View>
            <Picker onChange={this.changeStartTime} mode="date">
              <View className='list-item'>
                <View>开始时间</View>
                <View>{startTime}</View>
              </View>
            </Picker>
            <Picker onChange={this.changeEndTime} mode="date">
              <View className='list-item'>
                <View>结束时间</View>
                <View>{endTime}</View>
              </View>
            </Picker>
            <Picker onChange={this.changeClassify} range={classifyList}>
              <View className='list-item'>
                <View>拍品分类</View>
                <View>{classify}</View>
              </View>
            </Picker>
          </View>
          <View className='column'>拍品描述</View>
          <View className='goods-des'>
            {!isShowModal && <Textarea name='desc' placeholder='请描述您的拍品'></Textarea>}
            <View className='desc-choose-pic'>
              {descImgList}
              <View className='desc-choose-btn' onClick={this.chooseDescPic}>
                <Image className='' src={require('../../static/images/addpic.png')}></Image>
                <View className='tip'>增加图片</View>
              </View>
            </View>
          </View>
          <View className="order-bottom">
            <View className='btn-box clearbox'>
              <View className={`btn ${publishIndex == 1 ? 'select' : ''}`} data-index='1'>预览拍品<Button className='submit' form-type="submit" data-index='1'></Button></View>
              <View className={`btn ${publishIndex == 2 ? 'select' : ''}`} data-index='2'>发布拍品<Button className='submit' form-type="submit" data-index='2'></Button></View>
            </View>
          </View>
        </Form>
        <Modal show={isShowModal} onNo={this.onNo} onYes={this.onYes}></Modal>
      </View>
    )
  }
}

