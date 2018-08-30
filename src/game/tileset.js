'use strict';
var barcode = barcode || {};

barcode.Tileset = function (){
  this.tilesets = {};
};

barcode.Tileset.prototype = {
  get : function(name){
    if (!(name in this.tilesets)){
      var tileset = new Image();
      tileset.src = name;
      this.tilesets[name] = tileset;
    }
    return this.tilesets[name];
  }
};
