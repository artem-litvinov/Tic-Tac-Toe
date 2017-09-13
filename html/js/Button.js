function Button(centerX, centerY, width, height, type, text, callback) {
  this._posX = centerX - (width / 2) || 0;
  this._posY = centerY - (height / 2) || 0;
  this._width = width || 50;
  this._height = height || 30;
  this._type = type;
  this.Text = text || "";
  this.Callback = callback;
}

Button.prototype.DrawButton = function () {
  var image = new Image();
  image.src = './images/' + this._type + '.png';
  image.onload = () => {
      ctx.drawImage(image, this._posX, this._posY, this._width, this._height);

      SetFontSettings();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(this.Text, this._posX + this._width / 2, this._posY + this._height / 2 - this._height * 0.07);
  }
}

Button.prototype.IsClicked = function (x, y) {
  return x >= this._posX && x <= (this._posX + this._width) && y >= this._posY && y <= (this._posY + this._height);
}