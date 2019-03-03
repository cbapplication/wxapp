Component({
    externalClasses: ['i-class'],
    options: {
        multipleSlots: true
    },
    properties: {
        show : {
            type : Boolean,
            value : true
        },
    },
    data: {
        btntext:'获取验证码',
        phone:"",
        code:"",
        show:true
    },
    methods: {
        phone(e){
            this.setData({
                phone:e.detail.value
            })
        },
        code(e){
            this.setData({
                code:e.detail.value
            })
        },
        handclose () {
            this.triggerEvent('_close');
        },
        getCode(){
            let _this = this;
            let coden = 60// 定义60秒的倒计时
            if(true&&this.data.btntext == '获取验证码'&&this.checkPhone(this.data.phone)){
                this.checkPhone(this.data.phone)
                let codeV = setInterval(function () {    
                        _this.setData({  
                            btntext: (coden--) + 's后重新发送', 
                        })
                    if (coden == -1) { 
                        clearInterval(codeV)
                        _this.setData({
                            btntext: '获取验证码',
                        })
                    }
                }, 1000)
                }
        },
        login(){

        },
        checkPhone(phone){ 
            if(!(/^1[34578]\d{9}$/.test(phone))){ 
                wx.showToast({
                    title: '手机号有误',
                    icon: 'none',
                    duration: 2000
                })  
                return false; 
            } 
            return true
        }
    },
    
});
