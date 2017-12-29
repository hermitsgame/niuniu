
cc.Class({
    extends: cc.Component,

    properties: {
        gameController: {
            default: null,
            type: cc.Node
        },

        can_show: true  //是否可以展示结果
    },


    //这里发送一个显示结果的消息
    callBack: function (event) {
        if (this.can_show) {
            var node = event.target;
            var button = node.getComponent(cc.Button);
            console.log('结果按钮被点击');
            this.node.dispatchEvent(new cc.Event.EventCustom('show_result', true));
            this.can_show = false;
        }
    }


});
