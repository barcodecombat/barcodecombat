'use strict';
var barcode = barcode || {};

barcode.Inventory = function (){
};

barcode.Inventory.prototype ={
  init : function(){
    barcode.canvas.clearCanvas();
    barcode.canvas.setCanvasSize(window.innerWidth,window.innerHeight);
  },

  render : function(){
    var _this = this;
    var j = 0;
    var ctx = barcode.canvas.canvasTile.getContext("2d");
    for (let i=0 ; i < barcode.GameEngine.character.items.length ; i++){
      let item = barcode.GameEngine.character.items[i];
      ctx.beginPath();
      ctx.lineWidth="3";
      if (item.rarity == 0)
        ctx.strokeStyle = barcode.C.FT_COLOR_BLACK;
      else if (item.rarity == 1)
        ctx.strokeStyle = barcode.C.FT_COLOR_BLUE;
      ctx.rect(30 + i*70, 100 + j*70,64,64);
      ctx.stroke();

       let div = document.getElementById("inventory");
       let divImg = document.createElement("div");
       let img = document.createElement("img");
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

  showItem : function(evt){
    var item = evt.target.myParam;
    if (typeof item !== "undefined"){
      var ctx = barcode.canvas.canvasCreature.getContext("2d");
      ctx.beginPath();
      ctx.fillStyle = barcode.C.FT_COLOR_BROWN;
      ctx.fillRect(150,150,200,300);
      ctx.font = "20px Arial";
      ctx.fillStyle = barcode.C.FT_COLOR_WHITE;
      ctx.fillText(item.name,180,170);
      ctx.font = "10px Arial";
      var i=0;
      item.properties.forEach(function(prop){
        if(prop.typeproperty === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
            ctx.fillText("Luminosité : + " + prop.value ,160,200 + i *20);
        }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
            ctx.fillText("Bonus de vie : + " + prop.value ,160,200 + i *20);
        }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
            ctx.fillText("Bonus de degat : + " + prop.value ,160,200 + i *20);
        }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
          ctx.fillText("Vitesse : + " + prop.value ,160,200 + i *20);
        }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
          ctx.fillText("Vitesse d'attaque : + " + prop.value ,160,200 + i *20);
        }
        i++;
      });
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
