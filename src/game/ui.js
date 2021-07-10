'use strict';
var barcode = barcode || {};

barcode.UI = function(){
  this.ctx = undefined;
  this.mob = undefined;

  this.ItemsToOver =  {
    "potions1" : {"x" : 500, "y" : window.innerHeight-90 },
    "potions2" : {"x" : 550, "y" : window.innerHeight-90 },
  } 

  this.potions = [];
};

barcode.UI.prototype = {
  init : function(){

  },

  clickEvent : function(evt){
    if(evt.pageY > window.innerHeight -100){
      for (let i = 0 ; i < this.potions.length ; i++){
        if (evt.pageX > this.potions[i].x && evt.pageX < (this.potions[i].x +32)
        && evt.pageY > this.potions[i].y && evt.pageY < (this.potions[i].y + 32)){
          this.potions[i].potion.use();
        }
      }
      return true;
    }
    return false;
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
      this.ctx.fillRect(barcode.gameEngine.centerX - 80,20,250,30);
      this.ctx.beginPath();
      this.ctx.fillStyle = barcode.C.FT_COLOR_RED;
      this.ctx.fillRect(barcode.gameEngine.centerX - 25,30,prctLife,10);
      this.ctx.beginPath();
      this.ctx.lineWidth="3";
      this.ctx.strokeStyle = barcode.C.FT_COLOR_BLACK;
      this.ctx.rect(barcode.gameEngine.centerX - 24,29,102,12);
      this.ctx.stroke();
      this.ctx.font = "1Opx Arial";
      this.ctx.fillStyle = "white ";
      let text = this.mob.hitpoint + " / " + this.mob.maxHitPoint + " hp";
      this.ctx.fillText(text , barcode.gameEngine.centerX + 90, 38);
      this.ctx.drawImage(
         this.mob.spriteset,
         0,
         0,
         this.mob.size,
         this.mob.size,
         barcode.gameEngine.centerX - 70,
         22,
         barcode.gameEngine.tileSize,
         barcode.gameEngine.tileSize);
    }
  },

  showMonsterGauge : function(mob){
    this.mob = mob;
  },

  hideMonsterGauge :  function(){
    this.mob = undefined;
  },

  renderXp : function(){
    var prctxp = Math.floor((barcode.gameEngine.character.actualXp/barcode.gameEngine.character.nextLevelAmountOfXp)*100);
    if (prctxp < 0) prctxp = 0;
    let textLvl = "Level : " + barcode.gameEngine.character.level;
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
    let text = barcode.gameEngine.character.actualXp + " / " + barcode.gameEngine.character.nextLevelAmountOfXp + " xp";
    this.ctx.fillText(text , 390, window.innerHeight-60);
  },

  renderLifeGauge : function(){
    var prctLife = Math.floor((barcode.gameEngine.character.hitpoint/barcode.gameEngine.character.maxHitPoint)*100);
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
    let text = barcode.gameEngine.character.hitpoint + " / " + barcode.gameEngine.character.maxHitPoint + " hp";
    this.ctx.fillText(text , 160, window.innerHeight-60);

    this.ctx.drawImage(
       barcode.gameEngine.character.spriteset,
       0,
       0,
       barcode.gameEngine.character.size,
       barcode.gameEngine.character.size,
       10,
       window.innerHeight-80,
       barcode.gameEngine.tileSize,
       barcode.gameEngine.tileSize);
  },

  renderPotionWeared : function(){
    this.potions = [];
    for (let i=0; i < barcode.gameEngine.character.items.length ; i++){
      if (barcode.gameEngine.character.items[i].typeItem === barcode.C.TYPE_ITEM_POTION){
        barcode.gameEngine.character.items[i].render(this.ItemsToOver.potions1.x,this.ItemsToOver.potions1.y);
        let potionJs = {
          "potion" : barcode.gameEngine.character.items[i],
          "x" : this.ItemsToOver.potions1.x,
          "y": this.ItemsToOver.potions1.y
        }
        this.potions.push(potionJs);
      }
    }
  },

  renderPotionBelt : function(){
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
    this.ctx.rect(this.ItemsToOver.potions1.x,this.ItemsToOver.potions1.y,barcode.gameEngine.tileSize,barcode.gameEngine.tileSize);
    this.ctx.stroke(); 
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
    this.ctx.rect(this.ItemsToOver.potions2.x,this.ItemsToOver.potions2.y,barcode.gameEngine.tileSize,barcode.gameEngine.tileSize);
    this.ctx.stroke(); 
  },

  render : function(){
    if (typeof this.ctx === 'undefined')
      this.ctx  = barcode.canvas.canvasAnimation.getContext("2d");
    this.drawRect();
    this.renderLifeGauge();
    this.renderXp();
    this.drawMonsterGauge();
    this.renderPotionBelt();
    this.renderPotionWeared();
  }
};
