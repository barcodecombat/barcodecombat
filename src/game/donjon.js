'use strict';
var barcode = barcode || {};

barcode.Donjon = function(){
  this.ctx = undefined;
  this.spriteset = undefined;
};

barcode.Donjon.prototype = {
  init : function(){
    this.spriteset = barcode.tileset.get("assets/sprites/castle1.png");
  },
}