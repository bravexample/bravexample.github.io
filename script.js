var basic = {
    state: 0,
    target_score: 0,
    player_amount: 0,
}

var players = [];

var body;

function main() {
    body = document.getElementById('body');
    
    switch (basic.state) {
        case 0:
            welcome();
            break;
        case 1:
            input_player();
            break;
        // case 2:
        //     game();
        //     break;
        // case 3:
        //     result();
        //     break;
        default:
            body.innerHTML = '<h1>錯誤：未定義狀態</h1>'
            break;
    }
}

function next() {
    switch (basic.state) {
        case 0:
            basic.target_score = document.getElementById('target_score').value;
            basic.player_amount = document.getElementById('player_amount').value;
            basic.state = 1;
            break;
        case 1:
            for (var i = 0; i < basic.player_amount; i++) {
                players.push({
                    name: document.getElementById('player_name_' + i).value,
                    score: basic.target_score,
                });
            }
            basic.state = 2;
            break;
        // case 2:
        //     basic.state = 3;
        //     break;
        // case 3:
        //     basic.state = 0;
        //     break;
        default:
            body.innerHTML = '<h1>錯誤：未定義狀態</h1>'
            break;
    }
    main();

}

function welcome() {
    body.innerHTML = '<h1>歡迎使用飛鏢計分器</h1>'
                   + '<h2>請輸入目標分數</h2>'
                   + '<input type="number" id="target_score" value=501 min=301 max=701 step=200 />'
                   + '<h2>請輸入遊玩人數</h2>'
                   + '<input type="number" id="player_amount" value=2 min=1 max=4 />'
                   + '<button onclick="next()">下一步</button>';
}

function input_player() {
    body.innerHTML = '<h1>請輸入玩家名稱</h1>'
    for (var i = 0; i < basic.player_amount; i++) {
        body.innerHTML += '<h2>玩家 ' + (i + 1) + ' 名稱</h2>'
                        + '<input type="text" id="player_name_' + i + '" />'
    }
    body.innerHTML += '<button onclick="next()">開始遊戲</button>';
}

// just for testing