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
        items:[
            {id:0,value:"精选"},
            {id:1,value:"专题"},
            {id:2,value:"分类"},
            {id:3,value:"我的"},
        ],
        tabId:0//导航栏id
    },
    methods: {
        tab(e){
           let {index} = e.currentTarget.dataset;
           this.setData({tabId:index});
           switch (index) {
                case 0:
                   wx.switchTab({url:"home"})
                   break;
                case 1:
                   wx.switchTab({url:"special"})
                   break;
                case 2:
                   wx.switchTab({url:"category"})
                   break;
                case 3:
                   wx.switchTab({url:"mine"})
                   break;
                default:
                   break;
           }
        },
        cancal(){
            this.triggerEvent('_cancal');
        }
    },
    
});
