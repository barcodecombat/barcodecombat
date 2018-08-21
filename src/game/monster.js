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
  this.target = "undefined";
  this.range = 1;
  this.attackSpeed = 500;
  this.lastAttack = 0;
  this.damage = 1;
  this.hitpoint = 10;
};

barcode.Monster.prototype = {

  loaded : function(){
    this.loaded = true;
  }
  ,
  init : function(src){
    this.spriteset = new Image();
    this.spriteset.src = "assets/sprites/bolt.png";
    this.spriteset.addEventListener("load",barcode.Monster.loaded);
  },

  hit: function(hp){
    this.hitpoint -= hp;
  },

  render : function(ctx){
    ctx.drawImage(
       this.spriteset,
       this.animation*this.size,
       this.direction*this.size,
       this.size,
       this.size,
       this.x+barcode.GameEngine.centerX - barcode.GameDonjon.level.character.x,
       this.y+barcode.GameEngine.centerY - barcode.GameDonjon.level.character.y,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);
  },

  doAction : function(){
    if (typeof this.target !== "undefined")
    {
      let distance = calcDistance({x:this.target.x*barcode.GameEngine.tileSize,y:this.target.y*barcode.GameEngine.tileSize},{x : this.x, y : this.y});
      if (distance > this.range*(barcode.GameEngine.tileSize)){
        this.move();
      }else{
        this.attack();
      }
    }
  },

  attack : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.lastAttack > this.attackSpeed){
      this.lastAttack = newTick;
      barcode.GameDonjon.level.character.hit(this.damage);
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
    let tx = Math.round(this.x/barcode.GameEngine.tileSize);
    let ty = Math.round(this.y/barcode.GameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  createPathTo : function(tileTarget){
    this.target = tileTarget;
    if ((this.path.length == 0) || ( this.path[0].x != tileTarget.x && this.path[0].y != tileTarget.y)){
      let grid = barcode.GameDonjon.level.aPathArray();
      let tileMob = this.getTile();

      var pthFinding = new barcode.Apath();
      var result =  pthFinding.findShortestPath([tileMob.x,tileMob.y],[tileTarget.x,tileTarget.y], grid);
      this.path = pthFinding.path;
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
