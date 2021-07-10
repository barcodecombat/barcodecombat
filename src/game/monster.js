'use strict';
var barcode = barcode || {};

barcode.Monster = function(){
  this.x = 96 ;
  this.y = 192;
  this.size = 32;
  this.spriteset = null;
  this.animation = 0;
  this.direction = 0;
  this.moving = false;
  this.loaded = false;
  this.movingTick = 0;
  this.path = [];
  this.step = 1;
  this.target = undefined;
  this.range = 50;
  this.attackSpeed = 50;
  this.lastAttack = 0;
  this.damage = 2;
  this.maxHitPoint = 10;
  this.hitpoint = 10;
  this.lastTimeCreatingPath = 0;
};

barcode.Monster.prototype = {

  loaded : function(){
    this.loaded = true;
  }
  ,
  init : function(src){
    this.spriteset = barcode.tileset.get("assets/sprites/bolt.png");
  },

  hit: function(hp){
    this.hitpoint -= hp;
    var ft = new barcode.FloatingText();
    ft.init(this.x + barcode.gameEngine.tileSize/2,this.y + barcode.gameEngine.tileSize/2,hp,barcode.C.FT_COLOR_RED);
    barcode.gameDonjon.floatingText.push(ft);
  },

  render : function(ctx){
    let tile = this.getTile();
    let tilesArray = barcode.gameDonjon.level.getTilesForAPath();
    if ((tile.x + "/" + tile.y) in tilesArray){
      if (tilesArray[tile.x + "/" + tile.y].lightened){
        ctx.drawImage(
           this.spriteset,
           this.animation*this.size,
           this.direction*this.size,
           this.size,
           this.size,
           this.x+barcode.gameEngine.centerX - barcode.gameEngine.character.x,
           this.y+barcode.gameEngine.centerY - barcode.gameEngine.character.y,
           barcode.gameEngine.tileSize,
           barcode.gameEngine.tileSize);
      }
    }

  },

  doAction : function(){
    if (typeof this.target !== 'undefined'){
      let distance = calcDistance({x:barcode.gameEngine.character.getTile().x*barcode.gameEngine.tileSize,y:barcode.gameEngine.character.getTile().y*barcode.gameEngine.tileSize},{x : this.x, y : this.y});
      if (distance > this.range && distance < barcode.C.DISTANCE_MOB_SEE_PLAYER){
        let d = new Date();
        let newTick = d.getTime();
        if(newTick - this.lastTimeCreatingPath > barcode.C.DELAY_BETWEEN_TWO_PATH_CREATION){
          this.createPathTo(barcode.gameEngine.character.getTile());
          this.lastTimeCreatingPath = newTick;
        }
        this.move();
      }else if (distance < this.range){
        this.attack();
      }
    }else{
      let distance = calcDistance({x:barcode.gameEngine.character.getTile().x*barcode.gameEngine.tileSize,y:barcode.gameEngine.character.getTile().y*barcode.gameEngine.tileSize},{x : this.x, y : this.y});
      if (distance < barcode.C.DISTANCE_MOB_SEE_PLAYER){
        this.target = barcode.gameEngine.character.getTile();
      }
    }
  },

  attack : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.lastAttack > this.attackSpeed){
      this.lastAttack = newTick;
      barcode.gameEngine.character.hit(this.damage);
    }
  },

  animate : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.movingTick >  barcode.C.ANIMATION_SPEED){
      this.movingTick = newTick;
      this.animation += 1;
      if (this.animation > 2) this.animation = 0;
    }
  },

  getTile : function(){
    let tx = Math.round(this.x/barcode.gameEngine.tileSize);
    let ty = Math.round(this.y/barcode.gameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  createPathTo : function(tileTarget){
    let distance = calcDistance({x:tileTarget.x*barcode.gameEngine.tileSize,y:tileTarget.y*barcode.gameEngine.tileSize},{x : this.x, y : this.y});
    if (distance < 200){
      this.target = tileTarget;
      if ((this.path.length == 0) || ( this.path[0].x != tileTarget.x && this.path[0].y != tileTarget.y)){
        let grid = barcode.gameDonjon.level.getAPathArray();
        let tileMob = this.getTile();

        var pthFinding = new barcode.Apath();
        var result =  pthFinding.findShortestPath([tileMob.x,tileMob.y],[tileTarget.x,tileTarget.y], grid,true);
        this.path = pthFinding.path;
        grid = [];
      }
    }
  },

  move : function(){
    if (this.path.length > 0){
      this.animate();
      var nextTile = this.path[this.path.length-1];
      var currentTile = this.getTile();
      if (nextTile.x != currentTile.x || nextTile.y != currentTile.y){
        var dx = nextTile.x - currentTile.x;
        var dy = nextTile.y - currentTile.y;
        if (dx != 0){
          if (dx > 0){
            this.x += this.step;
            this.direction = barcode.C.DIRECTION_RIGHT;
          }else{
            this.x -= this.step;
            this.direction = barcode.C.DIRECTION_LEFT;
          }
        }
        if (dy != 0){
          if (dy > 0){
            this.y += this.step;
            this.direction = barcode.C.DIRECTION_UP;
          }else{
            this.y -= this.step;
            this.direction = barcode.C.DIRECTION_DOWN;
          }
        }
      }else{
        this.path.splice(this.path.length-1);
      }
    }
  },

};
