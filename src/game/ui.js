'use strict';
var barcode = barcode || {};

barcode.UI = function(){
  this.ctx = undefined;
  this.mob = undefined;
};

barcode.UI.prototype = {
  init : function(){

  },

  drawRect : function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = "#8b7e66";
    this.ctx.fillRect(0,window.innerHeight-100,window.innerWidth,100);
  },

  drawMonsterGauge : function(){
    if (typeof this.mob !== 'undefined'){
      var prctLife = Math.floor((this.mob.hitpoint/this.mob.maxHitPoint)*100);
      if (prctLife < 0) prctLife = 0;
      this.ctx.beginPath();
      this.ctx.fillStyle = "#8b7e66";
      this.ctx.fillRect(barcode.GameEngine.centerX - 80,20,250,30);
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(barcode.GameEngine.centerX - 25,30,prctLife,10);
      this.ctx.beginPath();
      this.ctx.lineWidth="3";
      this.ctx.strokeStyle = "black";
      this.ctx.rect(barcode.GameEngine.centerX - 24,29,102,12);
      this.ctx.stroke();
      this.ctx.font = "1Opx Arial";
      this.ctx.fillStyle = "white ";
      let text = this.mob.hitpoint + " / " + this.mob.maxHitPoint + " hp";
      this.ctx.fillText(text , barcode.GameEngine.centerX + 90, 38);
      this.ctx.drawImage(
         this.mob.spriteset,
         0,
         0,
         this.mob.size,
         this.mob.size,
         barcode.GameEngine.centerX - 70,
         22,
         barcode.GameEngine.tileSize,
         barcode.GameEngine.tileSize);
    }
  },

  showMonsterGauge : function(mob){
    this.mob = mob;
  },

  hideMonsterGauge :  function(){
    this.mob = undefined;
  },

  renderLifeGauge : function(){
    var prctLife = Math.floor((barcode.GameDonjon.level.character.hitpoint/barcode.GameDonjon.level.character.maxHitPoint)*100);
    if (prctLife < 0) prctLife = 0;
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(50,window.innerHeight-70,prctLife,10);
    this.ctx.beginPath();
    this.ctx.lineWidth="3";
    this.ctx.strokeStyle = "black";
    this.ctx.rect(49,window.innerHeight-71,102,12);
    this.ctx.stroke();

    this.ctx.font = "1Opx Arial";
    this.ctx.fillStyle = "white ";
    let text = barcode.GameDonjon.level.character.hitpoint + " / " + barcode.GameDonjon.level.character.maxHitPoint + " hp";
    this.ctx.fillText(text , 160, window.innerHeight-60);

    this.ctx.drawImage(
       barcode.GameDonjon.level.character.spriteset,
       0,
       0,
       barcode.GameDonjon.level.character.size,
       barcode.GameDonjon.level.character.size,
       10,
       window.innerHeight-80,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);
  },

  render : function(){
    if (typeof this.ctx === 'undefined')
      this.ctx  = barcode.GameDonjon.canvasAnimation.getContext("2d");
    this.drawRect();
    this.renderLifeGauge();
    this.drawMonsterGauge();
  }
};
