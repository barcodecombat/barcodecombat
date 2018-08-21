'use strict';
var barcode = barcode || {};

barcode.Item = function(){
  this.typeItem = 0;
  this.rarity = 0;
};


barcode.Item.prototype = {
  load : function(templateId){
    this.typeItem = 0;
  },
};
