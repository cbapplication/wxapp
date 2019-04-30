import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import { walletRecordDetail } from '../../api/user'
import { staticRecord } from '../../api/index'
export default class account extends Taro.Component {

    config = {
        navigationBarTitleText: '账户明细',
    }
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }

    componentWillMount() {
        const { id } = this.$router.params;
        console.log(this.$router)
        this.WalletRecordDetail(id)
    }
    componentDidShow() {
        staticRecord()
    }
    //获取钱包详情
    WalletRecordDetail(id) {
        walletRecordDetail(id).then(res => {
            if (res.success) {
                this.setState(pre => {
                    pre.detail = res
                })
            }
        })
    }
    render() {
        let { detail } = this.state;
        return (
            <View className="page">
                <ScrollView className='page-body' scroll-y scroll-with-animation>
                    <View className='page-line'>
                        <Text className='page-line-name'>平台交易号</Text>
                        <Text className='page-line-value'>{detail.record_number}</Text>
                    </View>
                    <View className='page-line'>
                        <Text className='page-line-name'>交易金额</Text>
                        {detail.classify == '钱包充值' && <Text className='page-line-value money'>+¥{detail.money}</Text>}
                        {detail.classify == '货款结算' && <Text className='page-line-value money'>+¥{detail.money}</Text>}
                        {detail.classify == '保证金支付' && <Text className='page-line-value money'>-¥{detail.money}</Text>}
                        {detail.classify == '尾款支付' && <Text className='page-line-value money'>-¥{detail.money}</Text>}
                        {detail.classify == '钱包提现' && <Text className='page-line-value money'>-¥{detail.money}</Text>}
                        {detail.classify == '保证金扣除' && <Text className='page-line-value money'>-¥{detail.money}</Text>}
                    </View>
                    <View className='page-line'>
                        <Text className='page-line-name'>交易时间</Text>
                        <Text className='page-line-value'>{detail.ctime}</Text>
                    </View>
                    <View className='page-line'>
                        <Text className='page-line-name'>账单分类</Text>
                        <Text className='page-line-value'>{detail.classify}</Text>
                    </View>
                    <View className='page-line'>
                        <Text className='page-line-name'>交易方式</Text>
                        <Text className='page-line-value'>{detail.type}</Text>
                    </View>
                    <View className='page-line'>
                        <Text className='page-line-name'>交易状态</Text>
                        {detail.status == '处理中s'
                            ? <Text className={`page-line-value handle`}>{detail.status}</Text>
                            : <Text className='page-line-value'>{detail.status}</Text>
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

