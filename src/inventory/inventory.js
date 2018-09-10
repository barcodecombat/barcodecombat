'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
};

barcode.Inventory.prototype ={
  init : function(){

  },

  loop : function(){
    this.render();
  },

  renderItem : function(item, ){

  },

  render : function(){
    barcode.canvas.clearCanvas();
    var _this = this;
    var j = 0;
    var ctx = barcode.canvas.canvasTile.getContext("2d");
    for (let i=0 ; i < barcode.GameEngine.character.items.length ; i++){
      let item = barcode.GameEngine.character.items[i];
      ctx.beginPath();
      ctx.lineWidth="3";
      ctx.strokeStyle = "black";
      ctx.rect(30 + i*70, 100 + j*70,64,64);
      ctx.stroke();
      
      ctx.drawImage(
         item.spriteset,
         item.tx,
         item.ty,
         item.spritesize,
         item.spritesize,
         44 + i*70,
         114 + j*70,
         item.spritesize,
         item.spritesize);
    }
    barcode.GameEngine.character.items.forEach(function(it){
        _this.renderItem(it);
    })
  },
};
