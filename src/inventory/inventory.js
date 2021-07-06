'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
  this.ctx = null;
};

barcode.Inventory.prototype ={
  init : function(){
  },

  renderEmptyBag : function(){
    for (let i=0;i<10;i++){
      for (let j=0;j<6;j++){
        this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
        this.ctx.fillStyle = barcode.C.COLOR_CONTEXTUAL;
        this.ctx.fillRect(100+i*32,400+j*32,32,32);
        this.ctx.beginPath();
        this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
        this.ctx.rect(100+i*32,400+j*32,32,32);
        this.ctx.stroke();
      }
    }
  },


  render : function(){
    this.renderEmptyBag();
    var _this = this;
    var j = 0;
    for (let i=0 ; i < barcode.gameEngine.character.inventory.length ; i++){
      let item = barcode.gameEngine.character.inventory[i];
      item.render(100+i*32,400);
    }
  },

};
