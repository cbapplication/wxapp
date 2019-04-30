import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../globalData'
import clear from "../../static/images/shanchu.png"
import './setName.less'
import {editNickName} from '../../api/user'
import { staticRecord } from '../../api/index'


export default class setName extends Taro.Component {

	config = {
		navigationBarTitleText: '昵称修改',
	}
	constructor(props) {
		super(props)
		this.state = {
			name:''
		}
	}
	getName(e) {
		let { value } = e.detail;
		this.setState((pre) => {
			pre.name = value;
		})
	}
	clearName() {
		this.setState((pre) => {
			pre.name = '';
		})
    }
    saveBtn(){
        let {name} = this.state;
		if(name == '') return
		let obj = {
			nickname : name
		}
        this.EditNickName(obj)
    }
	componentDidShow() {
        const {nickname} = this.$router.params
        this.setState( pre => {
            pre.name = nickname
		})
		staticRecord()
	 }
     EditNickName(nickname){
		editNickName(nickname).then( res => {
            if(res.success){
                Taro.navigateBack()
			}else{
				Taro.showToast({icon:'none',title:'修改失败'})
			}
		})
	}
	render() {
		let {name} = this.state;
		return (
			<View className="page">
                <View className="edit-input">
                    <Input maxlength='12' onInput={this.getName} type="text" value={name} />
                    {name.length > 0 && <Image onClick={this.clearName} src={clear} />}
                </View>
                <View onClick={this.saveBtn} className='edit-btn'>保存</View>
			</View>
		)
	}
}

