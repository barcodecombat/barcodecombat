'use strict';
var barcode = barcode || {};

barcode.Level = function(){
  this.tiles = [];
  this.monsters = [];
  this.character = undefined;
  this.maxX = 0;
  this.maxY = 0;
  this.startingPoint = {};
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

  },
  initFromGenerator : function(){
    var lvlGenerated = barcode.Generator.generateLevel();
    this.initFromJs(lvlGenerated);
  },

  init : function(src){
    //this.initFromJs(barcode.maps.map1);
    this.initFromGenerator();
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
    this.character.move();
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

    ctx = barcode.GameDonjon.canvasCreature.getContext("2d");
    this.renderMob(ctx);
    this.renderCharacter(ctx);
  }


}
