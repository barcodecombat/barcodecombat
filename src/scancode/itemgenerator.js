'use strict';
var barcode = barcode || {};

barcode.itemgenerator = function(){
  this.item = null;
};


barcode.itemgenerator.prototype = {
  rarityCheck : function(){
    let rarity = Math.round(Math.random()*3);
    return rarity;
  },

  typeCheck : function(){
    let typeItem = Math.round(Math.random()*3);
    return typeItem;
  },

  generateCaractWeapon : function(){
    this.item.damage = [1,5];
    this.item.range = 32;
    this.item.speed = 50;
    this.item.idimg = "1";
  },

  generateCaractShield : function(){
    this.item.chanceToBlock = 50;
    this.item.idimg = "2";
  },

  generateCaractNecklace : function(){
    this.item.idimg = "3";
  },

  generateCaract : function(){
    if (this.item.typeItem === barcode.C.TYPE_ITEM_WEAPON ){
      this.generateCaractWeapon();
    }else if (this.item.typeItem === barcode.C.TYPE_ITEM_SHIELD ){
      this.generateCaractShield();
    }else if (this.item.typeItem === barcode.C.TYPE_ITEM_NECKLACE ){
      this.generateCaractNecklace();
    }
  },

  generateProperty(){
    var prop = Math.round(Math.random()*5);
    var property = { 'typeproperty' : 1, 'value' : 50};
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
    this.generateCaract();
    this.generateMagicProperties();
    return this.item;
  },
};
