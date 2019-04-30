import Taro from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import './index.less'

export default class preLoading extends Taro.Component {
    static defaultProps ={
        show : true
    }
    state = {
        rate: 0.5,//倍率
    }
     componentWillMount () {
        let _this = this;
        return new Promise((resolve,rej) => { 
            _this.setState( pre => {
                pre.rate = ((Taro.getSystemInfoSync().screenWidth)/ 750).toFixed(2)
                resolve()
            })
        })
      }
     componentDidMount(){
        this.drawCanvas("loadId");
     }
    // 画图
    drawCanvas(id) {
            let {rate} = this.state;
            //创建画布上下文要加this参数指向
            const ctx = Taro.createCanvasContext(id,this.$scope);
            ctx.setFillStyle("#f5f6fa");
            ctx.fillRect(0, 0, (750 * rate), (1300 * rate));
            ctx.setFillStyle("#d8d8d8");
            ctx.fillRect((30*rate), (10*rate), (690 * rate), (68 * rate));
            ctx.fillRect((262*rate), (100*rate), (200 * rate), (40 * rate));
            ctx.fillRect((620*rate), (100*rate), (100 * rate), (40 * rate));
            ctx.fillRect((30*rate), (160*rate), (690 * rate), (400 * rate));
            ctx.fillRect((30*rate), (580*rate), (360 * rate), (40 * rate));
            ctx.fillRect((30*rate), (630*rate), (300 * rate), (40 * rate));
            ctx.fillRect((640*rate), (580*rate), (80 * rate), (100 * rate));
            ctx.fillRect((262*rate), (690*rate), (200 * rate), (40 * rate));
            ctx.fillRect((30*rate), (750*rate), (320 * rate), (320 * rate));
            ctx.fillRect((400*rate), (750*rate), (320 * rate), (320 * rate));
            ctx.fillRect((30*rate), (1080*rate), (280 * rate), (40 * rate));
            ctx.fillRect((400*rate), (1080*rate), (280 * rate), (40 * rate));
            ctx.fillRect((30*rate), (1130*rate), (200 * rate), (40 * rate));
            ctx.fillRect((400*rate), (1130*rate), (200 * rate), (40 * rate));
            ctx.stroke();
            ctx.draw(true);
    }
  render () {
    const {show} = this.props;
    return (
        <View className={`page ${show?'show':'hidden'}`}>
            <Canvas canvas-id="loadId" disable-scroll="true" style={`pointer-events: none;width: 750rpx;height: 1300rpx;z-index:999`}></Canvas>
        </View>
    )
  }
}