import Taro from '@tarojs/taro'
import { View, Image, CheckboxGroup, Text, Checkbox } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.css'
import closeIcom from "../../static/images/rightIcon.png"

import { bail } from '../../api/pay'
import {formatMoney2} from '../../utils/funs'
export default class FollowModel extends Taro.Component {
    static defaultProps = {
        show: false,
        bailObj: {}
    }
    state = {
        wechat: false
    }
    close() {
        this.props.onCloseBail()
    }
    contactService() {
        this.props.onContactService()
    }
    payMethod() {
        let { wechat } = this.state;
        if (wechat) {
            this.setState(pre => {
                pre.wechat = false
            })
        } else {
            this.setState(pre => {
                pre.wechat = true
            })
        }

    }
    recharge() {
        const { bailObj } = this.props;
        let { wechat } = this.state;
        let _this = this;
        if (wechat) {
            bail({ money: bailObj.bail - bailObj.money }).then(res => {
                wx.requestPayment({
                    timeStamp: res.timeStamp,
                    nonceStr: res.nonceStr,
                    package: res.package,
                    signType: res.signType,
                    paySign: res.paySign,
                    success(r) {
                        Taro.showToast({ icon: 'none', title: '充值成功' })
                        _this.close()
                    },
                    fail(err) {
                        Taro.showToast({ icon: 'none', title: '充值失败' })
                    }
                })
            })
        } else {
            Taro.showToast({ icon: 'none', title: '请选择支付方式' })
        }
    }
    componentDidUpdate() {
        const { bailObj } = this.props;
        // debugger
    }
    render() {
        const { bailObj } = this.props;
        let { wechat } = this.state;
        return (
            <View className="page">
                <View onClick={this.close} className={this.props.show ? 'box' : ''} catchtouchmove="preventD"></View>
                <View className={`model ${this.props.show ? '' : 'hidden'} ${getGlobalData('phoneModel') ? 'model-phone-padded' : ''}`} catchtouchmove="preventD">
                    <View onClick={this.close} className="model-close">
                        <Image src={closeIcom} />
                    </View>
                    <View className='model-block'>
                        <View className='model-title'>
                            <Text>充值金额</Text>
                            <Text>¥{formatMoney2(bailObj.bail - bailObj.money )}</Text>
                        </View>
                        <View className='model-line'>
                            <Text>拍品保障金</Text>
                            <Text>¥{formatMoney2(bailObj.bail)}</Text>
                        </View>
                        <View className='model-line'>
                            <Text>余额</Text>
                            <Text>¥{formatMoney2(bailObj.money)}</Text>
                        </View>
                    </View>
                    <View className='model-block'>
                        <View className='model-text model-pad'>该拍品需缴保障金¥{formatMoney2(bailObj.bail - bailObj.money)}</View>
                        <View className='model-text model-pad'>竞拍成功，可用于缴纳贷款</View>
                        <View className='model-text'>保证金只有在出价领先时会被冻结，未冻结时可用于出价或缴纳其他拍品保证金</View>
                    </View>
                    <View className='model-block'>
                        <CheckboxGroup onChange={this.radioChange.bind(this)} className="pay-type">
                            <View onClick={this.payMethod} className="pay-method-2">
                                <Image src={require("../../static/images/weixin.png")} />
                                <View className="pay-explain">
                                    <View>微信支付</View>
                                    <View>单笔最高¥5,000-50,000</View>
                                </View>
                                <Checkbox checked={wechat} color="#fbbb30" />
                            </View>
                            <View className="pay-method">
                                <Image src={require("../../static/images/huikuan.png")} />
                                <View className="text">汇款或其他方式支付</View>
                                <Text onClick={this.contactService}>联系客服</Text>
                            </View>
                        </CheckboxGroup>
                    </View>
                    <View className='model-padding'></View>
                    <View className={`model-bottom ${getGlobalData('phoneModel') ? 'model-bottom-phoneModel' : ''}`}>
                        <View className='model-bottom-price'>充值金额 <Text>￥{formatMoney2((bailObj.bail - bailObj.money).toFixed(2))} </Text></View>
                        <View className='model-bottom-pay' onClick={this.recharge}>确认充值</View>
                    </View>
                </View>
            </View>
        )
    }
}