'use strict';
var barcode = barcode || {};

barcode.Donjon = function(){
  this.ctx = undefined;
  this.spriteset = undefined;
  this.nbRoom = 0;
  this.tileset = undefined;
};

barcode.Donjon.prototype = {
  init : function(templateId){
    let src = barcode.donjons[templateId];
    this.spriteset = barcode.tileset.get(src.sprite);
    this.nbRoom = src.nbroommax;
    this.tileset = src.tileset;
  },
}