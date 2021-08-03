'use strict';
var barcode = barcode || {};

barcode.Room2 = function(){
  this.x = 0;
  this.y = 0;
  this.sizeX = 0;
  this.sizeY = 0;
  this.tiles = [];
  this.mobs = [];
  this.decors = [];
  this.doors = [];
};

barcode.Room2.prototype = {
    createRoom : function(){
        this.wall = barcode.generator2.listOfTilesToUse.wall[0];
        this.ground = barcode.generator2.listOfTilesToUse.ground[0];
        this.sizeX = Math.floor(Math.random() * 10 +5);
        this.sizeY = Math.floor(Math.random() * 10 +5);
        for(let i=0;i<this.sizeY;i++){
            for(let j=0;j<this.sizeX;j++){
                let tempTile = new barcode.Tile();
                tempTile.x = j;
                tempTile.y = i;
                tempTile.ttile = this.ground;
                if (i ==0 || j==0 || j == (this.sizeX-1) || i==(this.sizeY-1)) tempTile.ttile = this.wall;
                this.tiles.push(tempTile);
            }
        }
    },

    addDoor : function (pos){
        let x = this.x;
        let y = this.y;
        if (pos == barcode.C.DOOR_EAST){
            x = this.x + this.sizeX -1;
            y = Math.floor(this.y + this.sizeY/2);
        }else if (pos == barcode.C.DOOR_NORTH){
            x = Math.floor(this.x + this.sizeX/2);
            y = this.y;
        }else if (pos == barcode.C.DOOR_SOUTH){
            x =  Math.floor(this.x + this.sizeX/2);
            y = this.y+ this.sizeY -1;
        }else if (pos == barcode.C.DOOR_WEST){
            x = this.x ;
            y =  Math.floor(this.y + this.sizeY/2);
        }
        this.doors.push({ 'x' : x, 'y' : y});
        this.tiles.forEach(function(tile){
            if (tile.x == x && tile.y == y){
                tile.ttile = 1;
            }
            });
        
        let dec = new barcode.Decor();
        dec.load(barcode.C.DECOR_DOOR);
        dec.x = x;
        dec.y = y;
        this.decors.push(dec);
    },

    addRandomDoor : function(previous = -1){
        let pos = Math.floor(Math.random()*2) + 1;
        if (pos == barcode.C.DOOR_WEST) pos == barcode.C.DOOR_EAST;
        this.addDoor(pos);
        
        return pos;
    },

    addChest : function(){
        var x = Math.floor(Math.random()*(this.sizeX-2) + 1);
        var y = Math.floor(Math.random()*(this.sizeY-2) + 1);
        var dec = new barcode.Decor();
        dec.load(barcode.C.DECOR_CHEST);
        dec.x = x + this.x;
        dec.y = y + this.y;
        this.decors.push(dec);
      },

    addStartingPoint : function(){
        let x = Math.floor(Math.random()*(this.sizeX-2)+1 + this.x );
        let y = Math.floor(Math.random()*(this.sizeY-2)+1 + this.y );
        this.startingPoint = { 'x' : x, 'y' :y};
    },

    alignTiles : function(){
        var _this = this;
        this.tiles.forEach(function(tile){
          tile.x += _this.x;
          tile.y += _this.y;
        });
        if (this.mobs.length > 0){
          this.mobs.forEach(function(mob){
            mob.x += _this.x;
            mob.y += _this.y;
          });
        }
      },

    render : function(){
        var ctx = barcode.canvas.canvasTile.getContext("2d");
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

        for(let i = 0 ; i < this.decors.length ; i++){
            ctx.drawImage(
               this.decors[i].spriteset,
               this.decors[i].sprites[this.decors[i].state].x,
               this.decors[i].sprites[this.decors[i].state].y,
               32,
               32,
               this.decors[i].x*barcode.C.TILE_SIZE_PC,
               this.decors[i].y*barcode.C.TILE_SIZE_PC,
               barcode.C.TILE_SIZE_PC,
               barcode.C.TILE_SIZE_PC);
        }
    },
}