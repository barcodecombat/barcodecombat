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
  this.apply = {};
  this.typeDecor = 0;
};


barcode.Decor.prototype = {
  load : function(templateId){
    this.templateId = templateId;
    var src = barcode.decors[templateId];
    this.spriteset = barcode.tileset.get(src.tileset);
    this.typeDecor = src.typedecor;
    this.blocking = src.blocking;
    this.apply = src.apply;
    var _this = this;

    src.sprites.forEach(function(sp){
      _this.sprites.push({"state" : sp.state, "x" : sp.x, "y" : sp.y});
    })
    this.size = src.size;
  },

  doAction : function(){
    var _this = this;
    if (typeof this.apply!== 'undefined' ) {
      this.apply.forEach(function(action){
        if (action.action === barcode.C.ACTION_APPLY_DECOR_REMOVE_DECOR){
          barcode.gameDonjon.level.removeDecor(_this);
        }else if(action.action === barcode.C.ACTION_APPLY_DECOR_CHANGE_SPRITE){
          _this.state = 1;
        }else if(action.action === barcode.C.ACTION_APPLY_DECOR_END_DONJON){
          barcode.gameEngine.state = barcode.C.STATE_MENU_ENDDONJON_TOSHOW;
        }
      })
    }
  },

  render : function(){
    var ctx = barcode.canvas.canvasTile.getContext("2d");
    ctx.drawImage(
       this.spriteset,
       this.sprites[this.state].x,
       this.sprites[this.state].y,
       this.size,
       this.size,
       this.x*barcode.gameEngine.tileSize+barcode.gameEngine.centerX - barcode.gameEngine.character.x,
       this.y*barcode.gameEngine.tileSize+barcode.gameEngine.centerY - barcode.gameEngine.character.y,
       barcode.gameEngine.tileSize,
       barcode.gameEngine.tileSize);
  },
};
