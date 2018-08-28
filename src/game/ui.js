'use strict';
var barcode = barcode || {};

barcode.UI = function(){
  this.ctx = undefined;
};

barcode.UI.prototype = {
  init : function(){

  },

  drawRect : function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = "#8b7e66";
    this.ctx.fillRect(0,window.innerHeight-100,window.innerWidth,100);
  },

  renderLifeGauge : function(){
    var prctLife = Math.floor((barcode.GameDonjon.level.character.hitpoint/barcode.GameDonjon.level.character.maxHitPoint)*100);
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(50,window.innerHeight-70,prctLife,10);
    this.ctx.beginPath();
    this.ctx.lineWidth="3";
    this.ctx.strokeStyle = "black";
    this.ctx.rect(49,window.innerHeight-71,102,12);
    this.ctx.stroke();
  },

  render : function(){
    if (typeof this.ctx === 'undefined')
      this.ctx  = barcode.GameDonjon.canvasAnimation.getContext("2d");
    this.drawRect();
    this.renderLifeGauge();
  }
};
