'use strict';
var barcode = barcode || {};

barcode.itemgenerator = function(){
  this.item = null;
};


barcode.itemgenerator.prototype = {
  rarityCheck : function(){
    let val = Math.random()*100;
    if (val>95){
      return 3;
    }else if (val > 80){
      return 2;
    }else if (val > 50){
      return 1;
    }else return 0;
  },

  typeCheck : function(){
    let val = Math.random()*100;
    if (val>50){
      return 0;
    }else return 1;
  },

  generateCaractWeapon : function(){

  },

  generateCaractArmor : function(){

  },

  generateCaract : function(){

  },

  generate : function(id){
    this.item = new Item();
    newItem.rarity = this.rarityCheck();
    newItem.typeItem = this.typeCheck();
    this.generateCaract();

    return this.item;
  },
};
