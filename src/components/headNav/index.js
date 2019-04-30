import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, ScrollView } from '@tarojs/components'
import './index.less'
export default class HeadNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }
  selectNav(e) {
    this.setState({
      index: e.currentTarget.dataset.index
    })
  }
  componentWillMount() {

  }

  componentDidMount() {

  }
  componentWillUpdate() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  render() {
    const arrList = ['全部', '待发货', '已发货', '已收货', '已结算']
    const content = arrList.map((num, index) => {
      let clName = this.state.index == index ? 'selected' : ''
      return <View className={`nav-item ${clName}`} data-index={index} key={String(index)} onClick={this.selectNav}>{num}</View>
    })
    return (
      <View className='head-box'>{content}</View>
    )
  }
}