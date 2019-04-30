import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Image } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import './index.less'

import {getMyInfo,editGender,editBirthday} from '../../api/user'
import { staticRecord } from '../../api/index'

export default class Personal extends Taro.Component {

	config = {
		navigationBarTitleText: '茗探拍卖',
	}
	constructor(props) {
		super(props)
		this.state = {
			userInfo:{//用户信息
			},
			gender:['男','女']
		}
	}
    componentDidShow() {
		this.GetMyInfo();
		staticRecord()
	}

    changeName(nickname){
		Taro.navigateTo({url:`./setName?nickname=${nickname}`})
	}
	changeGender(e){
		let {value} = e.detail;
		this.setState( pre => {
			pre.userInfo.gender = value+1
		})
		let obj = {
			gender: value+1
		}
		this.EditGender(obj)
	}
	changeBirthday(e){
		let {value} = e.detail;
        this.setState( pre => {
			pre.userInfo.birthday = value
		})
		let obj = {
			birthday: value
		}
		this.EditBirthday(obj)
	}
	changePhone(phone){
		Taro.navigateTo({url:`./setPhone?phone=${phone}`})
	}
	//获取用户信息
    GetMyInfo(){
		getMyInfo().then( res => {
            if(res.success){
              this.setState( pre => {
				  pre.userInfo = res
			  })
			}else{
				Taro.showToast({icon:'none',title:'获取数据失败'})
			}
		})
	}
	//修改性别
	EditGender(value){
		editGender(value).then( res => {
            if(res.success){
              
			}else{
				Taro.showToast({icon:'none',title:'修改失败'})
			}
		})
	}
	//修改生日
	EditBirthday(value){
		editBirthday(value).then( res => {
            if(res.success){
              
			}else{
				Taro.showToast({icon:'none',title:'修改失败'})
			}
		})
	}
	render() {
		let {userInfo,gender} = this.state;
       
		return (
			<View className="page">
				<View className="head">
					<Image className="banner" src={require('../../static/images/personal-bg.png')} mode="aspectFill"></Image>
					<Image className="nick-pic xCenter" src={userInfo.avatar}></Image>
				</View>
				<View className="nick-name">{userInfo.nickname}</View>
				<View className="set-list">
				    <View onClick={this.changeName.bind(this,userInfo.nickname)} className='list-item'>
					    <View>昵称</View>
						<Image src={require('../../static/images/rightIcon.png')}/>
						<View>{userInfo.nickname}</View>
					</View>
					<Picker onChange={this.changeGender} range={gender}>
						<View className='list-item'>
							<View>性别</View>
							<Image src={require('../../static/images/rightIcon.png')}/>
							<View>{userInfo.gender == 1 ? '男' : '女'}</View>
						</View>
					</Picker>
					<Picker onChange={this.changeBirthday} mode="date">
						<View className='list-item'>
							<View>生日</View>
							<Image src={require('../../static/images/rightIcon.png')}/>
							<View>{userInfo.birthday}</View>
						</View>
					</Picker>
					<View onClick={this.changePhone.bind(this,userInfo.mobile)} className='list-item'>
					    <View>手机号</View>
						<Image src={require('../../static/images/rightIcon.png')}/>
						<View>{userInfo.mobile}</View>
					</View>
				</View>
			</View>
		)
	}
}

