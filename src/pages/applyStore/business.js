import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './business.less'
import { tip } from '../../utils/funs'
import { getStoreScope } from '../../api/user'
import { editClassify } from '../../api/store'
import { staticRecord } from '../../api/index'

export default class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      source: '',
      chooseList: [],
      arrList: []
    }
  }
  config = {
    navigationBarTitleText: '经营范围',
  }
  choose(e) {
    let id = e.currentTarget.dataset.id
    let curIndex = ''
    let { chooseList, arrList } = this.state
    arrList.map(
      (item, index) => {
        if (item.id == id) {
          curIndex = index
        }
      }
    )
    if (chooseList.length >= 3) {
      if (arrList[curIndex].select) {
        arrList[curIndex].select = false
      } else {
        tip('最多可选三项')
      }
    } else {
      arrList[curIndex].select = !arrList[curIndex].select
      chooseList.push(arrList[curIndex])
    }
    if (!arrList[curIndex].select) {
      chooseList.map(
        (item, index) => {
          item.id == id && chooseList.splice(index, 1)
        }
      )
    }
    this.setState(
      (pre) => {
        pre.chooseList = chooseList
        pre.arrList = arrList
      }
    )

  }
  backShopInfo() {
    let { source, chooseList } = this.state
    setGlobalData('chooseList', this.state.chooseList)
    if (source == 'storeInfo') {
      let classifyIds = []
      chooseList.map(
        (item) => {
          classifyIds.push(item.id)
        }
      )
      let params = {
        store_id: getGlobalData('storeId'),
        classify_ids: classifyIds
      }
      editClassify(params).then(
        (res) => {
          if (res.success) {
            Taro.navigateBack({
              delta: 1
            })
          }
        }
      )
    } else {
      Taro.navigateBack({
        delta: 1
      })
    }
  }

  componentWillMount() {
    let { source } = this.$router.params || ''
    if (source == 'storeInfo') {
      this.setState({
        source: source
      })
    }
    getStoreScope().then(
      (res) => {
        res.data.map(
          (item) => {
            item.select = false
          }
        )
        this.setState({
          arrList: res.data
        })
      }
    )

  }

  componentDidMount() {

  }
  componentWillUpdate() {

  }

  componentWillUnmount() { }

  componentDidShow() { 
    staticRecord()
  }

  componentDidHide() { }
  render() {
    let { arrList } = this.state
    let content = arrList.map(
      (item) => {
        return (
          <View className='item clearfix' key={String(item.id)}>
            <View className="name">{item.name}</View>
            <View className={`yCenter ${item.select ? 'no-border' : ''}`} data-id={String(item.id)} onClick={this.choose}>
              <Image className={`xyCenter ${item.select ? '' : 'hide'}`} src={require('../../static/images/guanzhuchenggong.png')} />
            </View>
          </View>
        )
      }
    )
    return (
      <View className="page">
        <View className='head-tip'>请选择店铺经营范围，最多可以选择3项</View>
        <View className='list'>
          {content}
          <View class="order-bottom" onClick={this.backShopInfo}>
            <View >确定</View>
          </View>
        </View>
      </View>
    )
  }
}