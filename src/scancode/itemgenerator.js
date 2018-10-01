'use strict';
var barcode = barcode || {};

barcode.itemgenerator = function(){
  this.item = null;
};


barcode.itemgenerator.prototype = {
  rarityCheck : function(){
    let rarity = barcode.C.RARITY_COMMON;
/*
    let maxRarity = 0;
    if (barcode.GameEngine.character.level > 30){
      maxRarity = 3;
    }else if (barcode.GameEngine.character.level > 20){
      maxRarity = 2;
    }else if (barcode.GameEngine.character.level > 10){
      maxRarity = 1;
    }
    let rarity = Math.round(Math.random()*maxRarity);*/
    let prb3 = barcode.C.RARITY_LEGEND_MALUS + barcode.C.RARITY_STEP * barcode.GameEngine.character.level;
    let prb2 = barcode.C.RARITY_RARE_MALUS + barcode.C.RARITY_STEP * barcode.GameEngine.character.level;
    let prb1 = barcode.C.RARITY_UNCOMMON_MALUS + barcode.C.RARITY_STEP * barcode.GameEngine.character.level;
    let dice = 0;
    if (prb3 >0){
      dice = Math.random() * 100;
      if (dice < prb3) rarity = barcode.C.RARITY_LEGEND;
    }
    if(rarity == barcode.C.RARITY_COMMON && prb2 > 0){
      dice = Math.random() * 100;
      if (dice < prb3) rarity = barcode.C.RARITY_RARE;
    }
    if(rarity == barcode.C.RARITY_COMMON && prb1 > 0){
      dice = Math.random() * 100;
      if (dice < prb3) rarity = barcode.C.RARITY_UNCOMMON;
    }
    return rarity;
  },

  qualityCheck : function(){
    let quality = Math.round(Math.random()*100);
    return quality;
  },

  typeCheck : function(){
    let typeItem = Math.round(Math.random()*2);
    return typeItem;
  },

  generateCaractWeapon : function(){
    this.item.damage[0] = Math.round(Math.random()*10 * this.item.quality /100);
    this.item.damage[1] = Math.round(Math.random()*30 * this.item.quality /100 + this.item.damage[0]);
    this.item.range = 32;
    this.item.speed = Math.round(Math.random() * this.item.quality);
    this.item.idimg = this.getImageForItem("" + this.item.typeItem + "-1-" + this.item.rarity);
    this.item.name = barcode.itemsimg[this.item.idimg].name;
  },

  getImageForItem : function(val){
    var result = 0;
    if (val in barcode.itemsinfo){
      var len = barcode.itemsinfo[val].length;
      var rnd = Math.round(Math.random()*(len-1));
      result = barcode.itemsinfo[val][rnd];
    }
    return result;
  },

  generateCaractShield : function(){
    this.item.chanceToBlock = Math.round(Math.random()*50 * this.item.quality / 100);
    this.item.idimg = this.getImageForItem("" + this.item.typeItem + "-1-" + this.item.rarity);
    this.item.name = barcode.itemsimg[this.item.idimg].name;
  },

  generateCaractNecklace : function(){
    this.item.idimg = this.getImageForItem("" + this.item.typeItem + "-1-" + this.item.rarity);
    this.item.name = barcode.itemsimg[this.item.idimg].name;
  },

  generateCaract : function(){
    if (this.item.typeItem === barcode.C.TYPE_ITEM_WEAPON ){
      this.generateCaractWeapon();
    }else if (this.item.typeItem === barcode.C.TYPE_ITEM_SHIELD ){
      this.generateCaractShield();
    }else if (this.item.typeItem === barcode.C.TYPE_ITEM_JEWEL ){
      this.generateCaractNecklace();
    }
  },

  generateProperty(){
    var prop = Math.round(Math.random()*5);
    var value = 0;
    if (prop === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
      value = Math.round(Math.random() * 10 * this.item.quality / 100 + 1);
    }else if (prop === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
      value = Math.round(Math.random() * 100 * this.item.quality / 100 + 5);
    }else if (prop === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
      value = Math.round(Math.random() * 10 * this.item.quality / 100 + 1);
    }else if (prop === barcode.C.PROPERTY_ITEM_LIFE_REGENERATION){
      value = Math.round(Math.random() * 10 * this.item.quality / 100 + 1);
    }else if (prop === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
      value = Math.round(Math.random() * 50 * this.item.quality / 100 + 5);
    }else if (prop === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
      value = Math.round(Math.random() * 5 * this.item.quality / 100 + 1);
    }
    var property = { 'typeproperty' : prop, 'value' : value};
    this.item.properties.push(property);
  },

  generateMagicProperties(){
    var nbProperty = this.item.rarity;
    while (nbProperty > 0){
      this.generateProperty();
      nbProperty--;
    }
  },

  generate : function(id){
    this.item = new barcode.Item();
    this.item.rarity = this.rarityCheck();
    this.item.typeItem = this.typeCheck();
    this.item.quality = this.qualityCheck();
    this.item.idimg = 1;
    this.generateCaract();
    this.generateMagicProperties();

    return this.item;
  },
};
