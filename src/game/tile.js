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
};

barcode.Tile.prototype = {
  render : function(ts){
    var ctx = barcode.GameDonjon.canvasTile.getContext("2d");
    ctx.drawImage(
       ts,
       this.tx,
       this.ty,
       this.size,
       this.size,
       this.x*barcode.GameEngine.tileSize + barcode.GameEngine.centerX-barcode.GameDonjon.level.character.x,
       this.y*barcode.GameEngine.tileSize + barcode.GameEngine.centerY-barcode.GameDonjon.level.character.y,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);
  }
}
