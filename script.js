// needed variables
let body = null;
let target_score = 0;
let player_amount = 0;
let players = [];
let current_player = 0;
let very_first = -1;
let log = [];
let log_index = -1;
let playing = 0;
let rank = [];
let undo_on = false;
let redo_on = false;

// the function for the first page, getting the target score and the amount of players
function welcome() {
	body = document.body;

	body.innerHTML = '<h1>歡迎使用飛鏢計分器</h1>'
	               + '<input type="number" id="score" placeholder="請輸入目標分數" min=301 max=701 step=200 />'
	               + '<input type="number" id="amount" placeholder="請輸入遊玩人數" min=1 max=4 />';

	let score = document.getElementById('score');
	let amount = document.getElementById('amount');

	score.focus();
	score.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') {
			amount.focus();
		}
	})

	amount.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') {
			target_score = score.value;
			player_amount = amount.value;
			input_player();
		}
	})
}

// the function for the second page, getting the names of the players
function input_player() {
	body.innerHTML = '<h1>請輸入玩家名稱</h1>'
	for (let i = 0; i < player_amount; i++) {
		body.innerHTML += '<input id="player_name_' + i + '" placeholder="玩家 ' + (i + 1) + ' 名稱" />';
	}

	let first_input = document.getElementById('player_name_0');
	first_input.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') {
			document.getElementById('player_name_1').focus();
		}
	})
	first_input.focus();

	for (let i = 1; i < player_amount - 1; i++) {
		document.getElementById('player_name_' + i).addEventListener('keyup', function(event) {
			if (event.key === 'Enter') {
				document.getElementById('player_name_' + (i + 1)).focus();
			}
		})
	}

	document.getElementById('player_name_' + (player_amount - 1)).addEventListener('keyup', function(event) {
		if (event.key === 'Enter') {
			add_players();
		}
	})
}

// store the info of the players
function add_players() {
	for (let i = 0; i < player_amount; i++) {
		players.push({
			name: document.getElementById('player_name_' + i).value,
			score: target_score,
			playing: true
		});
	}

	playing = player_amount;

	body.addEventListener('keyup', function(event) {
		if (event.key === 'b' && undo_on) {
			undo();
		} else if (event.key === 'n' && redo_on) {
			redo();
		} else if (event.key === 'a') {
			again();
		}
	})

	game();
}

// the function for the game
function game() {
	body.innerHTML = '<h1 class="current_player">現在輪到</h1>'
	               + '<table id="table"></table>'
	               + '<input type="number" id="score" placeholder="請輸入分數" min=0 max=180 />'
	               + '<table><tr id="recovery"></tr></table>';

	let table = document.getElementById('table');

	// list the players and their scores in the table
	for (let i = 0; i < player_amount; i += 2) {
		table.innerHTML += '<tr id="tr_' + i + '"></tr>';
		let tr = document.getElementById('tr_' + i);
		for (let j = i; j < i + 2 && j < player_amount; j++) {
			if (j === current_player) {
				tr.innerHTML += '<td class="current_player">' + players[j].name + '<br />' + players[j].score+ '</td>'
			} else {
				tr.innerHTML += '<td>' + players[j].name + '<br />' + players[j].score + '</td>';
			}
		}
	}

	let recovery = document.getElementById('recovery');
	if (log_index >= 0) {
		recovery.innerHTML = '<td><button onclick="undo()">上一步(b)</button></td>';
		undo_on = true;
	} else {
		recovery.innerHTML = '<td><button disabled></button></td>';
		undo_on = false;
	}
	recovery.innerHTML += '<td><button onclick="again()">從頭再來(a)</button></td>';
	if (log_index < log.length - 1) {
		recovery.innerHTML += '<td><button onclick="redo()">下一步(n)</button></td>';
		redo_on = true;
	} else {
		recovery.innerHTML += '<td><button disabled></button></td>';
		very_first = -1;
		redo_on = false;
	}

	let score = document.getElementById('score');
	score.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') {
			logging();
			check_score(score.value);
		}
	})
	score.addEventListener('input', function() {
		if (!(score.value > 0)) {
			score.value = '';
		}
	})
	score.focus();
}

// function for undo
function undo() {
	if (very_first === -1) {
		very_first = current_player;
	}

	current_player = log[log_index].player;
	let temp = players[current_player].score;
	players[current_player].score = log[log_index].score;
	log[log_index].score = temp;
	if (players[current_player].playing === false) {
		players[current_player].playing = true;
		playing++;
		rank.pop();
	}
	log_index--;
	game();
}

// function for redo
function redo() {
	log_index++;
	current_player = log[log_index].player;
	if (players[current_player].playing === false) {
		// remove the log
		log.splice(log_index, 1);
		log_index--;
		if (log_index < log.length - 1) {
			redo();
		}
	} else {
		let temp = players[current_player].score;
		players[current_player].score = log[log_index].score;
		log[log_index].score = temp;
		if (players[current_player].score === 0 && ranking()) {
			return;
		}
	}

	if (log_index >= log.length - 1) {
		current_player = very_first;
		while (players[current_player].playing === false) {
			current_player = (current_player + 1) % player_amount;
		}
		very_first = -1;
	} else {
		current_player = log[log_index + 1].player;
	}

	game();
}

// function for logging the score
function logging() {
	if (very_first === -1) {
		log.push({
			player: current_player,
			score: players[current_player].score
		});
		log_index++;
	} else {
		log_index++;
		log[log_index] = {
			player: current_player,
			score: players[current_player].score
		};
	}
}

// check if the player is still playing
function check_score(score) {
	let temp = players[current_player].score - score;

	if (temp > 0) {
		players[current_player].score = temp;
	} else if (temp === 0) {
		players[current_player].score = 0;
		if (ranking()) {
			return;
		}
	}

	current_player = (current_player + 1) % player_amount;
	while (players[current_player].playing === false) {
		current_player = (current_player + 1) % player_amount;
	}

	game();
}

// add a player to the ranking and check if the game is over
function ranking() {
	players[current_player].playing = false;
	playing--;

	rank.push(players[current_player].name);

	if (playing <= 0) {
		result();
		return true;
	}

	return false;
}

// the function for the result
function result() {
	body.innerHTML = '<h1>遊戲結束</h1>'
	               + '<table id="table"></table>'
	               + '<button onclick="again()">再來一次(a)</button>';

	let table = document.getElementById('table');

	for (let i = 0; i < player_amount; i++) {
		table.innerHTML += '<tr><td>第 ' + (i + 1) + ' 名</td></tr>'
		                 + '<tr><td>' + rank[i] + '</td></tr>';
	}
}

// the function for playing again with the same conditions
function again() {
	for (let i = 0; i < player_amount; i++) {
		players[i].score = target_score;
		players[i].playing = true;
	}

	current_player = 0;
	playing = player_amount;
	rank = [];

	very_first = -1;
	log = [];
	log_index = -1;

	game();
}
