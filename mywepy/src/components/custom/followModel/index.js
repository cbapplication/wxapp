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
        timeStr : {
            type : String,
            value : '07月 08日 20:00:01'
        },
    },
    data: {
        
    },
    methods: {
        close(){
            this.triggerEvent('_close');
        }
    },
    
});
