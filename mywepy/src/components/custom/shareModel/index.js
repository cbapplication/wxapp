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
        
    },
    methods: {
        cancal(){
            this.triggerEvent('_cancal');
        }
    },
    
});
