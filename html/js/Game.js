var score = 0,
    score_text,
    $canvas = $('#canvas')[0],
    ctx = $canvas.getContext('2d'),
    gameGrid,
    gameButtons = [];

$(document).ready(function (e) {

    var width;
    if (document.documentElement.clientHeight > document.documentElement.clientWidth) {
        width = document.documentElement.clientWidth <= document.documentElement.clientHeight * 0.7 ?
            document.documentElement.clientWidth :
            document.documentElement.clientHeight * 0.7;
    } else {
        width = document.documentElement.clientHeight * 0.7;
    }

    var options = {
        size: width,
        cellNumber: 3,
        menuOffset: document.documentElement.clientHeight * 0.3
    }

    $canvas.height = document.documentElement.clientHeight;
    $canvas.width = width;

    gameGrid = new GameGrid(options);

    SetFontSettings();
    ctx.fillStyle = '#d8243d';
    ctx.fillText("X TURN", $canvas.width / 2, $canvas.height * 0.06);
    ctx.fillStyle = '#000000';
    ctx.fillText("Your score: " + score, $canvas.width / 2, $canvas.height * 0.12);

    playerTurn = 0; // player 1 ('X') plays first
});

$('#canvas').click(handlerClick);

function handlerClick(e) {

    for (var btn in gameButtons) {
        if (gameButtons[btn].IsClicked(e.offsetX, e.offsetY))
            gameButtons[btn].Callback();
    }

    if (typeof gameGrid.currentState === 'undefined') {

        if (e.offsetY > ($canvas.height * 0.3)) {
            var x = e.offsetX / gameGrid.options.cellSize | 0,
                y = (e.offsetY - gameGrid.options.menuOffset) / gameGrid.options.cellSize | 0;

            if (!gameGrid.isMarkedCell(x, y)) {
                ctx.clearRect(0, 0, $canvas.width, $canvas.height * 0.10);
                if (playerTurn === 0) {
                    gameGrid.markCellWithX(x, y);
                    ctx.fillStyle = '#405fa4';
                    ctx.fillText("O TURN", $canvas.width / 2, $canvas.height * 0.06);
                    playerTurn = 1; // next turn is of player 2

                    if (typeof gameGrid.currentState === 'undefined') {

                        $('#canvas').off('click');

                        setTimeout(() => {
                            BotTurn();

                            ctx.clearRect(0, 0, $canvas.width, $canvas.height * 0.10);
                            ctx.fillStyle = '#d8243d';
                            ctx.fillText("X TURN", $canvas.width / 2, $canvas.height * 0.06);
                            playerTurn = 0; // next turn is of player 1

                            $('#canvas').on('click', handlerClick);

                            if (typeof gameGrid.currentState !== 'undefined') {
                                setGameOver();
                            }
                        }, 1000)
                    }
                }

                if (typeof gameGrid.currentState !== 'undefined') {
                    setGameOver();
                }
            }
        }
    }
}

// Triggers the Game Over status. Shows a defeat message and disables all input
// and processing. Also, sets the score.
function setGameOver() {

    var msg = $('#game-msg');

    ctx.clearRect(0, 0, $canvas.width, $canvas.height * 0.3);
    SetFontSettings();

    if (gameGrid.currentState === 'o victory') {
        ctx.fillStyle = '#405fa4';
        ctx.fillText("O WINS", $canvas.width / 2, $canvas.height * 0.06);
        document.getElementById('lose').play()
    } else if (gameGrid.currentState === 'x victory') {
        score++;
        ctx.fillStyle = '#d8243d';
        ctx.fillText("X WINS", $canvas.width / 2, $canvas.height * 0.06);
        document.getElementById('win').play();
    } else if (gameGrid.currentState === 'draw') {
        ctx.fillStyle = '#000000';
        ctx.fillText("DRAW!", $canvas.width / 2, $canvas.height * 0.06);
        document.getElementById('lose').play()
    }

    ctx.fillStyle = '#000000';
    ctx.fillText("Your score: " + score, $canvas.width / 2, $canvas.height * 0.12);

    var playBtn = new Button($canvas.width * 0.35, $canvas.height * 0.21, $canvas.width * 0.27, ($canvas.width * 0.27) * 0.39, "simple-button", "Play", function () {

            ctx.clearRect(0, 0, $canvas.width, $canvas.height);

            gameButtons = [];

            gameGrid = new GameGrid(gameGrid.options);
            SetFontSettings();
            ctx.fillStyle = '#d8243d';
            ctx.fillText("X TURN", $canvas.width / 2, $canvas.height * 0.06);
            ctx.fillStyle = '#000000';
            ctx.fillText("Your score: " + score, $canvas.width / 2, $canvas.height * 0.12);
            playerTurn = 0;
        }),
        stopBtn = new Button($canvas.width * 0.65, $canvas.height * 0.21, $canvas.width * 0.27, ($canvas.width * 0.27) * 0.39, "simple-button", "Stop", function () {

            ctx.clearRect(0, 0, $canvas.width, $canvas.height);

            gameButtons = [];

            SetFontSettings(20);
            ctx.fillStyle = '#000000';
            ctx.fillText("Good bye!", $canvas.width * 0.5, $canvas.height * 0.5);


            // Score and user data are sent to the bot to update the leaderboard
            var uid = parse("uid");
            var msgid = parse("msgid");
            var chatid = parse("chatid");
            var iid = parse("iid");

            if (uid && msgid && chatid) {
                $.get("/setscore/uid/" + uid + "/chat/" + chatid + "/msg/" + msgid + "/score/" + score);
            } else if (uid && iid) {
                $.get("/setscore/uid/" + uid + "/iid/" + iid + "/score/" + score)
            }

            window.close();
        });
    playBtn.DrawButton();
    stopBtn.DrawButton();
    gameButtons.push(playBtn);
    gameButtons.push(stopBtn);
}

// Simple borrowed function to retrieve GET parameters
function parse(val) {
    var result = undefined;
    tmp = [];
    location
        .search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === val)
                result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function Game() {
    this.FieldSize = {
        height,
        width
    }
}

function BotTurn() {
    while (true) {
        var x = RandomInteger(0, gameGrid.options.cellNumber - 1);
        y = RandomInteger(0, gameGrid.options.cellNumber - 1);

        if (!gameGrid.isMarkedCell(x, y)) {
            gameGrid.markCellWithO(x, y);
            return;
        }
    }
}

function RandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function SetFontSettings(additionalSize = 0) {
    if ($canvas.width > 630){
        ctx.font = ( 50 + additionalSize) + 'px Courier New';
    } else {
        ctx.font = ($canvas.width * 0.1 - 15 + additionalSize) + 'px Courier New';
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
}