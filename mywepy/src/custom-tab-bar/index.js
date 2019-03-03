var app = getApp()
Component({
    externalClasses: ['i-class'],
    options: {
        multipleSlots: true
    },
    properties: {
        showModel : {
            type : Boolean,
            value : true
        },
        phoneModel:{
            type:Boolean,
            value: false
        }
    },
    data: {
        list:[
            {id:0,text:"精选"},
            {id:1,text:"专题"},
            {id:2,text:"分类"},
            {id:3,text:"我的"},
        ],
        tabId:0//导航栏id
    },
    methods: {
        tab(e){
           let {index} = e.currentTarget.dataset;
         
           //app.globalData.tabId = index;
           
           switch (index) {
                case 0:
                   wx.switchTab({url:"home"});
                   break;
                case 1:
                   wx.switchTab({url:"special"});
                   break;
                case 2:
                   wx.switchTab({url:"category"});
                   break;
                default:
                   wx.switchTab({url:"mine"});
                   break;
           }
           this.setData({tabId:index});
           console.log(this.data.tabId);
        },
        cancal(){
            this.triggerEvent('_cancal');
        }
    },
    
});
