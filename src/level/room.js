'use strict';
var barcode = barcode || {};

barcode.Room = function(){
  this.sizeX = 0;
  this.sizeY = 0;
  this.size = 0;
  this.type = 0;
  this.tiles = [];
};

barcode.Room.prototype = {
  addStartingPoint : function(){

  },

  init : function(){
    this.sizeX = Math.floor(Math.random() * 10 +5);
    this.sizeY = Math.floor(Math.random() * 10 +5);
    for(let i=0;i<this.sizeY;i++){
      for(let j=0;j<this.sizeX;j++){
        let tempTile = new barcode.Tile();
        tempTile.x = j;
        tempTile.y = i;
        var tt = barcode.tiles[1];
        if (i ==0 || j==0 || j == (this.sizeX-1) || i==(this.sizeY-1)) tt = barcode.tiles[2];
        tempTile.tx = tt.x;
        tempTile.ty = tt.y;
        tempTile.size = tt.size;
        tempTile.type = tt.type;
        this.tiles.push(tempTile);
      }
    }
  },

  render : function(){
    var ctx = barcode.Generator.canvasTile.getContext("2d");
    this.tiles.forEach(function(elt){

      ctx.drawImage(
         barcode.Generator.tileSet,
         elt.tx,
         elt.ty,
         elt.size,
         elt.size,
         elt.x*barcode.C.TILE_SIZE_PC,
         elt.y*barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC);
    });
  }
};
