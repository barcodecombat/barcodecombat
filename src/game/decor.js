'use strict';
var barcode = barcode || {};

barcode.Decor = function(){
  this.x = 0;
  this.y = 0;
  this.sprites = [];
  this.templateId = 0;
  this.tileset = undefined;
  this.size = 32;
  this.state = 0;
};


barcode.Decor.prototype = {
  load : function(templateId){
    this.templateId = templateId;
    var src = barcode.decors[templateId];
    this.spriteset = barcode.tileset.get(src.tileset);
    var _this = this;

    src.sprites.forEach(function(sp){
      _this.sprites.push({"state" : sp.state, "x" : sp.x, "y" : sp.y});
    })
    this.size = src.size;
  },

  render : function(){
    var ctx = barcode.GameDonjon.canvasTile.getContext("2d");
    ctx.drawImage(
       this.spriteset,
       this.sprites[this.state].x,
       this.sprites[this.state].y,
       this.size,
       this.size,
       this.x*barcode.GameEngine.tileSize+barcode.GameEngine.centerX - barcode.GameEngine.character.x,
       this.y*barcode.GameEngine.tileSize+barcode.GameEngine.centerY - barcode.GameEngine.character.y,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);
  },
};
