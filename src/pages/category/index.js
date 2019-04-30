import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'
import { IMG_BASE } from '../../utils/const'
import { getClassify } from '../../api/goods'
import { storeTops } from '../../api/store'
import { mtLog } from '../../utils/funs'
import { staticRecord } from '../../api/index'

export default class home extends Taro.Component {

  config = {
    navigationBarTitleText: '分类',
    usingComponents: {
      //'loadMore': '../../components/load-more/index' // 书写第三方组件的相对路径
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      categoryList: [],//分类列表
      storeList: []
    }
  }

  closeServiceModel(e) {
    this.setState({ showService: false })
  }
  mtLogCategory(id) {
    let param = ''
    if (id == 1) {
      param = {
        action: 'fl_fenleiall click',
        action_desc: '全部拍品分类'
      }
    }
    if (id == 2) {
      param = {
        action: 'fl_taociqi click',
        action_desc: '陶瓷器分类'
      }
    }
    if (id == 3) {
      param = {
        action: 'fl_wenfangzaxiang click',
        action_desc: '文房杂项'
      }
    }
    if (id == 4) {
      param = {
        action: 'fl_chaye  click',
        action_desc: '茶叶分类'
      }
    }
    if (id == 5) {
      param = {
        action: 'fl_chaju  click',
        action_desc: '茶具分类'
      }
    }
    if (id == 6) {
      param = {
        action: 'fl_jiu click',
        action_desc: '酒分类'
      }
    }
    if (id == 7) {
      param = {
        action: 'fl_shuji click',
        action_desc: '书籍分类'
      }
    }
    if (id == 8) {
      param = {
        action: 'fl_jiaju click',
        action_desc: '家具分类'
      }
    }
    if (id == 9) {
      param = {
        action: 'fl_qita click',
        action_desc: '其他分类'
      }
    }
    mtLog(param)
  }
  //进入搜索
  goToSearch() {
    Taro.navigateTo({ url: `../search/index` })
  }

  goToDetail(id) {
    Taro.navigateTo({ url: `../search/index?id=${id}` })
    this.mtLogCategory(id)
  }
  //进入店铺
  goToStore(id) {
    Taro.navigateTo({ url: `../sellerHomepage/index?id=${id}` })
  }
  mtLogPage() {
    let pages = getGlobalData('from')
    let param = ''
    if (pages == '/pages/home/index') {
      param = {
        action: 'sy_fenlei click',
        action_desc: '点击分类icon'
      }
    }
    if (pages == '/pages/special/index') {
      param = {
        action: 'zt_fenlei click',
        action_desc: '点击分类icon'
      }
    }
    if (pages == '/pages/mine/index') {
      param = {
        action: 'wd_fenlei click',
        action_desc: '点击分类icon'
      }
    }
    mtLog(param)
  }
  componentDidShow() {
    //获取分类
    this.GetClassify()
    this.StoreTops()
    this.mtLogPage()
    staticRecord()
  }
  componentDidHide() {
    setGlobalData('from', this.$router.path)
  }
  //获取分类
  GetClassify(){
    getClassify().then( res => {
      if(res.success){
          this.setState( pre => {
            pre.categoryList = res.items
          })
      }else{
        Taro.showToast({icon:'none',title:'获取数据失败'})
      }
    })
  }
  //获取店铺
  StoreTops() {
    storeTops().then(res => {
      if (res.success) {
        this.setState(pre => {
          pre.storeList = res.items
        })
      } else {
        Taro.showToast({ icon: 'none', title: '获取数据失败' })
      }
    })
  }
  render() {
    let { categoryList, storeList } = this.state;
    const cateList = categoryList.map((item) => {
        return (
            <View onClick={this.goToDetail.bind(this,item.id)} className="list-item" key="this" style={`background-image: url(${IMG_BASE+item.photo})`}>
                <View className="list-bottom">
                    <View className="list-title">{item.name}</View>
                    <View className="list-num">{item.goods_number}件</View>
                </View>
            </View>
        )
    })
    const store = storeList.map((item) => {
      return (
        <View onClick={this.goToStore.bind(this, item.id)} key="this" className="store">
          <Image src={IMG_BASE + item.avatar} />
          <View className="detail">
            <View className="name">{item.name}</View>
            <View className="number">{item.description}</View>
          </View>
          <View className="goStore">
            <Image src={require("../../static/images/rightIcon.png")} />
          </View>
        </View>
      )
    })
    return (
      <View className="page">
        <View onClick={this.goToSearch} className="search">
          <View>
            <Image src={require("../../static/images/searchIcon.png")} />
            大家都在搜索泥春华
            </View>
        </View>
        <ScrollView className="page-block" scroll-y scroll-with-animation>
          <View className="goods-category">
            <View className="title">拍品分类</View>
            <View className="cate-list">
              {cateList}
            </View>
          </View>
          <View className="store-selected">
            <View className="title">精选店铺</View>
            {store}
          </View>
        </ScrollView>
      </View>
    )
  }
}

