// the object for the basic information of the game
var basic = {
    state: 0,
    target_score: 0,
    player_amount: 0,
}

// the object(s) and numbers for the player
var players = [];
var current_player = 0;
var playing = 0;

// for elements
var body;
var target_score;
var player_amount;
var player_names = [];

// the main function
function main() {
    body = document.getElementById('body');
    
    switch (basic.state) {
        case 0:
            welcome();
            break;
        case 1:
            input_player();
            break;
        case 2:
            game();
            break;
        // case 3:
        //     result();
        //     break;
        default:
            body.innerHTML = '<h1>錯誤：未定義狀態</h1>'
            break;
    }
}

// the function for the next step
function next() {
    switch (basic.state) {
        case 0:
            basic.target_score = target_score.value;
            basic.player_amount = player_amount.value;
            basic.state = 1;
            break;
        case 1:
            for (var i = 0; i < basic.player_amount; i++) {
                players.push({
                    name: player_names[i].value,
                    score: basic.target_score,
                });
            }
            basic.state = 2;
            break;
        case 2:
            basic.state = 3;
            break;
        // case 3:
        //     basic.state = 0;
        //     break;
        default:
            body.innerHTML = '<h1>錯誤：未定義狀態</h1>'
            break;
    }
    main();

}

// the function for the first step
function welcome() {
    body.innerHTML = '<h1>歡迎使用飛鏢計分器</h1>'
                   + '<input type="number" id="target_score" placeholder="請輸入目標分數" min=301 max=701 step=200 />'
                   + '<input type="number" id="player_amount" placeholder="請輸入遊玩人數" min=1 max=4 />'

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
            next();
        }
    })
}

function input_player() {
    body.innerHTML = '<h1>請輸入玩家名稱</h1>'
    for (var i = 0; i < basic.player_amount; i++) {
        body.innerHTML += '<input type="text" id="player_name_' + i + '" placeholder="玩家 ' + (i + 1) + ' 名稱" />'
        player_names.push(document.getElementById('player_name_' + i));
    }

    player_names[0].focus();

    // for (var i = 0; i < player_names.length - 1; i++) {
    //     player_names[i].addEventListener('keypress', function(event) {
    //         if (event.key === 'Enter') {
    //             player_names[i + 1].focus();
    //         }
    //     })
    // }

    // player_names[player_names.length - 1].addEventListener('keypress', function(event) {
    //     if (event.key === 'Enter') {
    //         next();
    //     }
    // })
}

function game() {
    body.innerHTML = '<h1 id="h1"></h1>'
                   + '<table id="table"></table>'
                   + '<input type="number" id="score" min=0 max=180 />'
                   + '<button onclick="next()">下一位</button>';
}