'use strict';
var barcode = barcode || {};

barcode.DonjonPath = function(){
  this.ctx = undefined;
  this.propertiesY = 0;
  this.y = 50;
  this.x = 80;
  this.stepY = 20;
};

barcode.DonjonPath.prototype = {
  init : function(){

  },

  drawRect : function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.fillRect(50,20,450,600);
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
    this.ctx.rect(50,20,450,600);
    this.ctx.stroke();
  },

  drawDonjon : function(){
    let spriteset = barcode.tileset.get("assets/sprites/castle1.png");
    
    this.ctx.drawImage(
        spriteset,
        100,
        50,
        barcode.gameEngine.tileSize *2 ,
        barcode.gameEngine.tileSize *2);
  },

  render : function(){
    this.ctx = barcode.canvas.canvasTile.getContext("2d");

    this.ctx.font = "15px Arial";
    this.drawRect();
    this.drawDonjon();
  },
};