
cc.Class({
    extends: cc.Component,

    properties: {
        gameController: {
            default: null,
            type: cc.Node
        },
        isDealed: false //是否已经发过牌了
    },

    onLoad: function () {

    },

    //这里应该发送一个发牌的事件
    callback: function (event) {
        if (!this.isDealed) {
            var node = event.target;
            var button = node.getComponent(cc.Button);
            console.log('发牌按钮被点击');
            this.node.dispatchEvent(new cc.Event.EventCustom('start_game', true));
            this.isDealed = true;
        }
    },


});
