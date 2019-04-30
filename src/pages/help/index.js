import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import WxParse from '../../utils/wxParse/wxParse'
import './index.less'

import {getHelpContent} from '../../api/goods'
import {help} from '../../api/user'
import { staticRecord } from '../../api/index'

export default class order extends Taro.Component {

  config = {
    navigationBarTitleText: '订单详情',
  }
  constructor (props) {
    super(props)
    this.state = {
      loading: false,//是否显示加载
      helpList:[],
      toView:'',//滑到可视区
      scrollId:1,//滑动选中ID
      desc:"",
      id:1,//默认ID
     }
  }
  scrollToView(index,id){
        this.setState((preState) => {
            preState.toView = id;
            preState.scrollId = index;
        })
        this.GetHelpContent(index)
    }
  componentWillMount(){
      this.GetHelp() 
  }
  componentDidShow(){
    staticRecord()
  }
  componentDidMount () {
      const {id} = this.state;
      this.GetHelpContent(id)
      this.setState((preState) => {
        preState.toView = 'target' + id;
        preState.scrollId = id;
    })
  }
   //获取帮助条目
   GetHelp(){
    help().then( res => {
        if(res.success){
            this.setState( pre => {
                pre.helpList= res.items;
                pre.id = this.$router.params.id || res.items[0].id
            })
        }else{
            Taro.showToast({icon:'none',title:'获取数据失败'})
        }
    })
   }
   //获取帮助内容
   GetHelpContent(id){
    getHelpContent(id).then( res => {
        if(res.success){
            this.setState( pre => {
                pre.desc= res.detail
            })
        }else{
            Taro.showToast({icon:'none',title:'获取数据失败'})
        }
    })
   }
  render () {
    const {scrollId,helpList,desc} = this.state;
    //富文本解析
    WxParse.wxParse("htmlStr", "html", desc, this.$scope,5);
    const menu = helpList.map((item,index) => {
          return (
            <View onClick={this.scrollToView.bind(this,item.id,('target'+item.id))} key="this" id={'target'+item.id} className={`menu-item ${scrollId==item.id?'active':''}`}>
                {item.name}
            </View>
          )
      })
    return (
        <View class="page">
        <import src="../../utils/wxParse/wxParse.wxml"/>
        <View class="menu">
            <ScrollView class="menu-scroll" scroll-x scroll-into-view={toView} scroll-with-animation>
                {menu}
            </ScrollView>
        </View>
            <View class="goods-info-desc">
                {desc !=''&&<template is="wxParse" data="{{wxParseData:htmlStr.nodes}}"></template>}
            </View>
        </View>
    )
  }
}

