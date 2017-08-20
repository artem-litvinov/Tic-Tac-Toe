var ctx = $('#canvas')[0].getContext('2d');

function Grid() {
  this._positions = [];
  this._moveCount = 0;
  this.draw();
}

(function (Grid) {
  Math.TWO_PI = Math.PI * 2;
  ctx.lineWidth = 5;

  Grid.p = Grid.prototype;

  Grid.p.draw = function () {
    let x, y, pos;

    let image = new Image();
    image.src = './images/grid.png';
    image.onload = function () {
      ctx.drawImage(image, 0, 0, 300, 300);
    }

    pos = this._positions;
    for (let i = 0; i < 9; i++) {
      x = i % 3 | 0;
      y = i / 3 | 0;
      if (pos[i] === 'x') {
        drawX(x, y);
      } else if (pos[i] === 'o') {
        drawO(x, y);
      }
    }
  };

  Grid.p.markCellWithX = function (x, y) {
    this._positions[(y * 3) + x] = 'x';
    this._moveCount++;

    if (this._checkVictory(x, y, 'x')) {
      this.currentState = 'x victory'
    } else if (this._checkDraw()) {
      this.currentState = 'draw';
    }
    this.draw();
  };

  Grid.p.markCellWithO = function (x, y) {
    this._positions[(y * 3) + x] = 'o';
    this._moveCount++;

    if (this._checkVictory(x, y, 'o')) {
      this.currentState = 'o victory'
    } else if (this._checkDraw()) {
      this.currentState = 'draw';
    }

    this.draw();
  };

  Grid.p.isMarkedCell = function (x, y) {
    console.log(x, y);
    return typeof this._positions[(y * 3) + x] !== 'undefined';
  };

  Grid.p.isMarkedCellWith = function (x, y, symbol) {
    return this._positions[(y * 3) + x] === symbol;
  };

  /**
  by Hardwareguy 
  http://stackoverflow.com/a/1056352
  */
  Grid.p._checkVictory = function (x, y, symbol) {
    var i;

    //check victory conditions
    //check col
    for (i = 0; i < 3; i++) {
      if (!this.isMarkedCellWith(x, i, symbol)) break;
      if (i == 2) return true;
    }

    //check row
    for (i = 0; i < 3; i++) {
      if (!this.isMarkedCellWith(i, y, symbol)) break;
      if (i == 2) return true;
    }

    //check diag
    if (x == y) {
      //we're on a diagonal
      for (i = 0; i < 3; i++) {
        if (!this.isMarkedCellWith(i, i, symbol)) break;
        if (i == 2) return true;
      }
    }

    //check anti diag
    for (i = 0; i < 3; i++) {
      if (!this.isMarkedCellWith(i, (2 - i), symbol)) break;
      if (i == 2) return true;
    }

    return false;
  };

  Grid.p._checkDraw = function () {
    return this._moveCount == 9;
  };

  function drawX(cellX, cellY) {
    const posX = cellX * 100 + 5,
      posY = cellY * 100 + 5;

    let image = new Image();
    image.src = './images/symbol-x.png';
    image.onload = function () {
      ctx.drawImage(image, posX, posY, 90, 90);
    }
  }

  function drawO(cellX, cellY) {
    const posX = cellX * 100 + 5,
      posY = cellY * 100 + 5;

    let image = new Image();
    image.src = './images/symbol-o.png';
    image.onload = function () {
      ctx.drawImage(image, posX, posY, 90, 90);
    }
  }
})(Grid);

gameGrid = new Grid();
playerTurn = 0; // player 1 ('X') plays first

$('#canvas').click(function (e) {
  var x, y;
  x = e.offsetX / 100 | 0;
  y = e.offsetY / 100 | 0;

  if (!gameGrid.isMarkedCell(x, y)) {
    if (playerTurn === 0) {
      if (gameGrid.markCellWithX(x, y));
      playerTurn = 1; // next turn is of player 2 
    } else {
      gameGrid.markCellWithO(x, y);
      playerTurn = 0; // next turn is of player 1
    }

    if (typeof gameGrid.currentState !== 'undefined') {
      var msg = $('#game-msg');
      $('#canvas').off('click');

      if (gameGrid.currentState === 'o victory') {
        msg
          .css('color', '#3333ff')
          .text('O WINS');
      } else if (gameGrid.currentState === 'x victory') {
        msg
          .css('color', '#ff3333')
          .text('X WINS');
      } else if (gameGrid.currentState === 'draw') {
        msg
          .css('color', '#333333')
          .text('DRAW!');
      }
    }
  }
});