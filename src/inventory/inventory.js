'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
};

barcode.Inventory.prototype ={
  init : function(){
  },


  render : function(){
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
