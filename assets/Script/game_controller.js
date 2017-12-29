var Util = require('./card_util');
cc.Class({
    extends: cc.Component,

    properties: {
        cardPrefab: {
            default: null,
            type: cc.Prefab
        },

        cardsAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        desk: {
            default: null,
            type: cc.Node
        },

        player1Result: {
            default: null,
            type: cc.Prefab
        },

        player2Result: {
            default: null,
            type: cc.Prefab
        },

        player1_golds_label: {
            default: null,
            type: cc.Label
        },

        player2_golds_label: {
            default: null,
            type: cc.Label
        },

        pos1X: 0,
        pos1Y: 0,

        pos2X: 0,
        pos2Y: 0,

        player1_golds: 0,
        player2_golds: 0
    },


    onLoad: function () {
        var that = this;
        this.count = 0;

        this.all_cards = Util.initCards();
        this.cards1 = this.all_cards.cards1;
        this.cards2 = this.all_cards.cards2;

        //收到发牌消息了
        this.node.on('start_game', function (event) {
            //console.log('onLoad 监听到 start_game, 开始发牌');
            //设定定时器，执行 createCard 函数9次（第4次之后才会停止，所以实际执行了10次），间隔1秒
            that.schedule(that.createCard, 1, 9);

        });


        //收到展示结果的消息了
        this.node.on('show_result', function (event) {
            //console.log('onLoad 监听到 show_result, 显示结果');
            //调用比较函数获得比较结果
            that.showResult();

            that.node.getChildByName('continue').active = true;
        });


        //收到继续下一把的消息
        this.node.on('continue', function (event) {
            var all_children = that.node.children;
            //console.log(all_children);
            //console.log(all_children[6].name);

            //删除之前的牌和结果显示
            for (var i = 0; i < all_children.length; i++) {
                var temp = all_children[i].name;
                //console.log(all_children[i].name);
                if (temp === "testCard") {
                    //console.log(all_children[i]);
                    all_children[i].destroy();
                }else if(temp === 'boom1'){
                    all_children[i].getChildByName('player1_result').getComponent(cc.Label).string = "";
                    all_children[i].destroy();
                }else if(temp === 'boom2'){
                    all_children[i].getChildByName('player2_result').getComponent(cc.Label).string = "";
                    all_children[i].destroy();
                }
            }

            //重新发牌
            that.all_cards = Util.initCards();
            that.cards1 = that.all_cards.cards1;
            that.cards2 = that.all_cards.cards2;
            that.count = 0;
            that.pos1X = -220;
            that.pos1Y = -182;
            that.pos2X = 70;
            that.pos2Y = 182;
            that.schedule(that.createCard, 1, 9);

            // console.log(that.node.getChildByName('result').children);
            // console.log(that.node.getChildByName('result').getComponent('btn_result'));
            // console.log(that.node.getChildByName('result').getComponent('btn_result').can_show);
            that.node.getChildByName('result').getComponent('btn_result').can_show = true;

        })



    },


    createCard: function () {
        //实例化预置体
        var new_card = cc.instantiate(this.cardPrefab);
        //将预制体添加到当前节点
        this.node.addChild(new_card);

        if (this.count % 2 === 0) {
            console.log('生成玩家1的牌');
            //为预制体设定位置，玩家1的牌
            var temp_count = this.count / 2;
            new_card.setPosition(this.getNewCard1Position());
            //获取新的图片资源
            var new_spriteFrame = this.cards1[temp_count][0] + this.cards1[temp_count][1][1];
            //更新发牌数量
            this.count++;
            //替换预制体显示的图片
            new_card.getComponent(cc.Sprite).spriteFrame = this.cardsAtlas.getSpriteFrame(new_spriteFrame);
        } else {
            //console.log('生成玩家2的牌');
            //为预制体设定位置，玩家2的牌
            var temp_count = (this.count - 1) / 2;
            new_card.setPosition(this.getNewCard2Position());
            //获取新的图片资源
            var new_spriteFrame = this.cards2[temp_count][0] + this.cards2[temp_count][1][1];
            //更新发牌数量
            this.count++;
            //替换预制体显示的图片
            new_card.getComponent(cc.Sprite).spriteFrame = this.cardsAtlas.getSpriteFrame(new_spriteFrame);
        }


    },


    getNewCard1Position: function () {
        var newPos1 = cc.p(this.pos1X, this.pos1Y);
        this.pos1X += 30;
        //console.log(this.pos1X);
        return newPos1;
    },

    getNewCard2Position: function () {
        var newPos2 = cc.p(this.pos2X, this.pos2Y);
        this.pos2X += 30;
        //console.log(this.pos2X);
        return newPos2;
    },



    //处理最终结果
    showResult: function () {
        //console.log("比较的结果是……");
        this.final_result = Util.getResults(this.all_cards);
        // console.log("完整的10张牌为： ", this.all_cards)
        // console.log('玩家1得到的牌：', this.cards1);
        // console.log('玩家2得到的牌：', this.cards2);
        // console.log("最终的结果为：", this.final_result);

        //显示玩家1的结果
        var newBoom1 = cc.instantiate(this.player1Result);
        var newLabel1 = newBoom1.getChildByName('player1_result').getComponent(cc.Label);
        newLabel1.string = this.final_result.player1[0];
        this.node.addChild(newBoom1);
        //显示玩家2的结果
        var newBoom2 = cc.instantiate(this.player2Result);
        var newLabel2 = newBoom2.getChildByName('player2_result').getComponent(cc.Label);
        newLabel2.string = this.final_result.player2[0];
        this.node.addChild(newBoom2);

        //结算玩家的金币数，每点对应100金币。
        var diff = this.final_result.player1[1] - this.final_result.player2[1];
        this.player1_golds += diff * 100;
        this.player2_golds -= diff * 100;

        this.player1_golds_label.string = '$ ' + this.player1_golds;
        this.player2_golds_label.string = '$ ' + this.player2_golds;

    }








});
