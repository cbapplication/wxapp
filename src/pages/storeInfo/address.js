import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import clear from "../../static/images/shanchu.png"
import './address.less'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'

import { editAddress } from '../../api/store'
import { staticRecord } from '../../api/index'


export default class address extends Taro.Component {

  config = {
    navigationBarTitleText: '修改商家地址',
  }
  constructor(props) {
    super(props)
    this.state = {
      address: ''
    }
  }
  getAddress(e) {
    let { value } = e.detail;
    this.setState((pre) => {
      pre.address = value;
    })
  }
  clearAddress() {
    this.setState((pre) => {
      pre.address = '';
    })
  }
  saveBtn() {
    let { address } = this.state;
    if (address == '') return
    let obj = {
      store_id: getGlobalData('storeId'),
      address: address
    }
    this.editAddress(obj)
  }
  editAddress(obj) {
    editAddress(obj).then(res => {
      if (res.success) {
        Taro.navigateBack()
      } else {
        Taro.showToast({ icon: 'none', title: '修改失败' })
      }
    })
  }
  componentDidShow() {
    const { address } = this.$router.params
    this.setState(pre => {
      pre.address = address
    })
    staticRecord()
  }
  render() {
    let { address } = this.state;
    return (
      <View className="page">
        <View className="edit-input">
          <Input onInput={this.getAddress} type="text" value={address} />
          {address.length > 0 && <Image onClick={this.clearAddress} src={clear} />}
        </View>
        <View onClick={this.saveBtn} className='edit-btn'>保存</View>
      </View>
    )
  }
}

