'use strict';
var barcode = barcode || {};

barcode.FichePerso = function(){
  this.ctx = undefined;
  this.propertiesY = 0;
  this.y = 50;
  this.x = 80;
  this.stepY = 20;
};

barcode.FichePerso.prototype = {
  init : function(){

  },

  drawCaract : function(){
    this.ctx.fillStyle = barcode.C.INVENTORY_RARITY_UNCOMMON_FONT_COLOR;
    let text = "Max Hp : " + barcode.gameEngine.character.maxHitPoint;
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Armure : " + barcode.gameEngine.character.armor;
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Chance de toucher : " + barcode.gameEngine.character.chanceToHit;
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Chance de bloquer : " + barcode.gameEngine.character.chanceToBlock;
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Vitesse d'attaque : " + barcode.gameEngine.character.speedAttack;
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Portee d'attaque : " + barcode.gameEngine.character.rangeAttack;
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Degat : " + barcode.gameEngine.character.damage[0] + " - " + barcode.gameEngine.character.damage[1];
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;
  },

  drawRect : function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = barcode.C.COLOR_UI_BACKGROUND;
    this.ctx.fillRect(50,20,450,600);
  },

  render : function(){
    this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
    this.propertiesY = 0;
    this.ctx.font = "15px Arial";
    this.drawRect();
    this.drawCaract();
  },
};