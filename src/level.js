'use strict';
var barcode = barcode || {};

barcode.Level = function(){
  this.tiles = [];
  this.maxX = 0;
  this.maxY = 0;
};

barcode.Level.prototype = {
  init : function(src){
    var tiles = this.tiles;
    let xx =0, yy = 0;
    src.tiles.forEach(function(elt){
      var tempTile = new barcode.Tile();
      tempTile.x = elt.x;
      tempTile.y = elt.y;

      var tt = barcode.tiles[elt.ttile];
      tempTile.tx = tt.x;
      tempTile.ty = tt.y;
      tempTile.size = tt.size;
      tempTile.type = tt.type;
      tiles.push(tempTile);
      if (elt.x > xx)  xx = elt.x;
      if (elt.y > yy)  yy = elt.y;
    });
    this.maxX = xx + 1;
    this.maxY = yy + 1;
  },

  aPathArray : function(){
    let grid = [];
    for (var i=0;i<this.maxY;i++){
      grid[i] = [];
    }

    this.tiles.forEach(function(elt){
      let brick = {x : elt.x, y : elt.y, F : -1, G : -1, status : 'Obstacle',cameFrom : {}};
      if (elt.type == "ground"){
        brick.status = 'Empty';
      }
      grid[elt.y][elt.x] = brick
    });

    return grid;
  },

  render : function(ts,ctx){
    this.tiles.forEach(function(elt){
      ctx.drawImage(
         ts,
         elt.tx,
         elt.ty,
         elt.size,
         elt.size,
         elt.x*elt.size,
         elt.y*elt.size,
         elt.size,
         elt.size);
    });
  }


}
