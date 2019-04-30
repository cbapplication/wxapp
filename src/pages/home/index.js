import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import rightIcon from "../../static/images/rightIcon.png"
import searchIcon from "../../static/images/searchIcon.png"
import timeIcon from "../../static/images/time.png"
import chujia from "../../static/images/chujia.png"
import people from "../../static/images/people.png"
import LoadMore from "../../components/loadMore/index"
import PreLoading from '../../components/preLoading/index'
import { IMG_BASE } from '../../utils/const'
import './index.less'
import { strToTime, clock, mtLog } from '../../utils/funs'
import { getSpecialise, getRecommend, staticRecord } from '../../api/index'
export default class home extends Taro.Component {

  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  }
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      id: 1,//专题id
      click_times: 0,
      start_time: '',
      expires_time: '',
      end_time: '',
      cover_images: '',
      name: '',
      status: 1,
      hasSpecialise: false,//是否有专题
      items: [],
      loadMore: true,//加载更多
      hasRecommend: false,//是否有精品推荐
      page: 1,//页码
      specialTime: ''
    }
  }

  //进入拍品详情
  goToGoodsInfo(id) {
    Taro.navigateTo({ url: `../goodsInfo/index?id=${id}` })
  }
  //搜索
  goToSearch() {
    Taro.navigateTo({ url: `../search/index` })
  }
  //查看全部
  goTospecial(e) {
    Taro.switchTab({ url: `../special/index` })
    let param = {
      action: 'sy_zhuanchangall click',
      action_desc: '点击查看全部拍场'
    }
    mtLog(param)
  }
  //进入专题详情
  goToSpecialDetail(id) {
    this.setState( pre => {
      pre.page++
    })
    Taro.navigateTo({ url: `../specialDetail/index?id=${id}` })
    let param = {
      action: 'sy_zhuanchang click',
      action_desc: '点击专场',
      arg1: id
    }
    mtLog(param)
  }
  mtLogPage() {
    let pages = getGlobalData('from')
    let param = ''
    if (pages == '/pages/special/index') {
      param = {
        action: 'zt_shouye click',
        action_desc: '点击精选icon'
      }
    }
    if (pages == '/pages/category/index') {
      param = {
        action: 'fl_shouye click',
        action_desc: '点击精选icon'
      }
    }
    if (pages == '/pages/mine/index') {
      param = {
        action: 'wd_shouye click',
        action_desc: '点击精选icon'
      }
    }
    param && mtLog(param)
  }
  componentDidShow(){
    staticRecord()
  }
  componentWillMount() {
    this.GetSpecialise()
    this.GetRecommend(this.state.page, false)
    this.state.timer = setInterval(() => {
      this.setState(pre => {
        pre.specialTime = strToTime(pre.start_time, pre.expires_time).time
        pre.status = strToTime(pre.start_time, pre.expires_time).status
        pre.items.map(item => {
          item.count_down = clock(item.start_time, item.expires_time)
        })
      })
    }, 1000)
    this.mtLogPage()
  }
  //下拉刷新
  onPullDownRefresh() {
    this.GetSpecialise()
    this.GetRecommend(1, true);
    this.setState({ page: 1 })
  }
  //触底刷新
  onReachBottom() {
    this.setState(pre => {
      pre.page++;
      pre.loadMore = true;
      this.GetRecommend(pre.page, false)
    })
    let param = {
      action: 'sy_xiahuajiazai',
      action_desc: '用户下滑加载',
      arg1: this.state.page
    }
    mtLog(param)
  }
  //获取专场
  GetSpecialise() {
    getSpecialise().then(res => {
      if (res.success) {
        this.setState(pre => {
          pre.id = res.id
          pre.click_times = res.click_times;
          pre.start_time = res.start_time;
          pre.cover_images = res.cover_images;
          pre.expires_time = res.expires_time;
          pre.end_time = res.end_time;
          pre.name = res.name;
          pre.status = res.status;
          pre.status_map = res.status_map;
          pre.hasSpecialise = res.success;
        })
      } else {
        Taro.showToast({ icon: 'none', title: '获取数据失败' })
      }
    });
  }
  /**
   * 获取推荐
   * @param {页码} page 
   * @param {是否刷新} refresh  
   */
  GetRecommend(page, refresh) {
    getRecommend(page).then(res => {
      if (res.success) {
        this.setState(pre => {
          pre.loadMore = false;
          pre.hasRecommend = res.success;
          Taro.stopPullDownRefresh()
          if (!refresh) {
            pre.items = pre.items.concat(res.items);
          } else {
            pre.items = (res.items);
          }
        })
      } else {
        Taro.showToast({ icon: 'none', title: '获取数据失败' })
      }
    })
  }
  componentWillUnmount(){
    clearInterval(this.state.timer)
  }
  componentDidHide() {
    setGlobalData('from', this.$router.path)
  }

  render() {
    let { id, click_times, specialTime, end_time, cover_images, name, status, status_map, hasRecommend, items, loadMore } = this.state;
    let priceStatus = ['', '起拍价', '当前价', '成交价', '起拍价'];
    const Good = items.map((item) => {
      return <View className="good" taroKey="this">
        <View onClick={this.goToGoodsInfo.bind(this, item.id)} className="block">
          <Image src={`${IMG_BASE + item.cover_images}`} mode lazy-load />
          <View className="block-bottom">
            <View className="name"> {item.name}</View>
            <View className={`price common-status${item.status}`}>
              <Text className="text">{priceStatus[item.status]}</Text>
              ¥{item.is_bidden ? item.price : item.start_price}
            </View>
            <View className="time">
              <Image src={timeIcon} />
              <Text>{item.count_down}</Text>
              {item.status > 1 && <Image className="marginL" src={chujia} />}
              {item.status == 1 && <Image className="marginL" src={require('../../static/images/guanzhu.png')} />}
              {item.status == 1
                ? <Text>{item.focus_times}次</Text>
                : <Text>{item.auction_times}次</Text>
              }
              {item.is_proprietary && <Text className="self-support">自营</Text>}
            </View>
          </View>
        </View>
      </View>
    })
    return (
      <View className='page'>
        {
          hasRecommend ?
            <View>
              <View onClick={this.goToSearch} className="search">
                <View>
                  <Image src={searchIcon} />
                  大家都在搜索泥春华
          </View>
              </View>
              <View className="page-head">
                {status != 3 &&
                  <View className="select">
                    <View onClick={this.goTospecial} className="title">
                      <View className="title-cen">精选专场</View>
                      <View className="title-rig">查看全部
                      <Image src={rightIcon} />
                      </View>
                    </View>
                    <View onClick={this.goToSpecialDetail.bind(this, id)} className="select-body" style={`background-image: url(${IMG_BASE + cover_images})`}>
                      <View className="body-status">
                        <Text className={`status common-bg-status${status}`}>{status_map[status]}</Text>
                        <Text className="time"><Text> {specialTime}</Text></Text>
                      </View>
                    </View>
                    <View className="select-name">
                      <View className="name-left">
                        <View className="left-name">{name}</View>
                        <View className="left-time">{end_time}</View>
                      </View>
                      <View className="name-right">
                        <Image src={people} />
                        <View>{click_times}次围观</View>
                      </View>
                    </View>
                  </View>
                }
              </View>
              <ScrollView scrollY scrollWithAnimation className="recommend">
                <View className="title">推荐拍品</View>
                <View className="goodslist">
                  {Good}
                </View>
              </ScrollView>
              <LoadMore loading={loadMore}></LoadMore>
            </View>
            :
            <PreLoading></PreLoading>
        }
      </View>
    )
  }
}

