
cc.Class({
    extends: cc.Component,

    properties: {

    },



    onLoad: function(){

    },


    continue: function(event){
        //点击继续的话，将发送一个消息到game_controller，然后将这个按钮组件关闭
        this.node.dispatchEvent(new cc.Event.EventCustom('continue', true));
        this.node.active = false;
    }




});
