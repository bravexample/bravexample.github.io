// needed variables
var needed = {
    state: 0,
    target_score: 0,
    player_amount: 0,
    players: [],
    current_player: 0,
    playing: 0,
    rank: [],
    body: null
}

// the main function
function main() {
    switch (needed.state) {
        case 0:
            welcome();
            break;

        case 1:
            input_player();
            break;

        case 2:
            game();
            break;

        case 3:
            result();
            break;

        default:
            needed.body.innerHTML = '<h1>錯誤：未定義狀態</h1>'
    }
}

// the function for the first page, getting the target score and the amount of players
function welcome() {
    needed.body = document.body;

    needed.body.innerHTML = '<h1>歡迎使用飛鏢計分器</h1>'
                          + '<input type="number" id="target_score" placeholder="請輸入目標分數" min=301 max=701 step=200 />'
                          + '<input type="number" id="player_amount" placeholder="請輸入遊玩人數" min=1 max=4 />';

    var target_score = document.getElementById('target_score');
    var player_amount = document.getElementById('player_amount');

    target_score.focus();
    target_score.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            player_amount.focus();
        }
    })

    player_amount.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            needed.target_score = target_score.value;
            needed.player_amount = player_amount.value;
            needed.state = 1;
            main();
        }
    })
}

// the function for the second page, getting the names of the players
function input_player() {
    needed.body.innerHTML = '<h1>請輸入玩家名稱</h1>'
    for (let i = 0; i < needed.player_amount; i++) {
        needed.body.innerHTML += '<input id="player_name_' + i + '" placeholder="玩家 ' + (i + 1) + ' 名稱" />';
    }

    var first_input = document.getElementById('player_name_0');
    first_input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('player_name_1').focus();
        }
    })
    first_input.focus();

    for (let i = 1; i < needed.player_amount - 1; i++) {
        document.getElementById('player_name_' + i).addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                document.getElementById('player_name_' + (i + 1)).focus();
            }
        })
    }

    document.getElementById('player_name_' + (needed.player_amount - 1)).addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            add_players();
            needed.state = 2;
            main();
        }
    })
}

// store the info of the players
function add_players() {
    for (let i = 0; i < needed.player_amount; i++) {
        needed.players.push({
            name: document.getElementById('player_name_' + i).value,
            score: needed.target_score,
            playing: true
        });
    }

    needed.playing = needed.player_amount;
}

// the function for the game
function game() {
    needed.body.innerHTML = '<h1>現在輪到<br />' + needed.players[needed.current_player].name + '</h1>'
                          + '<table id="table"></table>'
                          + '<input type="number" id="score" placeholder="請輸入本局分數" min=0 max=180 />';

    var table = document.getElementById('table');

    // list the players and their scores in the table
    for (let i = 0; i < needed.player_amount; i++) {
        table.innerHTML += '<tr><td>' + needed.players[i].name + '</td></tr>'
                         + '<tr><td>' + needed.players[i].score + '</td></tr>';
    }

    var score = document.getElementById('score');
    score.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            check_score(score.value);
            main();
        }
    })
    score.focus();
}

// check if the player is still playing
function check_score(score) {
    var temp = needed.players[needed.current_player].score - score;

    if (temp > 0) {
        needed.players[needed.current_player].score = temp;
    } else if (temp === 0) {
        needed.players[needed.current_player].score = 0;
        needed.players[needed.current_player].playing = false;
        needed.playing--;

        needed.rank.push(needed.players[needed.current_player].name);

        if (needed.playing <= 0) {
            needed.state = 3;
            return;
        }
    }

    needed.current_player = (needed.current_player + 1) % needed.player_amount;
    while (needed.players[needed.current_player].playing === false) {
        needed.current_player = (needed.current_player + 1) % needed.player_amount;
    }
}

// the function for the result
function result() {
    needed.body.innerHTML = '<h1>遊戲結束</h1>'
                          + '<table id="table"></table>';

    var table = document.getElementById('table');

    for (let i = 0; i < needed.player_amount; i++) {
        table.innerHTML += '<tr><td>第 ' + (i + 1) + ' 名</td></tr>'
                         + '<tr><td>' + needed.rank[i] + '</td></tr>';
    }
}
