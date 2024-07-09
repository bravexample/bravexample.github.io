// needed variables
var body = null;
var target_score = 0;
var player_amount = 0;
var players = [];
var current_player = 0;
var log = [];
var log_index = -1;
var very_first = -1;
var playing = 0;
var rank = [];

// the function for the first page, getting the target score and the amount of players
function welcome() {
    body = document.body;

    body.innerHTML = '<h1>歡迎使用飛鏢計分器</h1>'
                   + '<input type="number" id="score" placeholder="請輸入目標分數" min=301 max=701 step=200 />'
                   + '<input type="number" id="amount" placeholder="請輸入遊玩人數" min=1 max=4 />';

    var score = document.getElementById('score');
    var amount = document.getElementById('amount');

    score.focus();
    score.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            amount.focus();
        }
    })

    amount.addEventListener('keypress', function(event) {
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

    var first_input = document.getElementById('player_name_0');
    first_input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('player_name_1').focus();
        }
    })
    first_input.focus();

    for (let i = 1; i < player_amount - 1; i++) {
        document.getElementById('player_name_' + i).addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                document.getElementById('player_name_' + (i + 1)).focus();
            }
        })
    }

    document.getElementById('player_name_' + (player_amount - 1)).addEventListener('keypress', function(event) {
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

    game()
}

// the function for the game
function game() {
    body.innerHTML = '<h1>現在輪到<br />' + players[current_player].name + '</h1>'
                   + '<table id="table"></table>'
                   + '<input type="number" id="score" placeholder="請輸入本局分數" min=0 max=180 />'
                   + '<table><tr id="recovery"></tr></table>';

    var table = document.getElementById('table');

    // list the players and their scores in the table
    for (let i = 0; i < player_amount; i++) {
        table.innerHTML += '<tr><td>' + players[i].name + '</td></tr>'
                         + '<tr><td>' + players[i].score + '</td></tr>';
    }

    var recovery = document.getElementById('recovery');
    if (log_index >= 0) {
        recovery.innerHTML = '<td><button onclick="undo()">上一步</button></td>';
    }
    if (log_index < log.length - 1) {
        recovery.innerHTML += '<td><button onclick="redo()">下一步</button></td>';
    }

    var score = document.getElementById('score');
    score.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            check_score(score.value);
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
    var temp = players[current_player].score;
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
    var temp = players[current_player].score;
    players[current_player].score = log[log_index].score;
    log[log_index].score = temp;
    if (players[current_player].score === 0) {
        players[current_player].playing = false;
        playing--;
        rank.push(players[current_player].name);
    }

    if (log_index >= log.length - 1) {
        current_player = very_first;
        very_first = -1;
    } else {
        current_player = log[log_index + 1].player;
    }

    game();
}

// check if the player is still playing
function check_score(score) {
    very_first = -1;

    // remove the logs after the current index
    if (log_index < log.length - 1){
        log.splice(log_index + 1, log.length - log_index - 1);
    }

    log.push({
        player: current_player,
        score: players[current_player].score
    });
    log_index++;
    
    var temp = players[current_player].score - score;

    if (temp > 0) {
        players[current_player].score = temp;
    } else if (temp === 0) {
        players[current_player].score = 0;
        players[current_player].playing = false;
        playing--;

        rank.push(players[current_player].name);

        if (playing <= 0) {
            result();
            return;
        }
    }

    current_player = (current_player + 1) % player_amount;
    while (players[current_player].playing === false) {
        current_player = (current_player + 1) % player_amount;
    }

    game();
}

// the function for the result
function result() {
    body.innerHTML = '<h1>遊戲結束</h1>'
                   + '<table id="table"></table>'
                   + '<button onclick="again()">再來一次</button>';

    var table = document.getElementById('table');

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

    game();
}
