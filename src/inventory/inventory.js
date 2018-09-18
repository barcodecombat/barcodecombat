'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
  this.actualY = 0;
  this.ctxInv = undefined;
  this.ctxItem = undefined;
};

barcode.Inventory.prototype ={
  init : function(){
    barcode.canvas.clearCanvas();
    barcode.canvas.setCanvasSize(window.innerWidth,window.innerHeight);
  },

  render : function(){
    var _this = this;
    var j = 0;
    this.ctxInv = barcode.canvas.canvasTile.getContext("2d");
    for (let i=0 ; i < barcode.GameEngine.character.items.length ; i++){
      let item = barcode.GameEngine.character.items[i];
      this.ctxInv.beginPath();
      this.ctxInv.lineWidth="3";
      if (item.rarity == 0)
        this.ctxInv.strokeStyle = barcode.C.FT_COLOR_BLACK;
      else if (item.rarity == 1)
        this.ctxInv.strokeStyle = barcode.C.FT_COLOR_BLUE;
      this.ctxInv.rect(30 + i*70, 100 + j*70,64,64);
      this.ctxInv.stroke();

       let div = document.getElementById("inventory");
       let divImg = document.createElement("div");
       let img = document.createElement("img");
       console.log(item);
       img.src = barcode.itemsimg[item.idimg].tileset;
       divImg.addEventListener("mouseover",this.showItem);
       divImg.addEventListener("mouseout",this.hideItem);
       img.myParam = item;
       divImg.style.position = "absolute";
       divImg.style.left =(44+i*70) + "px";
       divImg.style.top = (112+j*70) + "px";
       divImg.style.zIndex = "99";

       divImg.appendChild(img);
       div.appendChild(divImg);
     }
  },
  renderItemShield : function(item){
    barcode.inventory.ctxItem.fillStyle = barcode.C.FT_COLOR_WHITE;
    this.ctxItem.fillText("Chance de blocker : " + item.chanceToBlock + "%" ,160,200 + this.actualY);
    this.actualY += 20;
  },

  renderItemWeapon : function(item){
    barcode.inventory.ctxItem.fillStyle = barcode.C.FT_COLOR_WHITE;
    this.ctxItem.fillText("Vitesse d'attaque : " + item.speed ,160,200 + this.actualY);
    this.actualY += 20;
    this.ctxItem.fillText("Portee : " + item.range ,160,200 + this.actualY);
    this.actualY += 20;
    this.ctxItem.fillText("Degat : " + item.damage[0] + " - " + item.damage[1] ,160,200 + this.actualY);
    this.actualY += 20;
  },

  renderProperties : function(item){
    barcode.inventory.ctxItem.fillStyle = barcode.C.FT_COLOR_MAGICAL;
    var _this = barcode.inventory;
    item.properties.forEach(function(prop){
      if(prop.typeproperty === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
          _this.ctxItem.fillText("Luminosité : + " + prop.value ,160,200 + _this.actualY);
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
          _this.ctxItem.fillText("Bonus de vie : + " + prop.value ,160,200 + _this.actualY);
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
          _this.ctxItem.fillText("Bonus de degat : + " + prop.value ,160,200 + _this.actualY);
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
          _this.ctxItem.fillText("Vitesse : + " + prop.value ,160,200 + _this.actualY);
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
          _this.ctxItem.fillText("Vitesse d'attaque : + " + prop.value ,160,200 + _this.actualY);
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_REGENERATION){
          _this.ctxItem.fillText("Regen. Vie : + " + prop.value ,160,200 + _this.actualY);
      }
      _this.actualY += 20;
    });
  },

  showItem : function(evt){
    barcode.inventory.actualY = 0;
    if (typeof barcode.inventory.ctxItem === 'undefined') barcode.inventory.ctxItem = barcode.canvas.canvasCreature.getContext("2d");
    var item = evt.target.myParam;
    if (typeof item !== "undefined"){
      this.ctxItem = barcode.canvas.canvasCreature.getContext("2d");
      this.ctxItem.beginPath();
      this.ctxItem.fillStyle = barcode.C.FT_COLOR_BROWN;
      this.ctxItem.fillRect(150,150,200,300);
      this.ctxItem.font = "20px Arial";
      this.ctxItem.fillStyle = barcode.C.FT_COLOR_WHITE;
      this.ctxItem.fillText(item.name,180,170);
      this.ctxItem.font = "10px Arial";
      if (item.typeItem === barcode.C.TYPE_ITEM_WEAPON){
        barcode.inventory.renderItemWeapon(item);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_SHIELD){
        barcode.inventory.renderItemShield(item);
      }
      barcode.inventory.renderProperties(item);

    }
  },

  hideItem : function(){
    barcode.canvas.clearOneCanvas(barcode.canvas.canvasCreature);
  },

  eraseInventory : function(){
    let div = document.getElementById("inventory");
    while (div.childNodes.length > 0){
      div.removeChild(div.childNodes[0]);
    }
  }
};
