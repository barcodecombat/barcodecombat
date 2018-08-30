'use strict';
var barcode = barcode || {};

barcode.Item = function(){
  this.typeItem = 0;
  this.rarity = 0;
  this.spriteset = undefined;
};


barcode.Item.prototype = {
  load : function(templateId){
    this.spriteset = barcode.tileset.get("assets/items/items.png");
    this.typeItem = 0;
  },
};
