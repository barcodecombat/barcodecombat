'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
  this.ctx = null;
  this.items = [];
  this.bodyItems =  {
    "leftHand" : {"x" : 160, "y" : 200 },
    "rightHand" : {"x" : 260, "y" : 200 },
    "neck" : {"x" : 210, "y" : 90 },
    "potions1" : {"x" : 150, "y" : 350 },
    "potions2" : {"x" : 190, "y" : 350 },
    "gant" : {"x" : 190, "y" : 350 },
    "botte" : {"x" : 190, "y" : 350 },
    "armure" : {"x" : 190, "y" : 350 },
  };
  this.bodyItems2 =  [
    {"typeItem" : barcode.C.TYPE_ITEM_SHIELD, "position" : {"x" : 160, "y" : 200 }},
    {"typeItem" : barcode.C.TYPE_ITEM_WEAPON, "position" : {"x" : 260, "y" : 200 }},
    {"typeItem" : barcode.C.TYPE_ITEM_JEWEL, "position" : {"x" : 210, "y" : 90 }},
    {"typeItem" : barcode.C.TYPE_ITEM_POTION, "position" : {"x" : 150, "y" : 350 }},
    {"typeItem" : barcode.C.TYPE_ITEM_POTION, "position" : {"x" : 190, "y" : 350 }},
    {"typeItem" : barcode.C.TYPE_ITEM_WEAPON, "position" : {"x" : 210, "y" : 300 }},
    {"typeItem" : barcode.C.TYPE_ITEM_WEAPON, "position" : {"x" : 210, "y" : 150 }},
    {"typeItem" : barcode.C.TYPE_ITEM_WEAPON, "position" : {"x" : 120, "y" : 200 }},
    {"typeItem" : barcode.C.TYPE_ITEM_WEAPON, "position" : {"x" : 210, "y" : 40 }},
  ];
     

};

barcode.Inventory.prototype ={
  init : function(){
  },

  renderEmptyBag : function(){
    for (let i=0;i<10;i++){
      for (let j=0;j<6;j++){
        this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
        this.ctx.fillStyle = barcode.C.COLOR_CONTEXTUAL;
        this.ctx.fillRect(100+i*barcode.gameEngine.tileSize,400+j*barcode.gameEngine.tileSize,barcode.gameEngine.tileSize,barcode.gameEngine.tileSize);
        this.ctx.beginPath();
        this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
        this.ctx.rect(100+i*barcode.gameEngine.tileSize,400+j*barcode.gameEngine.tileSize,barcode.gameEngine.tileSize,barcode.gameEngine.tileSize);
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
    var _this = this;
    this.bodyItems2.forEach(function(box){
      _this.ctx.beginPath();
      _this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
      _this.ctx.rect(box.position.x,box.position.y,barcode.gameEngine.tileSize,barcode.gameEngine.tileSize);
      _this.ctx.stroke();  
    });
  },


  renderItemInInventory : function(){
    for (let i=0 ; i < barcode.gameEngine.character.inventory.length ; i++){
      let item = barcode.gameEngine.character.inventory[i];
      item.render(100+i*barcode.gameEngine.tileSize,400);
      let itemJs = {};
      itemJs = {
        "x" : 100 + i*barcode.gameEngine.tileSize,
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
        item.render(_this.bodyItems.rightHand.x,_this.bodyItems.rightHand.y);
        itemJs = {
          "x" : _this.bodyItems.rightHand.x ,
          "y" : _this.bodyItems.rightHand.y,
          "item" : item
        };
        _this.items.push(itemJs);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_SHIELD){
        item.render(_this.bodyItems.leftHand.x,_this.bodyItems.leftHand.y);
        itemJs = {
          "x" : _this.bodyItems.leftHand.x ,
          "y" : _this.bodyItems.leftHand.y,
          "item" : item
        };
        _this.items.push(itemJs);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_JEWEL){
        item.render(_this.bodyItems.neck.x,_this.bodyItems.neck.y);
        itemJs = {
          "x" : _this.bodyItems.neck.x ,
          "y" : _this.bodyItems.neck.y,
          "item" : item
        };
        _this.items.push(itemJs);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_POTION){
        item.render(_this.bodyItems.potions1.x,_this.bodyItems.potions1.y);
        itemJs = {
          "x" : _this.bodyItems.potions1.x ,
          "y" : _this.bodyItems.potions1.y,
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
      if (evt.pageX >= (item.x) && evt.pageX <=(item.x + barcode.gameEngine.tileSize)
        && evt.pageY >= (item.y) && evt.pageY <= (item.y+barcode.gameEngine.tileSize)){
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
