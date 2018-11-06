'use strict';
var barcode = barcode || {};

barcode.RenderItem = function (){
  this.ctxInv = null;
  this.ctxItem = null
  this.actualY = 0;
  this.divRenderItem = null;
};

barcode.RenderItem.prototype = {

  render:function(div,item,x,y){
     let divImg = document.createElement("div");
     let img = document.createElement("img");
     let borderColor = "";
     if (item.rarity == barcode.C.RARITY_COMMON)
       borderColor = barcode.C.FT_COLOR_GREY;
     else if (item.rarity == barcode.C.RARITY_UNCOMMON)
       borderColor = barcode.C.FT_COLOR_TURQUOISE;
     else if (item.rarity == barcode.C.RARITY_RARE)
       borderColor = barcode.C.FT_COLOR_BLUE;
     else if (item.rarity == barcode.C.RARITY_LEGEND)
       borderColor = barcode.C.FT_COLOR_YELLOW;
     img.style.border = "2px solid " + borderColor;
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
    let divRenderItem = document.getElementById("itemdescription");
    let pTag = document.createElement("P");
    pTag.style.color = barcode.C.FT_COLOR_WHITE;
    pTag.innerHTML = "Chance de bloquer : " + item.chanceToBlock + "%";
    divRenderItem.appendChild(pTag);
  },

  renderItemWeapon : function(item){
    let divRenderItem = document.getElementById("itemdescription");
    let pTag = document.createElement("P");
    pTag.style.color = barcode.C.FT_COLOR_WHITE;
    pTag.innerHTML = "Vitesse d'attaque : " + item.speed;
    divRenderItem.appendChild(pTag);
    pTag = document.createElement("P");
    pTag.style.color = barcode.C.FT_COLOR_WHITE;
    pTag.innerHTML = "Portee : " + item.range;
    divRenderItem.appendChild(pTag);
    pTag = document.createElement("P");
    pTag.style.color = barcode.C.FT_COLOR_WHITE;
    pTag.innerHTML = "Degat : " + item.damage[0] + " - " + item.damage[1];
    divRenderItem.appendChild(pTag);

  },

  renderProperties : function(item){
    var divRenderItem = document.getElementById("itemdescription");
    item.properties.forEach(function(prop){
      let pTag = document.createElement("P");
      pTag.style.color = barcode.C.FT_COLOR_MAGICAL;
      divRenderItem.appendChild(pTag);
      if(prop.typeproperty === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
        pTag.innerHTML = "Luminosité : + " + prop.value;
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
        pTag.innerHTML = "Bonus de vie : + " + prop.value;
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
        pTag.innerHTML = "Bonus de degat : + " + prop.value;
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
        pTag.innerHTML = "Vitesse : + " + prop.value;
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
        pTag.innerHTML = "Vitesse d'attaque : + " + prop.value;
      }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_REGENERATION){
        pTag.innerHTML = "Regen. Vie : + " + prop.value;
      }
    });
  },

  showItem : function(evt){
    var item = evt.target.myParam;
    if (typeof item !== "undefined"){
      let divRenderItem = document.getElementById("itemdescription");
      let name = document.createElement("P");
      name.style.color = barcode.C.FT_COLOR_WHITE;
      name.style.textAlign = "center";
      name.innerHTML = item.name;
      divRenderItem.appendChild(name);

      if (item.typeItem === barcode.C.TYPE_ITEM_WEAPON){
        barcode.RenderItem.renderItemWeapon(item);
      }else if (item.typeItem === barcode.C.TYPE_ITEM_SHIELD){
        barcode.RenderItem.renderItemShield(item);
      }
      barcode.RenderItem.renderProperties(item);

      if (evt.pageX < (window.innerWidth/2)){
        divRenderItem.style.left = evt.pageX + 64 + "px";
      }else{
        divRenderItem.style.left = evt.pageX - 64 - 200 + "px";

      }
      divRenderItem.style.display ="Block";
    }

  },

  hideItem : function(){
    let divRenderItem = document.getElementById("itemdescription");
    divRenderItem.style.display ="None";
    divRenderItem.innerHTML = "";
  },
};
