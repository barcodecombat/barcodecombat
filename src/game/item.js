'use strict';
var barcode = barcode || {};

barcode.Item = function(){
  this.typeItem = 0;
  this.tx = 0;
  this.ty = 0;
  this.name = "";
  this.rarity = 0;
  this.spriteset = undefined;
  this.lastTick  = 0;
  this.properties = [];
};


barcode.Item.prototype = {
  loadNecklace : function(src){
    var _this = this;
    src.properties.forEach(function(prop){
      var tprop = {'typeproperty' : prop.typeproperty, 'value' : prop.value };
      _this.properties.push(tprop);
    })
  },

  load : function(templateId){
    this.spriteset = barcode.tileset.get("assets/items/items.png");
    this.typeItem = 0;
    var src = barcode.items[templateId];
    this.typeItem = src.typeitem;
    this.tx = src.x;
    this.ty = src.y;
    this.name = src.name;
    if (src.typeitem === barcode.C.TYPE_ITEM_NECKLACE){
      this.loadNecklace(src);
    }
  },

  apply : function(creature){
    var _creature = creature;
    let d = new Date();
    let newTick = d.getTime();
    if ((newTick - this.lastTick) > 1000){
      this.properties.forEach(function(prop){
        if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_REGENERATION){
          _creature.hitpoint += prop.value;
          if (_creature.hitpoint > _creature.maxHitPoint) _creature.hitpoint = _creature.maxHitPoint;
        }
      });
      this.lastTick = newTick;
    }
  },
};
