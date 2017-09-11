console.log("hello");

let fs = require('fs');

var house1 = (function(){
	var deck = [];
	for(var i = 2; i < 15; ++i){
		deck.push(i);
	}
	return deck;
})();

var house2 = (function(){
	var deck = [];
	for(var i = 14; i > 1; --i){
		deck.push(i);
	}
	return deck;
})();

var iterations = 10000;
var results = {};
var wins = {};
var len = 0
var best= [];
var finished = {};
var yikes = 0;
var higherIterations = 100;
var totalBest = [];
var index = 0;

start();

function start(){
	for(var i = 0; i < higherIterations; ++i){
		index = i;
		reset();
		main();
	};
	writeToJSON();
}

function reset(){
	results = {};
	wins = {};
	len = 0
	best= [];
	finished = {};
	yikes = 0;
}

function main(){
	for(var i = 0; i < iterations; ++i){
		yikes++;
		var deck = makeDeck();
		var score = game(deck);
		if(score){
			results[deck] = score;
			wins[deck] = 0;
			len++
		}
	}
	len--;
	var testWins = (function(){
		var test = {}
		for(var x in wins){
			yikes++
			test[x] = wins[x];
		}
		return test;
	})();
	// console.log(testWins);
	realGame();
	// console.log(finished);
	winners();
	for(var x in best){
		totalBest.push({
		    "Deck" : best[x][0],
			"Wins" : best[x][1],
			"Pecentage" : Math.round((best[x][1]/len) * 100) + "%",
			"Run" : index
	  });
	}
	print();
}

function print(){
	console.log(best);
	for(var x in best){
		yikes++
		console.log("Deck - " + best[x][0]);
		console.log("Wins - " + best[x][1]);
		console.log("Pecentage - " + Math.round((best[x][1]/len) * 100) + "%");
	}
	console.log("YIKES - " + yikes)
	console.log("Total - " + (len - 0 + 1))
}

function writeToJSON(){
  fs.readFile('./test.json', (err, file) => {
    let jsonArray = JSON.parse(file);
  	for(var x in totalBest){
	   jsonArray.push(totalBest[x]);
	}
	fs.writeFile('test.json', JSON.stringify(jsonArray),function(err){
		if(err){
			console.log("woah");
		}
	});
  });
}

function winners(){
	var max = 0;
	for(var x in finished){
		yikes++
		if(finished[x] > max){
			max = finished[x];
			best = [[x,finished[x]]];
		}
		else if(finished[x] === max){
			best.push([x,finished[x]]);
		}
	}
}

function realGame(){
	for(var x in wins){
		yikes++
		realWar(x);
		finished[x] = wins[x];
		delete wins[x];
	}
}

function realWar(deck){
	var win = 0;
	for(var x in wins){
		yikes++
		if (x !== deck){
			warNoHouse(deck,x);
		}
	}
}

function warNoHouse(deck, deck2){
	var score = 0;
	var score2 = 0;
	for(var i = 0; i < deck.length; ++i){
		yikes++
		if(deck[i] > deck2[i]){
			score++;
		}
		else if (deck[i] !== deck2[i]){
			score2++;
		}
	}
	if(score > score2){
		wins[deck]++;
	}
	else if(score !== score2){
		wins[deck2]++;
	}
}

function game(deck){
	var score = 0;
	var score1 = run(deck,house1);
	var score2 = run(deck,house2);
	if(score1 && score2){
		return score1 + score2;
	}
	return false;
}

function run(deck,house){
	var score = war(deck,house);
	if(score){
		return score;
	}
	return false;
}

function war(deck, house){
	var score = 0
	for(var i = 0; i < deck.length; ++i){
		if(deck[i] > house[i]){
			score++;
		}
	}
	if(score < 7){
		score = 0;
	}
	return score;
}

function makeDeck(){
	var deck = [];
	var cards = (function(){
		var deck = [];
		for(var i = 2; i < 15; ++i){
			deck.push(i);
		}
		return deck;
	})();
	while(cards.length){
		var index = Math.round(Math.random()*cards.length-1);
		// console.log("index-" + index);
		// console.log("length-" + cards.length);
		deck.push(cards.splice(index,1));
	}
	return deck;
}