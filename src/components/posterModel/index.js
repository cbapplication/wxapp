import Taro from '@tarojs/taro'
import { View,Image, Canvas, CoverView, CoverImage } from '@tarojs/components'
import './index.css'
import close from "../../static/images/close.png"
import {postTime} from '../../utils/funs'
import {IMG_BASE} from '../../utils/const'
export default class poster extends Taro.Component {
    static defaultProps ={
        show : false,
    }
    state = {
        rate: 0.5,//海报倍率
    }
     componentWillMount () {
        let _this = this;
        Taro.getSystemInfo({
            success: function (res) {
             _this.setState({rate:(res.screenWidth / 750).toFixed(2)});
            }
        });
      }
     componentDidMount(){
        this.poster();
     }
    //取消
    handclose(){
        this.props.onClosePosterModel()
    }
    //海报
    poster() {
        this.showPicture = true;
        this.drawCanvas("share");
    }
    // 画图
    drawCanvas(id) {
            let {rate} = this.state;
            let {postDate} = this.props;
            let priceBg= postDate.goods_status ? '#fadd5a':'#a0c69c';
            let priceColor = postDate.goods_status ? '#fad44b' : '#a0c69c';
            let priceText = postDate.goods_status ? '成交价' : '起拍价' ;
            let priceNum = postDate.goods_status ? postDate.price : postDate.start_price;
            //创建画布上下文要加this参数指向
            const ctx = Taro.createCanvasContext(id,this.$scope);
            ctx.setFillStyle("#fff");
            ctx.fillRect(0, 0, (500 * rate), (889.4 * rate));
            Taro.getImageInfo({
                src: IMG_BASE+postDate.cover_image,
                success: function(res) {
                    ctx.drawImage(res.path, (20*rate), (53.4*rate), (460*rate), (400*rate));
                    ctx.stroke();
                    ctx.draw(true);
                }
            });
            //名字
            ctx.setFillStyle("#423839");
            ctx.setFontSize((24 * rate));
            let maxLength = 19;
            let goodsName = postDate.name||'';
            if(goodsName.length>maxLength){
                ctx.fillText(goodsName.substring(0,maxLength), (20*rate), (493.4*rate));
                ctx.fillText(goodsName.substring(maxLength), (20*rate), (530.4*rate));
                //字体加粗
                ctx.fillText(goodsName.substring(0,maxLength), (20.5*rate), (494*rate));
                ctx.fillText(goodsName.substring(maxLength), (20.5*rate), (531*rate));
            }else{
                ctx.fillText(goodsName, (20.5*rate), (494*rate));
            }
            //起拍价背景
            ctx.setFillStyle(priceBg);
            ctx.fillRect((20*rate), (600*rate), (64*rate), (29.4*rate));
            //起拍价
            ctx.setFillStyle("#000000");
            ctx.setFontSize((16 * rate));
            ctx.fillText(priceText, (29*rate), (621*rate));
            ctx.setFillStyle(priceColor);
            ctx.setFontSize((37.4 * rate));
            ctx.fillText('¥'+priceNum, (20*rate), (678*rate));
            //参考价
            ctx.setFillStyle("#979797");
            ctx.setFontSize((17.4 * rate));
            ctx.fillText("参考价:￥"+postDate.min_reference_price+"~￥"+postDate.max_reference_price, (20*rate), (710.4*rate));
            //拍卖时间
            ctx.setFillStyle("#423839");
            ctx.setFontSize((16 * rate));
            ctx.fillText("拍卖时间", (20*rate), (789.4*rate));
            ctx.setFillStyle("#423839");
            ctx.setFontSize((20 * rate));
            ctx.fillText(postTime(postDate.start_time)+'-'+postTime(postDate.expires_time), (20*rate), (818.6*rate));
            //商品码
            Taro.getImageInfo({
                src: "https://cbapplication.github.io/cb/code.png",
                success: function(res) {
                    ctx.drawImage(res.path, (372*rate), (684*rate), (108*rate), (108*rate));
                    ctx.stroke();
                    ctx.draw(true);
                }
            }); 
            ctx.setFillStyle("#979797");
            ctx.setFontSize((12 * rate));
            ctx.fillText("扫描或长按小程序码", (372*rate), (814*rate));
            ctx.stroke();
            ctx.draw(true);
    }
    //保存海报按钮
    saveImage() {
        var that = this;
        Taro.getSetting({
            success(res) {
                if (!res.authSetting["scope.writePhotosAlbum"]) {
                    Taro.authorize({
                        scope: "scope.writePhotosAlbum",
                        success() {
                            that.saveImageToPhoto();
                        },
                        fail(err){
                            //console.log("用户拒绝");
                            wx.showModal({
                                title: '提示',
                                content: '是否重新授权',
                                success(res) {
                                  if (res.confirm) {
                                    Taro.openSetting({
                                        success(settingdata) {
                                            if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                                                that.saveImageToPhoto();
                                            } else {
                                                console.log("获取权限失败")
                                            }
                                        }
                                   })
                                  } else if (res.cancel) {
                                    console.log('用户点击取消')
                                  }
                                }
                              })
                        }
                    })
                } else {
                    that.saveImageToPhoto();
                }
            }
        });
    }
    //保存图片
    saveImageToPhoto() {
        let that = this;
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: "share",
            success: function(res) {
                Taro.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                            Taro.showToast({ title: "已保存到相册" });
                            that.handclose()
                        } else {
                            console.log('保存失败')
                        }
                    }
                });
            },
            fail: function(res) {
                Taro.hideLoading();
            }
        },this.$scope);
    }
  render () {
    const {show} = this.props;
    return (
        <View className={`page ${show?'show':'hidden'}`}>
            <View onClick={this.handclose} className={`${show?'box':''}`} catchtouchmove="preventD"></View>
            <View className={`modal ${show?'':'model-hidden'}`} catchtouchmove="preventD">
                {/* 分享画图 */}
                <Image className="model-image" onClick={this.handclose} src={close}/>
                <Canvas canvas-id="share" disable-scroll="true" style={`pointer-events: none;width: 500rpx;height: 889.4rpx;z-index:999`}>
                   <CoverView catchtouchmove="preventD" className='model-cover'>
                       <CoverImage className='model-image' src={close}/>
                   </CoverView>
                </Canvas>
                <View className="saveImage" onClick={this.saveImage}>保存图片</View>
            </View>
        </View>
    )
  }
}