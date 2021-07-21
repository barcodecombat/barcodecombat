'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
  this.ctx = null;
  this.items = [];

  this.bodyItems =  [
    {"typeItem" : barcode.C.TYPE_ITEM_SHIELD, "position" : {"x" : 160, "y" : 200 }},
    {"typeItem" : barcode.C.TYPE_ITEM_WEAPON, "position" : {"x" : 260, "y" : 200 }},
    {"typeItem" : barcode.C.TYPE_ITEM_JEWEL, "position" : {"x" : 210, "y" : 90 }},
    {"typeItem" : barcode.C.TYPE_ITEM_POTION, "position" : {"x" : 150, "y" : 350 }},
    {"typeItem" : barcode.C.TYPE_ITEM_POTION, "position" : {"x" : 190, "y" : 350 }},
    {"typeItem" : barcode.C.TYPE_ITEM_BOOT, "position" : {"x" : 210, "y" : 300 }},
    {"typeItem" : barcode.C.TYPE_ITEM_ARMOR, "position" : {"x" : 210, "y" : 150 }},
    {"typeItem" : barcode.C.TYPE_ITEM_GLOVE, "position" : {"x" : 120, "y" : 200 }},
    {"typeItem" : barcode.C.TYPE_ITEM_HELMET, "position" : {"x" : 210, "y" : 40 }},
  ];
    
};

barcode.Inventory.prototype ={
  init : function(){
  },

  renderEmptyBag : function(){
    for (let i=0;i<10;i++){
      for (let j=0;j<6;j++){
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
    this.bodyItems.forEach(function(box){
      _this.ctx.beginPath();
      _this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
      _this.ctx.rect(box.position.x,box.position.y,barcode.gameEngine.tileSize,barcode.gameEngine.tileSize);
      _this.ctx.stroke();  
    });
  },


  renderItemInInventory : function(){
    let iterVert=0;
    let iterhoriz=0;
    for (let i=0 ; i < barcode.gameEngine.character.inventory.length ; i++){
      let item = barcode.gameEngine.character.inventory[i];
      item.render(100+iterhoriz*barcode.gameEngine.tileSize,400 +barcode.gameEngine.tileSize*iterVert);
      let itemJs = {};
      itemJs = {
        "x" : 100 + iterhoriz*barcode.gameEngine.tileSize,
        "y" : 400 +barcode.gameEngine.tileSize*iterVert,
        "item" : item
      };
      this.items.push(itemJs);
      iterhoriz+=1;
      if (iterhoriz%11 ===10){
        iterVert+=1;
        iterhoriz=0;
      }
    }
  },

  renderItemWeared : function(){
    var _this = this;
    barcode.gameEngine.character.items.forEach(function(item){
      var itemJs = {};
      for (let i=0;i<_this.bodyItems.length;i++){
        let posItem = _this.bodyItems[i];
        if (posItem.typeItem === item.typeItem){
          item.render(posItem.position.x,posItem.position.y);
          itemJs = {
            "x" : posItem.position.x ,
            "y" : posItem.position.y,
            "item" : item
          };
          _this.items.push(itemJs);
          break;
        }
      }
    });
  },

  clickEvent : function(evt){
    let clicked = false;
    //TODO : changer ce parcours pour utiliser le tableau des positions
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

  drawRect : function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = barcode.C.COLOR_UI_BACKGROUND;
    this.ctx.fillRect(50,20,450,600);
  },


  render : function(){
    this.items = [];
    this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
    this.drawRect();
    this.renderEmptyBag();
    this.renderBody();
    this.renderBoxOnBody();
    this.renderItemInInventory();
    this.renderItemWeared();
    barcode.contextualItem.render();
  },

};
