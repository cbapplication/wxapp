import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
export default class WeCropper extends Component {
  static defaultProps = {
    imgSrc: ''
  }
  constructor(props) {
    super(props)
    this.state = {
      width: 250,//宽度
      height: 250,//高度
      angle: 0,//角度
      clickTime: 0
    }
  }
  config = {
    usingComponents: {
      'image-cropper': './image-cropper'
    }
  }
  cropperload(e) {
    console.log("cropper初始化完成");
    console.log(this, '20')
    console.log(e)
  }
  loadimage(e) {
    console.log("图片加载完成", e.detail)
    //重置图片角度、缩放、位置
    this.cropper.imgReset()
    Taro.hideLoading()
  }
  previewImg(e) {
    console.log(e.detail)
    //点击裁剪框阅览图片
    Taro.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  }
  close() {
    this.props.onCloseModel()
    return false
  }
  getImage() {
    this.cropper.getImg(
      (res) => {
        console.log(res)
        this.props.onSetImgResult(res.url)
        this.props.onCloseModel()
      }
    )
  }
  setAngle() {
    this.setState(
      (pre) => {
        ++pre.clickTime
        pre.angle = pre.clickTime * 90
      }
    )
  }
  componentWillMount() {
    this.cropper = this.$scope.selectComponent("#image-cropper")
  }

  componentDidMount() {

  }
  componentWillUpdate() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  render() {
    const { width, height, angle } = this.state
    const { isShowCropper, imgSrc } = this.props
    return (
      <View className={`page ${isShowCropper ? '' : 'hide'}`}>
        <image-cropper
          id="image-cropper"
          limit_move={true}
          disable_rotate={true}
          width={width}
          height={height}
          disable_width={true}
          disable_height={true}
          angle={angle}
          imgSrc={imgSrc}
          onLoad={this.cropperload}
          onImageload={this.loadimage}
          onTapcut={this.previewImg}>
        </image-cropper>
        <View className='btm-box'>
          <View className='btm-btn' onClick={this.close}>取消</View>
          <View className='btm-btn' onClick={this.setAngle}>旋转</View>
          <View className='btm-btn' onClick={this.getImage}>确定</View>
        </View>
      </View>
    )
  }
}