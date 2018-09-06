'use strict';
var barcode = barcode || {};

barcode.Level = function(){
  this.tiles = [];
  this.monsters = [];
  this.character = undefined;
  this.maxX = 0;
  this.maxY = 0;
  this.startingPoint = {};
  this.aPathArray = [];
  this.decors = [];
};

barcode.Level.prototype = {

  initFromJs : function(src){
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

    this.startingPoint = src.startingpoint;

    this.character = new barcode.Character();
    this.character.init();
    this.character.x = this.startingPoint.x * barcode.GameEngine.tileSize;
    this.character.y = this.startingPoint.y * barcode.GameEngine.tileSize;

    if (typeof src.mobs !== 'undefined'){
      var listMob = this.monsters;
      src.mobs.forEach(function(mob){
          var newMob = new barcode.Monster();
          newMob.init();
          newMob.x = mob.x * barcode.GameEngine.tileSize;
          newMob.y = mob.y * barcode.GameEngine.tileSize ;
          listMob.push(newMob);
      });
    }

    if (typeof src.decors !== 'undefined'){
      var _this = this;
      src.decors.forEach(function(elt){
        var dec = new barcode.Decor();
        dec.load(elt.templateId);
        dec.x = elt.x;
        dec.y = elt.y;
        _this.decors.push(dec);
      });
    }
  },

  getAPathArray : function(){
    if (this.aPathArray.length == 0)
      this.aPathArray = this.aPathArrayGenerate();
    var grid = [];
    for (let i = 0 ; i < this.aPathArray.length ; i++){
      var rawG = [];
      for (let j=0 ; j < this.aPathArray[i].length;j++){
        var elt = this.aPathArray[i][j];
        var brick = JSON.parse(JSON.stringify(elt));
        rawG.push(brick);
      }
      grid[i] = rawG;
    }
    return grid;
  },

  initFromGenerator : function(){
    var lvlGenerated = barcode.Generator.generateLevel();
    this.initFromJs(lvlGenerated);
  },

  init : function(src){
    //this.initFromJs(barcode.maps.map1);
    this.initFromGenerator();
    this.aPathArray = this.aPathArrayGenerate();
  },

  getTheMobUnderMouse : function(x,y){
    var _x = x - barcode.GameEngine.centerX + this.character.x;
    var _y = y - barcode.GameEngine.centerY + this.character.y;
    var result = null;
    this.monsters.forEach(function(elt){
      if (((_x-barcode.GameEngine.tileSize)< elt.x) && ((_x+barcode.GameEngine.tileSize)>elt.x ) && ((_y-barcode.GameEngine.tileSize)< elt.y) && ((_y+barcode.GameEngine.tileSize)>elt.y )){
        result = elt;
      }
    });
    return result;
  },

  getTilesForAPath : function(){
    var tiles = {};
    this.tiles.forEach(function(tile){
      tiles[tile.x + "/" + tile.y] = tile;
    });
    return tiles;
  },

  aPathArrayGenerate : function(){
    let grid = [];
    let tiles= this.getTilesForAPath();
    for (var i=0;i<this.maxY;i++){
      grid[i] = [];
    }
    for (let i=0;i<this.maxY;i++){
      for (let j=0;j<this.maxX;j++){
        let brick = {'x' : j, 'y' : i, 'F' : -1, 'G' : -1, 'status' : 'Obstacle','cameFrom' : {}};
        if (( j + "/" + i) in tiles){
          if(tiles[j + "/" + i].type == "ground")
            brick.status = 'Empty';
        }
        grid[i][j] = brick;
      }
    }

    return grid;
  },

  removeMonster : function(mob){
    const index = this.monsters.indexOf(mob);
    if (index !== -1) {
        this.monsters.splice(index, 1);
    }
  },

  renderMob : function(ctx){
    var _ctx = ctx;
    var _this = this;
    var monsterToRemove = [];
    this.monsters.forEach(function(elt){
      elt.createPathTo(_this.character.getTile());
      elt.doAction();
      elt.render(_ctx);
      if (elt.hitpoint <= 0) monsterToRemove.push(elt);
    })
    for (let i=0;i<monsterToRemove.length;i++){
      var animation = new barcode.Animation();
      animation.init();
      animation.x = monsterToRemove[i].x;
      animation.y = monsterToRemove[i].y;
      animation.layerToDraw = barcode.GameDonjon.canvasTile.getContext("2d");
      barcode.GameDonjon.animations.push(animation);
      this.removeMonster(monsterToRemove[i]);
    }
  },

  renderCharacter : function(ctx){
    this.character.loop();
    this.character.render(ctx);
  },

  render : function(ts){
    var _this = this;
    var ctx = barcode.GameDonjon.canvasTile.getContext("2d");
    this.tiles.forEach(function(elt){
      ctx.drawImage(
         ts,
         elt.tx,
         elt.ty,
         elt.size,
         elt.size,
         elt.x*barcode.GameEngine.tileSize + barcode.GameEngine.centerX-_this.character.x,
         elt.y*barcode.GameEngine.tileSize + barcode.GameEngine.centerY-_this.character.y,
         barcode.GameEngine.tileSize,
         barcode.GameEngine.tileSize);
    });
    this.decors.forEach(function(elt){
      elt.render(ctx);
    })

    ctx = barcode.GameDonjon.canvasCreature.getContext("2d");
    this.renderMob(ctx);
    this.renderCharacter(ctx);
  }


}
