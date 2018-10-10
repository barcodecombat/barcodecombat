'use strict';
var barcode = barcode || {};

barcode.RenderItem = function (){
  this.ctxInv = null;
  this.ctxItem = null
  this.actualY = 0;
};

barcode.RenderItem.prototype = {

  render:function(div,item,x,y){
    this.ctxInv = barcode.canvas.canvasTile.getContext("2d");;
    this.ctxInv.beginPath();
    this.ctxInv.lineWidth="3";
    if (item.rarity == barcode.C.RARITY_COMMON)
      this.ctxInv.strokeStyle = barcode.C.FT_COLOR_GREY;
    else if (item.rarity == barcode.C.RARITY_UNCOMMON)
      this.ctxInv.strokeStyle = barcode.C.FT_COLOR_TURQUOISE;
    else if (item.rarity == barcode.C.RARITY_RARE)
      this.ctxInv.strokeStyle = barcode.C.FT_COLOR_BLUE;
    else if (item.rarity == barcode.C.RARITY_LEGEND)
      this.ctxInv.strokeStyle = barcode.C.FT_COLOR_YELLOW;

    var rect = div.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    this.ctxInv.rect(x+rect.left,y+rect.top,64,64);
    //this.ctxInv.rect(x,y,64,64);
    this.ctxInv.stroke();

     //let div = document.getElementById("inventory");
     let divImg = document.createElement("div");
     let img = document.createElement("img");
     img.src = barcode.itemsimg[item.idimg].tileset;
     divImg.addEventListener("mouseover",this.showItem);
     divImg.addEventListener("mouseout",this.hideItem);
     img.myParam = item;
     divImg.style.position = "absolute";
     divImg.style.left =(x+14) + "px";
     divImg.style.top = (y+14) + "px";
     divImg.style.zIndex = "99";

     divImg.appendChild(img);
     div.appendChild(divImg);
  },

  renderItemShield : function(item){
    this.ctxItem.fillStyle = barcode.C.FT_COLOR_WHITE;
    this.ctxItem.fillText("Chance de bloquer : " + item.chanceToBlock + "%" ,160,200 + this.actualY);
    this.actualY += 20;
  },

  renderItemWeapon : function(item){
    this.ctxItem.fillStyle = barcode.C.FT_COLOR_WHITE;
    this.ctxItem.fillText("Vitesse d'attaque : " + item.speed ,160,200 + barcode.RenderItem.actualY);
    this.actualY += 20;
    this.ctxItem.fillText("Portee : " + item.range ,160,200 + barcode.RenderItem.actualY);
    this.actualY += 20;
    this.ctxItem.fillText("Degat : " + item.damage[0] + " - " + item.damage[1] ,160,200 + this.actualY);
    this.actualY += 20;
  },

  renderProperties : function(item){
    barcode.RenderItem.ctxItem.fillStyle = barcode.C.FT_COLOR_MAGICAL;
    var _this = barcode.RenderItem;
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
    barcode.RenderItem.actualY = 0;
    if (typeof barcode.RenderItem.ctxItem === 'undefined' || barcode.RenderItem.ctxItem == null) barcode.RenderItem.ctxItem = barcode.canvas.canvasCreature.getContext("2d");
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
        barcode.RenderItem.renderItemWeapon(item);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_SHIELD){
        barcode.RenderItem.renderItemShield(item);
      }
      barcode.RenderItem.renderProperties(item);

    }
  },

  hideItem : function(){
    barcode.canvas.clearOneCanvas(barcode.canvas.canvasCreature);
  },
};
