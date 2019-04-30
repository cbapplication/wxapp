import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.css'
import guanzhuchenggong from '../../static/images/guanzhuchenggong.png'
import chujiayouxian from '../../static/images/chujiayouxian.png'
import nocheck from '../../static/images/agreement.png'
export default class FollowModel extends Taro.Component {
    static defaultProps = {
        msg: ''
    }
    state = {
        show: false,//图标状态
        url: ''//图片地址
    }
    componentDidMount() {
        if (this.props.msg != '') {
            console.log(this.props.msg)
            switch (this.props.msg) {
                case '关注成功':
                    this.setState({ url: guanzhuchenggong })
                    break;
                case '出价优先':
                    this.setState({ url: chujiayouxian })
                    break;
                case '卖家协议未勾选':
                    this.setState({ url: nocheck })
                    break;
                default:
                    break;
            }
            this.setState({ show: true })
            setTimeout(() => {
                this.setState({ show: false })
            }, 2000)
        }
        return
    }
    render() {
        const { msg } = this.props;
        return (
            <View className="page">
                <View className={`modal ${this.state.show ? '' : 'model-hidden'}`} catchtouchmove="preventD">
                    <Image className="model-image" src={this.state.url} />
                    <View className="model-msg">{msg}</View>
                </View>
            </View>
        )
    }
}