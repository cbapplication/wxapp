import Taro from '@tarojs/taro'
import { View,Image ,Input} from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.css'
import closeIcom from "../../static/images/rightIcon.png"

export default class categoryFilter extends Taro.Component {
    static defaultProps ={
        show : false,
    }
    state = {
        is_self:false,
        goodsStatus:[//拍品状态
        {id:2,name:'拍卖中'},
        {id:1,name:'预展中'},
        {id:3,name:'已结束'},
       ],
       tabId:2,//默认
       params:{}//传递参数
    }
    chooseTag(){
        if(!this.state.is_self){
           this.setState( pre => {
               pre.is_self = true;
               pre.params.is_self = true
           })
        }else{
            this.setState( pre => {
                pre.is_self = false;
                pre.params.is_self = false
            })
        }    
    }
    chooseStatus(id){
        this.setState( pre =>{
            pre.tabId = id;
        });
    }
    minPrice(e){
        //不能return,空值搜索全部拍品
       this.setState( pre => {
           pre.params.min_price = e.detail.value
       })
    }
    maxPrice(e){
        this.setState( pre => {
            pre.params.max_price = e.detail.value
        })
     }
    reset(){
        this.setState( pre => {
            pre.params = {};
            pre.is_self= false;
            pre.tabId = 2;

        })
    }
    confirm(){
        let {params,tabId} = this.state;
        if(tabId == 3){
            params.status_list = [3,4]
        }else{
            params.status_list = [tabId]
        }
        this.props.onConfirm(params)
        this.props.onCloseFilterModel()
    }
    close(){
        this.props.onCloseFilterModel()
    }
  componentWillMount () {}
  render () {
    const {is_self,goodsStatus,tabId,params} = this.state;
    const btnStatus = goodsStatus.map((item) => {
        return (
            <View key="this" onClick={this.chooseStatus.bind(this,item.id)} className={tabId==item.id?'model-btn-active':''} >{item.name}</View>
        )
    })
    return (
        <View NameName="page">
        <View onClick={this.close} className={this.props.show?'box':''} catchtouchmove="preventD"></View>
        <View className={`model ${this.props.show?'':'hidden'} ${getGlobalData('phoneModel')?'model-phone-padded':''}`} catchtouchmove="preventD">
            <View onClick={this.close} className="model-close">
                <Image src={closeIcom}/>
            </View>
            <View className="model-title">筛选</View>
            <View className="model-tag">拍品标签</View>
            <View className="model-block">
                <View onClick={this.chooseTag} className={is_self?'model-btn-active':''}>茗探自营</View>
            </View>
            <View className="model-tag">拍品状态</View>
            <View className="model-block">
                {btnStatus}
            </View>
            <View className="model-tag">价格区间</View>
            <View className="model-section model-margin-bottom">
                <Input value={params.minPrice} onInput={this.minPrice} type="number" placeholder="请输入最低价格"/>
                <View className="model-line"></View>
                <Input value={params.maxPrice} onInput={this.maxPrice} type="number" placeholder="请输入最高价格"/>
            </View>
            <View className={`model-bottom ${getGlobalData('phoneModel')?'model-bottom-phoneModel':''}`}>
                <View onClick={this.reset} className="model-left-btn">重置</View>
                <View onClick={this.confirm} className="model-right-btn">确定</View>
            </View>
        </View>
    </View>
    )
  }
}