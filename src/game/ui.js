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
    this.ctx.fillStyle = barcode.C.FT_COLOR_BROWN;
    this.ctx.fillRect(0,window.innerHeight-100,window.innerWidth,100);
  },

  drawMonsterGauge : function(){
    if (typeof this.mob !== 'undefined'){
      var prctLife = Math.floor((this.mob.hitpoint/this.mob.maxHitPoint)*100);
      if (prctLife < 0) prctLife = 0;
      this.ctx.beginPath();
      this.ctx.fillStyle = barcode.C.FT_COLOR_BROWN;
      this.ctx.fillRect(barcode.GameEngine.centerX - 80,20,250,30);
      this.ctx.beginPath();
      this.ctx.fillStyle = barcode.C.FT_COLOR_RED;
      this.ctx.fillRect(barcode.GameEngine.centerX - 25,30,prctLife,10);
      this.ctx.beginPath();
      this.ctx.lineWidth="3";
      this.ctx.strokeStyle = barcode.C.FT_COLOR_BLACK;
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

  renderXp : function(){
    var prctxp = Math.floor((barcode.GameEngine.character.actualXp/barcode.GameEngine.character.nextLevelAmountOfXp)*100);
    if (prctxp < 0) prctxp = 0;
    let textLvl = "Level : " + barcode.GameEngine.character.level;
    this.ctx.fillText(textLvl , 230, window.innerHeight-60);
    this.ctx.beginPath();
    this.ctx.fillStyle = barcode.C.FT_COLOR_YELLOW_COLD;
    this.ctx.fillRect(280,window.innerHeight-70,prctxp,10);
    this.ctx.beginPath();
    this.ctx.lineWidth="3";
    this.ctx.strokeStyle = barcode.C.FT_COLOR_BLACK;
    this.ctx.rect(279,window.innerHeight-71,102,12);
    this.ctx.stroke();

    this.ctx.font = "1Opx Arial";
    this.ctx.fillStyle = barcode.C.FT_COLOR_WITE;
    let text = barcode.GameEngine.character.actualXp + " / " + barcode.GameEngine.character.nextLevelAmountOfXp + " xp";
    this.ctx.fillText(text , 390, window.innerHeight-60);
  },

  renderLifeGauge : function(){
    var prctLife = Math.floor((barcode.GameEngine.character.hitpoint/barcode.GameEngine.character.maxHitPoint)*100);
    if (prctLife < 0) prctLife = 0;
    this.ctx.beginPath();
    this.ctx.fillStyle = barcode.C.FT_COLOR_RED;
    this.ctx.fillRect(50,window.innerHeight-70,prctLife,10);
    this.ctx.beginPath();
    this.ctx.lineWidth="3";
    this.ctx.strokeStyle = barcode.C.FT_COLOR_BLACK;
    this.ctx.rect(49,window.innerHeight-71,102,12);
    this.ctx.stroke();

    this.ctx.font = "1Opx Arial";
    this.ctx.fillStyle = barcode.C.FT_COLOR_WHITE;
    let text = barcode.GameEngine.character.hitpoint + " / " + barcode.GameEngine.character.maxHitPoint + " hp";
    this.ctx.fillText(text , 160, window.innerHeight-60);

    this.ctx.drawImage(
       barcode.GameEngine.character.spriteset,
       0,
       0,
       barcode.GameEngine.character.size,
       barcode.GameEngine.character.size,
       10,
       window.innerHeight-80,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);
  },

  render : function(){
    if (typeof this.ctx === 'undefined')
      this.ctx  = barcode.canvas.canvasAnimation.getContext("2d");
    this.drawRect();
    this.renderLifeGauge();
    this.renderXp();
    this.drawMonsterGauge();
  }
};
