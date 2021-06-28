'use strict';
var barcode = barcode || {};

barcode.Tile = function (){
  this.x = 0;
  this.y = 0;
  this.size = 0;
  this.type = "";
  this.tx = 0;
  this.ty = 0;
  this.state = barcode.C.TILE_NOT_VISITED;
  this.lightened = false;
};

barcode.Tile.prototype = {
  render : function(ts){
    var ctx = barcode.canvas.canvasTile.getContext("2d");
    ctx.drawImage(
       ts,
       this.tx,
       this.ty,
       this.size,
       this.size,
       this.x*barcode.gameEngine.tileSize + barcode.gameEngine.centerX-barcode.gameEngine.character.x,
       this.y*barcode.gameEngine.tileSize + barcode.gameEngine.centerY-barcode.gameEngine.character.y,
       barcode.gameEngine.tileSize,
       barcode.gameEngine.tileSize);
  }
}
