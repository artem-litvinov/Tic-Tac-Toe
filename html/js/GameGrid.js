function GameGrid(options) {
    this.options = {
        size: options.size || 300,
        cellNumber: options.cellNumber || 3,
        cellSize: options.size / options.cellNumber,
        symbolOffset: options.size / options.cellNumber * 0.1,
        menuOffset: options.menuOffset
    }
    this._positions = [];
    this.Buttons = [];
    this._moveCount = 0;
    this.draw();
};

GameGrid.prototype.draw = function () {
    let x,
        y,
        pos;

    let image = new Image();
    image.src = './images/game-grid-small.png';
    image.onload = () => {
        ctx.drawImage(image, 0, 0 + this.options.menuOffset, this.options.size, this.options.size);
    }

    pos = this._positions;
    for (let i = 0; i < this.options.cellNumber * this.options.cellNumber; i++) {
        x = i % this.options.cellNumber | 0;
        y = i / this.options.cellNumber | 0;
        if (pos[i] === 'x') {
            this.drawX(x, y);
        } else if (pos[i] === 'o') {
            this.drawO(x, y);
        }
    }
};

GameGrid.prototype.markCellWithX = function (x, y) {
    this._positions[(y * this.options.cellNumber) + x] = 'x';
    this._moveCount++;

    if (this._checkVictory(x, y, 'x')) {
        this.currentState = 'x victory'
    } else if (this._checkDraw()) {
        this.currentState = 'draw';
    }
    this.draw();
};

GameGrid.prototype.markCellWithO = function (x, y) {
    this._positions[(y * this.options.cellNumber) + x] = 'o';
    this._moveCount++;

    if (this._checkVictory(x, y, 'o')) {
        this.currentState = 'o victory'
    } else if (this._checkDraw()) {
        this.currentState = 'draw';
    }

    this.draw();
};

GameGrid.prototype.isMarkedCell = function (x, y) {
    return typeof this._positions[(y * this.options.cellNumber) + x] !== 'undefined';
};

GameGrid.prototype.isMarkedCellWith = function (x, y, symbol) {
    return this._positions[(y * this.options.cellNumber) + x] === symbol;
};

/**
  by Hardwareguy
  http://stackoverflow.com/a/1056352
  */
GameGrid.prototype._checkVictory = function (x, y, symbol) {
    var i;

    //check victory conditions check col
    for (i = 0; i < 3; i++) {
        if (!this.isMarkedCellWith(x, i, symbol))
            break;
        if (i == 2)
            return true;
    }

    //check row
    for (i = 0; i < 3; i++) {
        if (!this.isMarkedCellWith(i, y, symbol))
            break;
        if (i == 2)
            return true;
    }

    //check diag
    if (x == y) {
        //we're on a diagonal
        for (i = 0; i < 3; i++) {
            if (!this.isMarkedCellWith(i, i, symbol))
                break;
            if (i == 2)
                return true;
        }
    }

    //check anti diag
    for (i = 0; i < 3; i++) {
        if (!this.isMarkedCellWith(i, (2 - i), symbol))
            break;
        if (i == 2)
            return true;
    }

    return false;
};

GameGrid.prototype._checkDraw = function () {
    return this._moveCount == this.options.cellNumber * this.options.cellNumber;
};

GameGrid.prototype.drawX = function (cellX, cellY) {
    const posX = cellX * this.options.cellSize + this.options.symbolOffset,
        posY = cellY * this.options.cellSize + this.options.symbolOffset + this.options.menuOffset,
        symbolSize = this.options.cellSize - this.options.symbolOffset * 2;

    let image = new Image();
    image.src = './images/symbol-x-small.png';
    image.onload = () => {
        ctx.drawImage(image, posX, posY, symbolSize, symbolSize);
    }
}

GameGrid.prototype.drawO = function (cellX, cellY) {
    const posX = cellX * this.options.cellSize + this.options.symbolOffset,
        posY = cellY * this.options.cellSize + this.options.symbolOffset + this.options.menuOffset,
        symbolSize = this.options.cellSize - this.options.symbolOffset * 2;

    let image = new Image();
    image.src = './images/symbol-o-small.png';
    image.onload = () => {
        ctx.drawImage(image, posX, posY, symbolSize, symbolSize);
    }
}