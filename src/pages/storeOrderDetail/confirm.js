import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, ScrollView, Input } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import AnimateLayer from '../../components/animateLayer/index'
import {shipments,deliver} from '../../api/order'
import {formatMoney} from '../../utils/funs'
import {IMG_BASE} from '../../utils/const'
import { staticRecord } from '../../api/index'
export default class StoreOrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chooseIndex: '',
      method: '请选择配送方式',
      isShowModel: false,
      orderDetail:{},//订单信息
      express_name:'',
      express_sn:''
    }
  }
  config = {
    navigationBarTitleText: '确认发货',
  }
  showModel() {
    let isShow = this.state.isShowModel
    this.setState({
      isShowModel: !isShow,
    })
  }
  chooseAddress(name, index) {
    this.setState({
      chooseIndex: index,
      method: name,
      isShowModel:false,
      express_name:name
    })
  }
  //获取订单号
  express_sn(e){
    const {value} = e.detail
    this.setState( pre => {
      pre.express_sn = value
    })
  }
  //其他物流
  express_name(e){
    const {value} = e.detail
    this.setState( pre => {
      pre.express_name = value
    })
  }
  confirm(){
    const { id} = this.$router.params;
    let{ express_name,express_sn} = this.state;
    if(express_name == '' || express_sn == '') return Taro.showToast({icon:'none',title:'请填写完整物流信息'})
    let params = {
       id:id,
       express_name:express_name,
       express_sn:express_sn
    }
    this.Deliver(params)
  }
  componentDidShow(){
    staticRecord()
  }
  componentWillMount() {
     const { id} = this.$router.params;
     this.getShipments(id)
  }
  //获取发货信息
  getShipments(id){
    shipments(id).then( res => {
       if(res.success){
         this.setState( pre => {
           pre.orderDetail = res.data
         })
       }
    })
  }
  //发货
  Deliver(params){
    deliver(params).then( res => {
      if(res.success){
        Taro.navigateBack()
      }
    })
  }
  render() {
    let { chooseIndex, method,orderDetail } = this.state;
    const address = this.state.orderDetail.address || {};
    const {express_name_list} = address;
    const content = (express_name_list || []).map((name, index) => {
      return (
        <View onClick={this.chooseAddress.bind(this, name, index)} className="list-item clearfix" key={String(index)}>
          <View className="fl">{name}</View>
          <View className="radio yCenter">
            {chooseIndex == index && <Image className='xyCenter' src={require('../../static/images/guanzhuchenggong.png')} />}
          </View>
        </View>
      )
    })
    return <View className='page'>
      <ScrollView className="order-list" scroll-y scroll-with-animation>
        <View className='personal-info'>
          <View className='clearfix'>
            <View className='name fl'>收货人：{address.accept_man}</View>
            <View className='tel fr'>{address.accept_phone}</View>
          </View>
          <View className='address'>
             {
               address.province_name == address.city_name
               ?<View>{address.province_name+address.area_name+address.address}</View>
               :<View>{address.province_name+address.city_name+address.area_name+address.address}</View>
             }
          </View>
        </View>
        <Image className="address-line" src={require('../../static/images/dizhitiao.png')} />
        <View className="page-item">
          <View className="order-content">
            <Image src={IMG_BASE+orderDetail.cover_image}/>
            <View className='order-info'>
              <View>{orderDetail.goods_name}</View>
              <View>成交价: ¥{formatMoney(orderDetail.deal_price)}</View>
              <View>佣金: ¥ {formatMoney(orderDetail.commissions)}</View>
            </View>
          </View>
        </View>
        <View className='details'>
          <View className='col-name'>发货信息</View>
          <View className='col-box'>
            <View onClick={this.showModel} className='details-item clearfix'>
              <View className='fl'>物流公司</View>
              <View className='fr more'>{method}<Image className='yCenter' src={require('../../static/images/rightIcon.png')} /></View>
            </View>
            <View className='details-item clearfix'>
              <View className='fl'>物流单号</View>
              <Input onInput={this.express_sn} className='fr' placeholder='请输入物流单号' placeholder-style='text-align:right' />
            </View>
            {chooseIndex == 9 && <View className='details-item clearfix'>
              <View className='fl'>物流公司名称</View>
              <Input onInput={this.express_name} className='fr' placeholder='请输入物流公司名称' placeholder-style='text-align:right' />
            </View>}
          </View>
        </View>
      </ScrollView>
      <View class={`order-bottom ${getGlobalData('phoneModel')?'order-bottom-phone':''}`} onClick={this.confirm}>
        <View >确认发货</View>
      </View>
      <AnimateLayer onShowFun={this.showModel} isShowModel={this.state.isShowModel}><View class="list-box"><View>物流公司</View>{content}</View> </AnimateLayer>
    </View>
  }
}