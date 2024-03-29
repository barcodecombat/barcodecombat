'use strict';
var barcode = barcode || {};

barcode.Animation = function(){
  this.x = 32 ;
  this.y = 32;
  this.tx = 319;
  this.ty = 32;
  this.size = 32;
  this.spriteset = null;
  this.duration = 5000;
  this.startTime = 0;
  this.spriteset = null;
  this.typeAnimation = barcode.C.TYPE_ANIMATION_STATIC;
  this.layerToDraw = undefined;
  this.tilesets = {};
};

barcode.Animation.prototype = {

  init : function(idAnimation,timer = 100){
    var src = barcode.animations[idAnimation];
    if (typeof(src) !== "undefined"){
      this.tx = src.x;
      this.ty = src.y;
      this.size = src.size;
      this.x = 0;
      this.y = 0;
      this.spriteset = barcode.tileset.get(src.tileset);
    }
    this.duration = timer;
    let d = new Date();
    this.startTime = d.getTime();
    this.layerToDraw = barcode.canvas.canvasAnimation.getContext("2d");
  },

  setXY(x,y){
    this.x = x;
    this.y = y;
  },

  setPosRandom(x,y){
    let decalageAnimation = Math.floor(Math.random() * 6)
    this.x = x+(barcode.gameEngine.tileSize/2 -6 + decalageAnimation);
    this.y = y -6 + decalageAnimation;
  },

  isActive : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.startTime > this.duration){
      return false;
    }
    return true;
  },

  render : function(ctx){
    this.layerToDraw.drawImage(
       this.spriteset,
       this.tx,
       this.ty,
       this.size,
       this.size,
       this.x+barcode.gameEngine.centerX - barcode.gameEngine.character.x,
       this.y+barcode.gameEngine.centerY - barcode.gameEngine.character.y,
       barcode.gameEngine.tileSize,
       barcode.gameEngine.tileSize);

  }
};
