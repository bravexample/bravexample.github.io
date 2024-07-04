// the object for the basic information of the game
let basic = {
    state: 0,
    target_score: 0,
    player_amount: 0,
}

// the object(s) and numbers for the player
let players = [];
let current_player = 0;
let playing = 0;
let rank = [];

// for elements
let body;
let target_score;
let player_amount;
let name_row;
let score_row;
let score;
let rank_row;

// the main function
function main() {
    switch (basic.state) {
        case 0:
            body = document.getElementById('body');
            welcome();
            break;

        case 1:
            basic.target_score = target_score.value;
            basic.player_amount = player_amount.value;
            input_player();
            break;

        case 2:
            for (let i = 0; i < basic.player_amount; i++) {
                players.push({
                    name: document.getElementById('player_name_' + i).value,
                    score: basic.target_score,
                    playing: true
                });
            }
            playing = basic.player_amount;
            basic.state = 3
            game();
            break;

        case 3:
            players[current_player].score -= score.value;

            if (players[current_player].score <= 0) {
                players[current_player].playing = false;
                playing--;

                rank.push(players[current_player].name);
                
                if (playing <= 0) {
                    result()
                    break;
                }
            }

            current_player = (current_player + 1) % basic.player_amount;
            while (players[current_player].playing === false) {
                current_player = (current_player + 1) % basic.player_amount;
            }
            game();
            break;

        default:
            body.innerHTML = '<h1>錯誤：未定義狀態</h1>'
    }
}

// the function for the first page, getting the target score and the amount of players
function welcome() {
    body.innerHTML = '<h1>歡迎使用飛鏢計分器</h1>'
                   + '<input type="number" id="target_score" placeholder="請輸入目標分數" min=301 max=701 step=200 />'
                   + '<input type="number" id="player_amount" placeholder="請輸入遊玩人數" min=1 max=4 />'

    basic.state = 1;

    target_score = document.getElementById('target_score');
    player_amount = document.getElementById('player_amount');

    target_score.focus();
    target_score.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            player_amount.focus();
        }
    })

    player_amount.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            main();
        }
    })
}

// the function for the second page, getting the names of the players
function input_player() {
    body.innerHTML = '<h1>請輸入玩家名稱</h1>'
    for (let i = 0; i < basic.player_amount; i++) {
        body.innerHTML += '<input id="player_name_' + i + '" placeholder="玩家 ' + (i + 1) + ' 名稱" />';
    }

    basic.state = 2;

    let first_input = document.getElementById('player_name_0');
    first_input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('player_name_1').focus();
        }
    })
    first_input.focus();

    for (let i = 1; i < basic.player_amount - 1; i++) {
        document.getElementById('player_name_' + i).addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                document.getElementById('player_name_' + (i + 1)).focus();
            }
        })
    }

    document.getElementById('player_name_' + (basic.player_amount - 1)).addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            main();
        }
    })
}

// the function for the game
function game() {
    body.innerHTML = '<h1 id="h1">現在輪到 ' + players[current_player].name + ' 玩家</h1>'
                   + '<table><tr id="name_row"></tr><tr id="score_row"></tr></table>'
                   + '<input type="number" id="score" placeholder="請輸入本局分數" min=0 max=180 />';

    name_row = document.getElementById('name_row');
    score_row = document.getElementById('score_row');

    // list the players and their scores in the table
    for (let i = 0; i < basic.player_amount; i++) {
        name_row.innerHTML += '<td>' + players[i].name + '</td>';
        score_row.innerHTML += '<td>' + players[i].score + '</td>';
    }

    score = document.getElementById('score');
    score.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            main();
        }
    })
    score.focus();
}

// the function for the result
function result() {
    body.innerHTML = '<h1>遊戲結束</h1>'
                   + '<table><tr id="rank_row"></tr><tr id="name_row"></tr></table>';

    rank_row = document.getElementById('rank_row');
    name_row = document.getElementById('name_row');

    for (let i = 0; i < basic.player_amount; i++) {
        rank_row.innerHTML += '<td>第 ' + (i + 1) + ' 名</td>';
        name_row.innerHTML += '<td>' + rank[i] + '</td>';
    }
}