'use strict';
var barcode = barcode || {};

barcode.Room = function(){
  this.x = 0;
  this.y = 0;
  this.sizeX = 0;
  this.sizeY = 0;
  this.size = 0;
  this.type = 0;
  this.tiles = [];
  this.mobs = [];
  this.startingPoint = undefined;
};

barcode.Room.prototype = {
  addStartingPoint : function(){
    let x = Math.floor(Math.random()*(this.sizeX-2)+1);
    let y = Math.floor(Math.random()*(this.sizeY-2)+1);
    this.startingPoint = { 'x' : x, 'y' :y};
  },

  addMobs : function(){
    let nbMobs = Math.floor(Math.random() * (Math.floor( Math.sqrt(this.sizeX * this.sizeY)/2)));

    for (let i = 0 ; i < nbMobs ; i++){
      let x = Math.floor(Math.random()*(this.sizeX-2)+1);
      let y = Math.floor(Math.random()*(this.sizeY-2)+1);
      this.mobs.push({'x' : x, 'y' : y});
    }
  },


  roomCollision : function(room){
    if (room.x < (this.x + this.sizeX)
    && (room.x+ room.sizeX) > this.x
    && room.y< (this.y+this.sizeY)
    && (room.y+room.sizeY) > this.y) {
      return true;
    }
    return false;

  },

  alignTiles : function(){
    var _this = this;
    this.tiles.forEach(function(tile){
      tile.x += _this.x;
      tile.y += _this.y;
    });
    if (typeof this.startingPoint !== 'undefined'){
      this.startingPoint.x += this.x;
      this.startingPoint.y += this.y;
    }
    if (this.mobs.length > 0){
      this.mobs.forEach(function(mob){
        mob.x += _this.x;
        mob.y += _this.y;
      });
    }
  },

  init : function(){
    this.sizeX = Math.floor(Math.random() * 10 +5);
    this.sizeY = Math.floor(Math.random() * 10 +5);
    for(let i=0;i<this.sizeY;i++){
      for(let j=0;j<this.sizeX;j++){
        let tempTile = new barcode.Tile();
        tempTile.x = j;
        tempTile.y = i;
        tempTile.ttile = 1;

        if (i ==0 || j==0 || j == (this.sizeX-1) || i==(this.sizeY-1)) tempTile.ttile = 2;

        this.tiles.push(tempTile);
      }
    }
    this.addMobs();

  },

  render : function(){
    var ctx = barcode.Generator.canvasTile.getContext("2d");
    this.tiles.forEach(function(tile){
      var elt = barcode.tiles[tile.ttile];
      ctx.drawImage(
         barcode.Generator.tileSet,
         elt.x,
         elt.y,
         elt.size,
         elt.size,
         tile.x*barcode.C.TILE_SIZE_PC,
         tile.y*barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC);
    });

    if (typeof this.startingPoint !== undefined){
      ctx.drawImage(
         barcode.Generator.heroSprite,
         0,
         0,
         64,
         64,
         this.startingPoint.x*barcode.C.TILE_SIZE_PC,
         this.startingPoint.y*barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC);
    }

    for(let i = 0 ; i < this.mobs.length ; i++){
      ctx.drawImage(
         barcode.Generator.mobSprite,
         0,
         0,
         32,
         32,
         this.mobs[i].x*barcode.C.TILE_SIZE_PC,
         this.mobs[i].y*barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC,
         barcode.C.TILE_SIZE_PC);
    }
  }
};
