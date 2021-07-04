'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
  this.ctx = null;
};

barcode.Inventory.prototype ={
  init : function(){
  },

  renderEmptyBag : function(){
    this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
    this.ctx.fillStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.fillRect(100,100,32,32);
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
    this.ctx.rect(100,100,32,32);
    this.ctx.stroke();
    console.log(this.ctx);
  },


  render : function(){

    this.renderEmptyBag();
    var _this = this;
    var j = 0;
    let div = document.getElementById("itemininventory");
    for (let i=0 ; i < barcode.gameEngine.character.inventory.length ; i++){
      let item = barcode.gameEngine.character.inventory[i];
      barcode.RenderItem.render(div,item,30 + i*70, 100 + j*70);
     }
    j = 0;
    div = document.getElementById("heroItem");
    for (let i=0 ; i < barcode.gameEngine.character.items.length ; i++){
      let item = barcode.gameEngine.character.items[i];
      barcode.RenderItem.render(div,item,30 + i*70,  j*70);
    }
  },

  eraseInventory : function(){
    let div = document.getElementById("itemininventory");
    div.innerHTML = "";
    div = document.getElementById("heroItem");
    div.innerHTML = "";
  }
};
