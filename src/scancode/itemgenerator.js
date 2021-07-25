'use strict';
var barcode = barcode || {};

barcode.itemgenerator = function(){
  this.item = null;
  this.ticket = null;
};


barcode.itemgenerator.prototype = {
  rarityCheck : function(){
    let rarity = barcode.C.RARITY_COMMON;
    let prb3 = barcode.C.RARITY_LEGEND_MALUS + barcode.C.RARITY_STEP * barcode.gameEngine.character.level + this.ticket.legend;
    let prb2 = barcode.C.RARITY_RARE_MALUS + barcode.C.RARITY_STEP * barcode.gameEngine.character.level + this.ticket.rare;
    //let prb1 = barcode.C.RARITY_UNCOMMON_MALUS + barcode.C.RARITY_STEP * barcode.gameEngine.character.level + this.ticket.uncommon;
    let prb1 = 50;
    let dice = 0;
    if (prb3 >0){
      dice = Math.random() * 100;
      if (dice < prb3) rarity = barcode.C.RARITY_LEGEND;
    }
    if(rarity == barcode.C.RARITY_COMMON && prb2 > 0){
      dice = Math.random() * 100;
      if (dice < prb2) rarity = barcode.C.RARITY_RARE;
    }
    if(rarity == barcode.C.RARITY_COMMON && prb1 > 0){
      dice = Math.random() * 100;
      if (dice < prb1) rarity = barcode.C.RARITY_UNCOMMON;
    }
    return rarity;
  },

  qualityCheck : function(){
    let quality = Math.round(Math.random()*100);
    return quality;
  },

  typeCheck : function(){
    let typeItem = Math.floor(Math.random()*8);
    return typeItem;
  },

  generateCaractWeapon : function(){
    this.item.damage[0] = Math.round(Math.random()*10 * this.item.quality /100);
    this.item.damage[1] = Math.round(Math.random()*30 * this.item.quality /100 + this.item.damage[0]);
    this.item.range = 32;
    this.item.speed = Math.round(Math.random() * this.item.quality);
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
  },

  generateCaractNecklace : function(){
  },

  generateCaractArmor : function(){
  },

  generateCaractPotion : function(){
    this.item.typePotion = barcode.C.POTION_TYPE_HEALING;
    this.item.value = Math.floor(Math.random()*20);
    this.item.nbcharge = Math.floor(Math.random()*10) + 1;
  },

  generateCaract : function(){
    this.item.idimg = this.getImageForItem("" + this.item.typeItem + "-1-" + this.item.rarity);
    this.item.name = barcode.itemsimg[this.item.idimg].name;
    if (this.item.typeItem === barcode.C.TYPE_ITEM_WEAPON ){
      this.generateCaractWeapon();
    }else if (this.item.typeItem === barcode.C.TYPE_ITEM_SHIELD ){
      this.generateCaractShield();
    }else if (this.item.typeItem === barcode.C.TYPE_ITEM_JEWEL ){
      this.generateCaractNecklace();
    }else if(this.item.typeItem === barcode.C.TYPE_ITEM_POTION){
      this.generateCaractPotion();
    }else if(this.item.typeItem === barcode.C.TYPE_ITEM_ARMOR){
      this.generateCaractArmor();
    }
  },

  generateProperty(){
    var prop = Math.round(Math.random()*8);
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
    }else if (prop === barcode.C.PROPERTY_ITEM_ATTACK_ELEMENT_ICE){
      value = Math.round(Math.random() * 5 * this.item.quality / 100 + 1);
    }else if (prop === barcode.C.PROPERTY_ITEM_CHANCE_TO_HIT){
      value = Math.floor(Math.random() * 10) +1;
    }else if (prop === barcode.C.PROPERTY_ITEM_ARMOR){
      value = Math.floor(Math.random() * 10) +1;
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

  generate : function(){
    this.ticket = barcode.gameEngine.character.tickets[0];
    if (typeof this.ticket === 'undefined') this.ticket = new barcode.Ticket();
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
