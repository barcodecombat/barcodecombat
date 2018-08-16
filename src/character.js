'use strict';
var barcode = barcode || {};

barcode.Character = function(){
  this.x = 32 ;
  this.y = 32;
  this.size = 64;
  this.spriteset = null;
  this.animation = 0;
  this.direction = 0;
  this.moving = false;
  this.loaded = false;
  this.movingTick = 0;
  this.path = [];
  this.step = 3;
  this.hitpoint = 1;
};


barcode.Character.prototype = {
  loaded : function(){
    this.loaded = true;
  },

  getTile : function(){
    let tx = Math.round(this.x/barcode.GameEngine.tileSize);
    let ty = Math.round(this.y/barcode.GameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  init : function(src){
    this.spriteset = new Image();
    this.spriteset.src = "assets/sprites/fille.png";
    this.spriteset.addEventListener("load",barcode.Character.loaded);
  },

  doDamage : function(hp){
    this.hitpoint -= hp;
    console.log(this.hitpoint);
  },

  animate : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.movingTick > 50){
      this.movingTick = newTick;
      this.animation += 1;
      if (this.animation > 2) this.animation = 0;
    }
  },

  move : function(){
    if (this.path.length > 0){
      this.animate();
      var nextTile = this.path[this.path.length-1];
      var currentTile = this.getTile();
      let dist = calcDistance(this, {x: nextTile.x*barcode.GameEngine.tileSize, y: nextTile.y*barcode.GameEngine.tileSize});
      //if (nextTile.x != currentTile.x || nextTile.y != currentTile.y){
      if (dist >10 ){
        var dx = nextTile.x*barcode.GameEngine.tileSize - this.x;
        var dy = nextTile.y*barcode.GameEngine.tileSize - this.y;
        if (Math.abs(dx) > this.step){
          if (dx > 0){
            this.x += this.step;
            this.direction = barcode.C.DIRECTION_RIGHT;
          }else {
            this.x -= this.step;
            this.direction = barcode.C.DIRECTION_LEFT;
          }
        }
        if (Math.abs(dy) > this.step){
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

  render : function(ctx){
    ctx.drawImage(
       this.spriteset,
       this.animation*this.size,
       this.direction*this.size,
       this.size,
       this.size,
       barcode.GameEngine.centerX,
       barcode.GameEngine.centerY,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);

  }
};
