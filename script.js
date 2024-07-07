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
let table;
let score;

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
  body.innerHTML = '<h1>現在輪到<br />' + players[current_player].name + '</h1>'
                 + '<table id="table"></table>'
                 + '<input type="number" id="score" placeholder="請輸入本局分數" min=0 max=180 />';

  table = document.getElementById('table');

  // list the players and their scores in the table
  for (let i = 0; i < basic.player_amount; i++) {
    table.innerHTML += '<tr><td>' + players[i].name + '</td></tr>'
                     + '<tr><td>' + players[i].score + '</td></tr>';
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
                 + '<table id="table"></table>';

  table = document.getElementById('table');

  for (let i = 0; i < basic.player_amount; i++) {
    table.innerHTML += '<tr><td>第 ' + (i + 1) + ' 名</td></tr>'
                     + '<tr><td>' + rank[i] + '</td></tr>';
  }
}
