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
  this.changed = false;
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


    barcode.gameEngine.character.x = this.startingPoint.x * barcode.gameEngine.tileSize;
    barcode.gameEngine.character.y = this.startingPoint.y * barcode.gameEngine.tileSize;

    if (typeof src.mobs !== 'undefined'){
      var listMob = this.monsters;
      src.mobs.forEach(function(mob){
          var newMob = new barcode.Monster();
          let idMob = Math.floor(Math.random() * 4) + 1;
          newMob.init(idMob);
          newMob.x = mob.x * barcode.gameEngine.tileSize;
          newMob.y = mob.y * barcode.gameEngine.tileSize ;
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
    if (this.aPathArray.length == 0 || this.changed){
      this.aPathArray = this.aPathArrayGenerate();
      this.changed = false;
    }
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
    this.aPathArray = [];
    return grid;
  },

  initFromGenerator : function(){
    var lvlGenerated = barcode.generator.generateLevel();
    this.initFromJs(lvlGenerated);
  },

  init : function(src){
    //this.initFromJs(barcode.maps.map1);
    this.initFromGenerator();
    this.aPathArray = this.aPathArrayGenerate();
  },

  getTheMobUnderMouse : function(x,y){
    var _x = x - barcode.gameEngine.centerX + barcode.gameEngine.character.x;
    var _y = y - barcode.gameEngine.centerY + barcode.gameEngine.character.y;
    var result = null;
    this.monsters.forEach(function(elt){
      if (((_x-barcode.gameEngine.tileSize)< elt.x) && ((_x+barcode.gameEngine.tileSize)>elt.x ) && ((_y-barcode.gameEngine.tileSize)< elt.y) && ((_y+barcode.gameEngine.tileSize)>elt.y )){
        result = elt;
      }
    });
    return result;
  },

  getMobToAttack : function(){
    for (let i=0;i < this.monsters.length ; i++){
      var dist = calcDistance(this.monsters[i], barcode.gameEngine.character);
      if (dist < barcode.gameEngine.character.rangeAttack){
        return(this.monsters[i]);
      }
    }
    return null;
  },

  getTheDecorUnderMouse : function(x,y){
    var _x = x - barcode.gameEngine.centerX + barcode.gameEngine.character.x;
    var _y = y - barcode.gameEngine.centerY + barcode.gameEngine.character.y;
    var result = null;
    this.decors.forEach(function(elt){
      if (((_x-barcode.gameEngine.tileSize)< elt.x*barcode.gameEngine.tileSize) && ((_x+barcode.gameEngine.tileSize)>elt.x*barcode.gameEngine.tileSize ) && ((_y-barcode.gameEngine.tileSize)< elt.y*barcode.gameEngine.tileSize) && ((_y+barcode.gameEngine.tileSize)>elt.y*barcode.gameEngine.tileSize )){
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
    this.decors.forEach(function(elt){
      if (elt.blocking){
        grid[elt.y][elt.x].status = "Obstacle";
      }
    });
    return grid;
  },

  removeMonster : function(mob){
    const index = this.monsters.indexOf(mob);
    if (index !== -1) {
        this.monsters.splice(index, 1);
    }
    mob = {};
  },

  removeDecor : function(elt){
    const index = this.decors.indexOf(elt);
    if (index !== -1) {
        this.decors.splice(index, 1);
    }
    this.changed = true;
  },

  renderMob : function(ctx){
    var _ctx = ctx;
    var monsterToRemove = [];
    //console.log(this.monsters);
    //console.log(barcode.gameEngine.character);
    this.monsters.forEach(function(elt){

      elt.doAction();
      elt.render(_ctx);
      if (elt.hitpoint <= 0) monsterToRemove.push(elt);

    })
    for (let i=0;i<monsterToRemove.length;i++){
      var animation = new barcode.Animation();
      animation.init(barcode.C.ANIMATION_BLOOD, 5000);
      animation.setXY(monsterToRemove[i].x,monsterToRemove[i].y);
      animation.layerToDraw = barcode.canvas.canvasTile.getContext("2d");
      barcode.gameDonjon.animations.push(animation);
      this.removeMonster(monsterToRemove[i]);
    }
  },

  renderCharacter : function(ctx){
    barcode.gameEngine.character.loop();
    barcode.gameEngine.character.render(ctx);
  },

  makeLight : function(){
    var tiles = {};
    this.tiles.forEach(function(elt){
      elt.lightened = false;
    })
    let chTile = barcode.gameEngine.character.getTile();
    let radius = barcode.gameEngine.character.lightRadius;
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
    let xi = Math.floor(barcode.canvas.canvasTile.width / barcode.gameEngine.tileSize) +1;
    let yj = Math.floor(barcode.canvas.canvasTile.height / barcode.gameEngine.tileSize) +1;

    for( let i = 0 ; i < xi ; i++){
      for( let j = 0 ; j < yj ; j++){
          let chTile = barcode.gameEngine.character.getTile();
          let rx = Math.floor((i * barcode.gameEngine.tileSize - barcode.gameEngine.centerX+barcode.gameEngine.character.x)/barcode.gameEngine.tileSize);
          let ry = Math.floor((j * barcode.gameEngine.tileSize - barcode.gameEngine.centerY+barcode.gameEngine.character.y)/barcode.gameEngine.tileSize);
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

            ctx.fillRect(rx*barcode.gameEngine.tileSize + barcode.gameEngine.centerX-barcode.gameEngine.character.x,
                         ry*barcode.gameEngine.tileSize + barcode.gameEngine.centerY-barcode.gameEngine.character.y,
                        barcode.gameEngine.tileSize,
                        barcode.gameEngine.tileSize);
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
