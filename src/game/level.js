'use strict';
var barcode = barcode || {};

barcode.Level = function(){
  this.tiles = [];
  this.monsters = [];
  this.maxX = 0;
  this.maxY = 0;
  this.startingPoint = {};
  this.aPathArray = [];
  this.decors = [];
  this.aPathTiles = undefined;
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


    barcode.GameEngine.character.x = this.startingPoint.x * barcode.GameEngine.tileSize;
    barcode.GameEngine.character.y = this.startingPoint.y * barcode.GameEngine.tileSize;

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
    var _x = x - barcode.GameEngine.centerX + barcode.GameEngine.character.x;
    var _y = y - barcode.GameEngine.centerY + barcode.GameEngine.character.y;
    var result = null;
    this.monsters.forEach(function(elt){
      if (((_x-barcode.GameEngine.tileSize)< elt.x) && ((_x+barcode.GameEngine.tileSize)>elt.x ) && ((_y-barcode.GameEngine.tileSize)< elt.y) && ((_y+barcode.GameEngine.tileSize)>elt.y )){
        result = elt;
      }
    });
    return result;
  },

  getTheDecorUnderMouse : function(x,y){
    var _x = x - barcode.GameEngine.centerX + barcode.GameEngine.character.x;
    var _y = y - barcode.GameEngine.centerY + barcode.GameEngine.character.y;
    var result = null;
    this.decors.forEach(function(elt){
      if (((_x-barcode.GameEngine.tileSize)< elt.x*barcode.GameEngine.tileSize) && ((_x+barcode.GameEngine.tileSize)>elt.x*barcode.GameEngine.tileSize ) && ((_y-barcode.GameEngine.tileSize)< elt.y*barcode.GameEngine.tileSize) && ((_y+barcode.GameEngine.tileSize)>elt.y*barcode.GameEngine.tileSize )){
        result = elt;
      }
    });
    return result;
  },

  getTilesForAPath : function(){
    if (typeof this.aPathTiles === 'undefined'){
      var _this = this;
      this.aPathTiles = {};
      this.tiles.forEach(function(tile){
        _this.aPathTiles[tile.x + "/" + tile.y] = tile;
      });
    }
    return this.aPathTiles;
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

  removeDecor : function(elt){
    const index = this.decors.indexOf(elt);
    if (index !== -1) {
        this.decors.splice(index, 1);
    }
  },

  renderMob : function(ctx){
    var _ctx = ctx;
    var monsterToRemove = [];
    this.monsters.forEach(function(elt){
      elt.createPathTo(barcode.GameEngine.character.getTile());
      elt.doAction();
      elt.render(_ctx);
      if (elt.hitpoint <= 0) monsterToRemove.push(elt);

    })
    for (let i=0;i<monsterToRemove.length;i++){
      var animation = new barcode.Animation();
      animation.init();
      animation.x = monsterToRemove[i].x;
      animation.y = monsterToRemove[i].y;
      animation.layerToDraw = barcode.canvas.canvasTile.getContext("2d");
      barcode.GameDonjon.animations.push(animation);
      this.removeMonster(monsterToRemove[i]);
    }
  },

  renderCharacter : function(ctx){
    barcode.GameEngine.character.loop();
    barcode.GameEngine.character.render(ctx);
  },

  makeLight : function(){
    var tiles = {};
    this.tiles.forEach(function(elt){
      elt.lightened = false;
    })
    let chTile = barcode.GameEngine.character.getTile();
    let radius = barcode.GameEngine.character.lightRadius;
    for (let i = -radius ; i < radius ; i++){
      for (let j = -radius ; j < radius ; j++){
        let tile = {'x' : chTile.x + i, 'y' : chTile.y +j};
        tiles[(chTile.x) + i + "/" + (chTile.y + j)] = tile;
      }
    }
    return tiles;
  },

  renderFog : function(){
    var ctx = barcode.canvas.canvasTile.getContext("2d");
    var tiles = this.getTilesForAPath();
    var lightTiles = this.makeLight();
    let xi = Math.floor(barcode.canvas.canvasTile.width / barcode.GameEngine.tileSize) +1;
    let yj = Math.floor(barcode.canvas.canvasTile.height / barcode.GameEngine.tileSize) +1;

    for( let i = 0 ; i < xi ; i++){
      for( let j = 0 ; j < yj ; j++){
          let chTile = barcode.GameEngine.character.getTile();
          let rx = Math.floor((i * barcode.GameEngine.tileSize - barcode.GameEngine.centerX+barcode.GameEngine.character.x)/barcode.GameEngine.tileSize);
          let ry = Math.floor((j * barcode.GameEngine.tileSize - barcode.GameEngine.centerY+barcode.GameEngine.character.y)/barcode.GameEngine.tileSize);
          ctx.beginPath();
          if ((rx + "/" + ry ) in lightTiles && (rx + "/" + ry ) in tiles){
              tiles[rx + "/" + ry].state = barcode.C.TILE_VISITED;
              tiles[rx + "/" + ry].lightened = true;
          }else{
            if ((rx + "/" + ry ) in tiles){
              if (tiles[rx + "/" + ry].state === barcode.C.TILE_VISITED){
                ctx.fillStyle = "rgba(0,0,0,0.5)";
              }else{
                ctx.fillStyle = "black";
              }
            }else{
              ctx.fillStyle = "black";
            }

            ctx.fillRect(rx*barcode.GameEngine.tileSize + barcode.GameEngine.centerX-barcode.GameEngine.character.x,
                         ry*barcode.GameEngine.tileSize + barcode.GameEngine.centerY-barcode.GameEngine.character.y,
                        barcode.GameEngine.tileSize,
                        barcode.GameEngine.tileSize);
        }
      }
    }
  },

  render : function(ts){
    var _this = this;
    var ctx = barcode.canvas.canvasTile.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,barcode.canvas.canvasTile.width,barcode.canvas.canvasTile.height);
    this.tiles.forEach(function(elt){
      elt.render(ts);
    });
    this.decors.forEach(function(elt){
      elt.render();
    })
    this.renderFog();
    ctx = barcode.canvas.canvasCreature.getContext("2d");
    this.renderMob(ctx);
    this.renderCharacter(ctx);

  }


}
