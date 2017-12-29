//在这里初始化出来十张牌
var values = [['A', 1, 1], ["2", 2, 2], ['3', 3, 3], ['4', 4, 4], ['5', 5, 5], ['6', 6, 6], ['7', 7, 7],
['8', 8, 8], ['9', 9, 9], ['10', 10, 10], ['J', 11, 10], ['Q', 12, 10], ['K', 13, 10]];
var shape = ['hei', 'hong', 'cao', 'fang'];
const vNum = 13;
const sNum = 4;

//保存两个玩家各5张牌
var random_cards = {}; 
//保存两个玩家各自5张牌组合的结果
var results = {};


//初始化10张随机的牌
module.exports.initCards = function () {
    var temp_cards = getAllCards();
    var cards_neaded = [];
    console.log('初始化10张牌');
    for (var i = 0; i < 10; i++) {
        cards_neaded.push(temp_cards[i]);
    }

    random_cards.cards1 = cards_neaded.splice(0, 5);
    random_cards.cards2 = cards_neaded.splice(0, 5);

    return random_cards;
};

function getAllCards() {
    var tempArr = [];
    for (var i = 0; i < sNum; i++) {
        for (var j = 0; j < vNum; j++) {
            var temp = [shape[i], values[j]];
            tempArr.push(temp);
        }
    }

    //打乱所有牌顺序
    tempArr.sort(function () {
        return Math.random() > 0.5 ? 1 : -1;
    });

    return tempArr;
};


/**
 * 返回两个玩家各自的结果：牛牛、牛9……牛1、没牛。
 * 没牛的情况下同时返回5张牌中最大的一个
 */
var type1 = [[1, 2, 3], [4, 5]];
var type2 = [[1, 2, 4], [3, 5]];
var type3 = [[1, 3, 4], [2, 5]];
var type4 = [[2, 3, 4], [1, 5]];
var type5 = [[1, 2, 5], [3, 4]];
var type6 = [[1, 3, 5], [2, 4]];
var type7 = [[2, 3, 5], [1, 4]];
var type8 = [[1, 4, 5], [2, 3]];
var type9 = [[2, 4, 5], [1, 3]];
var type10 = [[3, 4, 5], [1, 2]];
var all_types = [type1, type2, type3, type4, type5, type6, type7, type8, type9, type10];

module.exports.getResults = function(random_cards){
    console.log("初始化的10张牌为：", random_cards);
    var player1_cards = random_cards.cards1;
    var player2_cards = random_cards.cards2;

    console.log("player1_cards", player1_cards);
    console.log("player2_cards", player2_cards);


    //获取两位玩家最好的结果
    var player1_result = chooseBestResult(player1_cards);
    var player2_result = chooseBestResult(player2_cards);
    //获取两位玩家各自得到的点数
    var points1 = bestResultToPoints(player1_result);
    var points2 = bestResultToPoints(player2_result);

    var result = {};
    result.player1 = [player1_result, points1];
    result.player2 = [player2_result, points2];

    return result;
}

//计算一种模式下的结果
function calcuType(player_cards, type) {
	var result_front = 0;
	var result_back = 0;
	//前3张牌的计算结果
	for (var i = 0; i < 3; i++) {
		result_front += player_cards[type[0][i] - 1][1][2];
	}
    //后2张牌
	for (var i = 0; i < 2; i++) {
		result_back += player_cards[type[1][i] - 1][1][2];
	}

	return [result_front, result_back];
}


//计算10中模式所有的结果
function calcuAllTypes(player) {
	var results_all_types = [];
	for (var i = 0; i < 10; i++) {
		results_all_types.push(calcuType(player, all_types[i]));
	}

	return results_all_types;
}


//将10种模式计算的结果对应到习惯的称呼：牛牛、牛9…………
var bulls = ["牛牛", "牛9", "牛8", "牛7", "牛6", "牛6", "牛5", "牛4", "牛3", "牛2", "牛1", "没牛"];
function calcuTypeToBull(type_result) {
	var bull_result = "";
	var num1 = type_result[0] % 10;
	var num2 = type_result[1] % 10;

	if (num1 === 0) {
		switch (num2) {
			case 0:
				bull_result = "牛牛";
				break;
			case 9:
				bull_result = "牛9";
				break;
			case 8:
				bull_result = "牛8";
				break;
			case 7:
				bull_result = "牛7";
				break;
			case 6:
				bull_result = "牛6";
				break;
			case 5:
				bull_result = "牛5";
				break;
			case 4:
				bull_result = "牛4";
				break;
			case 3:
				bull_result = "牛3";
				break;
			case 2:
				bull_result = "牛2";
				break;
			case 1:
				bull_result = "牛1";
				break;
			default:
				break;
		}
	} else {
		bull_result = "没牛";
	}

	return bull_result;
}



function calcuAllTypesToBull(player) {
	var all_types_result = calcuAllTypes(player);
	var arr_bull = [];
	for (var i = 0; i < 10; i++) {
		arr_bull.push(calcuTypeToBull(all_types_result[i]));
	}
	return arr_bull;
}


//选出10种模式计算出的最好结果
function chooseBestResult(player) {
	var arr_bull = calcuAllTypesToBull(player);
	var arr = [];
	var index = 11;
	var best_result = "";
	for (var i = 0; i < 10; i++) {
		arr.push(bulls.indexOf(arr_bull[i]));
	}

	for (var i = 0; i < 10; i++) {
		if (arr[i] < index) {
			index = arr[i];
		}
	}

	best_result = bulls[index];
	return best_result;

}



//将最好的结果转换成相应的点数
//牛牛：25点，牛9~牛6：15点，牛5~牛1：10点，没牛：0点，排除花色的情况下平局暂时不考虑。
function bestResultToPoints(result) {
	var points = 0;
	switch (result) {
		case "牛牛":
			points = 25;
			break;
		case "牛9":
		case "牛8":
		case "牛7":
		case "牛6":
			points = 15;
			break;
		case "牛5":
		case "牛4":
		case "牛3":
		case "牛2":
		case "牛1":
			points = 10;
			break;
		case "没牛":
			points = 0;
			break;
	}

	return points;
}






