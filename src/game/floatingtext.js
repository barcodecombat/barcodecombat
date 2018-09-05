'use strict';
var barcode = barcode || {};

barcode.FloatingText = function(){
  this.x = 32 ;
  this.y = 32;
  this.text = "";
  this.color = barcode.C.FT_COLOR_RED;
  this.duration = 500;
  this.startTime = 0;
};

barcode.FloatingText.prototype = {

  init : function(x,y,text,color){
    let d = new Date();
    this.startTime = d.getTime();
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
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
    var ctx = barcode.GameDonjon.canvasAnimation.getContext("2d");
    ctx.font = "1Opx Arial";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x+barcode.GameEngine.centerX - barcode.GameDonjon.level.character.x, this.y+barcode.GameEngine.centerY - barcode.GameDonjon.level.character.y);
    this.y -= 1;
  }
};
