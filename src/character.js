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
};


barcode.Character.prototype = {
  loaded : function(){
    this.loaded = true;
  },

  getTile : function(){
    let tx = Math.round(this.x/32);
    let ty = Math.round(this.y/32);
    return {"x" : tx, "y" : ty  };
  },

  init : function(src){
    this.spriteset = new Image();
    this.spriteset.src = "assets/sprites/fille.png";
    this.spriteset.addEventListener("load",barcode.Character.loaded);
  },

  animate : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.movingTick > 100){
      this.movingTick = newTick;
      this.animation += 1;
      if (this.animation > 2) this.animation = 0;
    }
  },

  move : function(){
    this.animate();
    if (this.path.length > 0){
      var nextTile = this.path[this.path.length-1];
      var currentTile = this.getTile();
      if (nextTile.x != currentTile.x || nextTile.y != currentTile.y){
        var dx = nextTile.x - currentTile.x;
        var dy = nextTile.y - currentTile.y;
        if (dx != 0){
          if (dx > 0){
            this.x += this.step;
          }else{
            this.x -= this.step;
          }
        }
        if (dy != 0){
          if (dy > 0){
            this.y += this.step;
          }else{
            this.y -= this.step;
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
       this.x,
       this.y,
       32,
       32);

  }
};
