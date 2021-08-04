'use strict';
var barcode = barcode || {};

barcode.Donjon = function(){
  this.ctx = undefined;
  this.spriteset = undefined;
};

barcode.Donjon.prototype = {
  init : function(templateId){
    let src = barcode.donjons[templateId];
    this.spriteset = barcode.tileset.get(src.sprite);
  },
}