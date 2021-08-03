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

  drawSprite : function(){
    this.ctx.drawImage(
        barcode.gameEngine.character.spriteset,
        0,0,
        barcode.gameEngine.character.size,
        barcode.gameEngine.character.size,
        400,
        50,
        barcode.gameEngine.tileSize *2 ,
        barcode.gameEngine.tileSize *2);
  },

  drawCaract : function(){
    this.ctx.fillStyle = barcode.C.COLOR_TURQUOISE;
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

    text = "Chance de toucher : " + barcode.gameEngine.character.chanceToHit + " %";
    this.ctx.fillText(text ,
        this.x, 
        this.y + this.propertiesY);

    this.propertiesY += this.stepY;

    text = "Chance de bloquer : " + barcode.gameEngine.character.chanceToBlock + " %";
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

  drawAttackEffect : function(){
    for (let i = 0 ; i < barcode.gameEngine.character.attackEffects.length ; i++){
      let effect = barcode.gameEngine.character.attackEffects[i];
      let text = "";
      if (effect.typeproperty === barcode.C.PROPERTY_ITEM_FREEZE){
        text = "Chance de glacer : " + effect.value + " %";
      }else if (effect.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_ELEMENT_POISON){
        text = "Chance de poison : " + effect.value + " %";
      }
      this.ctx.fillText(text ,
          this.x, 
          this.y + this.propertiesY);

      this.propertiesY += this.stepY;
    }
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

  render : function(){
    this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
    this.propertiesY = 0;
    this.ctx.font = "15px Arial";
    this.drawRect();
    this.drawCaract();
    this.drawAttackEffect();
    this.drawSprite();
  },
};