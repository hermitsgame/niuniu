
cc.Class({
    extends: cc.Component,

    properties: {
        game_controller: {
            default: null,
            type: cc.Node
        }
    },


    onLoad: function(){
        console.log("从player1中通过game_controller获取牌的值");
        console.log(this.game_controller.getComponent('game_controller').all_cards);
    },


    start () {

    },

    // update (dt) {},
});
