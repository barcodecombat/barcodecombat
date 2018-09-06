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
};

barcode.Animation.prototype = {

  init : function(){
    this.spriteset = new Image();
    this.spriteset.src = "assets/tileset/blood.png";
    let d = new Date();
    this.startTime = d.getTime();
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
       this.x+barcode.GameEngine.centerX - barcode.GameEngine.character.x,
       this.y+barcode.GameEngine.centerY - barcode.GameEngine.character.y,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);

  }
};
