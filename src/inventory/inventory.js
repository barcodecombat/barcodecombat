'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
  this.ctx = null;
  this.items = [];
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

  renderBody : function(){
    let spriteset = barcode.tileset.get("assets/inventory/silhouette.png");
    var ctx = barcode.canvas.canvasAnimation.getContext("2d");
    ctx.drawImage(
       spriteset,
       0,
       0,
       624,
       1200,
       150,
       50,
       150,
       300);
  },

  renderBoxOnBody : function(){
    this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
    // main gauche
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.rect(160,200,32,32);
    this.ctx.stroke();  
    // main droite
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.rect(260,200,32,32);
    this.ctx.stroke();  
    // cou
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.rect(210,90,32,32);
    this.ctx.stroke(); 
    //potions
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.rect(150,350,32,32);
    this.ctx.stroke(); 
    this.ctx.beginPath();
    this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
    this.ctx.rect(190,350,32,32);
    this.ctx.stroke(); 
  },

  renderItemInInventory : function(){
    for (let i=0 ; i < barcode.gameEngine.character.inventory.length ; i++){
      let item = barcode.gameEngine.character.inventory[i];
      item.render(100+i*32,400);
      let itemJs = {};
      itemJs = {
        "x" : 100 + i*32,
        "y" : 400,
        "item" : item
      };
      this.items.push(itemJs);
    }
  },

  renderItemWeared : function(){
    var _this = this;
    barcode.gameEngine.character.items.forEach(function(item){
      let itemJs = {};
      if (item.typeItem === barcode.C.TYPE_ITEM_WEAPON){
        item.render(260,200);
        itemJs = {
          "x" : 260 ,
          "y" : 200,
          "item" : item
        };
        _this.items.push(itemJs);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_SHIELD){
        item.render(160,200);
        itemJs = {
          "x" : 160 ,
          "y" : 200,
          "item" : item
        };
        _this.items.push(itemJs);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_JEWEL){
        item.render(210,90);
        itemJs = {
          "x" : 210 ,
          "y" : 90,
          "item" : item
        };
        _this.items.push(itemJs);
      }
    });
  },

  clickEvent : function(evt){
    let clicked = false;
    for (let i=0; i < this.items.length; i++){
      let item = this.items[i];
      if (evt.pageX >= (item.x) && evt.pageX <=(item.x + 32)
        && evt.pageY >= (item.y) && evt.pageY <= (item.y+32)){
          barcode.contextualItem.showMenu();
          barcode.contextualItem.item = item;
          clicked = true;
        }        
    }

    clicked = clicked || barcode.contextualItem.clickEvent(evt);
    if (!clicked){
      barcode.contextualItem.hideMenu();
    }

  },


  render : function(){
    this.items = [];
    this.renderEmptyBag();
    this.renderBody();
    this.renderBoxOnBody();
    this.renderItemInInventory();
    this.renderItemWeared();
    barcode.contextualItem.render();
  },

};
