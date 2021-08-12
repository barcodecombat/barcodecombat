'use strict';
var barcode = barcode || {};

barcode.DonjonPath = function(){
  this.ctx = undefined;
  this.propertiesY = 0;
  this.y = 50;
  this.x = 80;
  this.stepY = 20;
  this.donjon = null;
};

barcode.DonjonPath.prototype = {
  init : function(){
    this.donjon = new barcode.Donjon();
    this.donjon.init(1);
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
    
    this.ctx.drawImage(
        this.donjon.spriteset,
        100,
        50,
        barcode.gameEngine.tileSize *2 ,
        barcode.gameEngine.tileSize *2);
  },

  clickEvent : function(evt){
    if (evt.pageX > 100 && evt.pageX < (100 + barcode.gameEngine.tileSize*2)
        && evt.pageY > 50 && evt.pageY < (50 + barcode.gameEngine.tileSize*2)){
            barcode.gameEngine.initDonjon();
        }
  },

  render : function(){
    this.ctx = barcode.canvas.canvasTile.getContext("2d");

    this.ctx.font = "15px Arial";
    this.drawRect();
    this.drawDonjon();
  },
};