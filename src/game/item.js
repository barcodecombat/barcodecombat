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
  this.speed = 0;
  this.range = 0;
  this.damage = [];
  this.chanceToBlock = 0;
};


barcode.Item.prototype = {
  loadNecklace : function(src,creature){
    var _this = this;
    src.properties.forEach(function(prop){
      var tprop = {'typeproperty' : prop.typeproperty, 'value' : prop.value };
      _this.properties.push(tprop);
    })
  },

  loadShield : function(src,creature){
    this.chanceToBlock = src.block;
    creature.chanceToBlock = src.block
  },

  loadWeapon : function(src,creature){
    this.speed = src.speed;
    this.range = src.range;
    this.damage = src.damage.split('-');
    creature.damage = this.damage;
    creature.range = this.range;
    creature.speed = this.speed;
  },

  load : function(templateId,creature){
    this.spriteset = barcode.tileset.get("assets/items/items.png");
    this.typeItem = 0;
    var src = barcode.items[templateId];
    this.typeItem = src.typeitem;
    this.tx = src.x;
    this.ty = src.y;
    this.name = src.name;
    if (src.typeitem === barcode.C.TYPE_ITEM_NECKLACE){
      this.loadNecklace(src,creature);
    }else if (src.typeitem === barcode.C.TYPE_ITEM_WEAPON){
      this.loadWeapon(src,creature);
    }else if (src.typeitem === barcode.C.TYPE_ITEM_SHIELD){
      this.loadShield(src,creature);
    }
  },

  applyLifeRegeneration : function(_creature, prop){
    let diff = _creature.maxHitPoint - _creature.hitpoint;
    let value = prop.value;
    if (diff < prop.value) value = diff;
    _creature.addHitPoint(value);
  },

  apply : function(creature){
    var _creature = creature;
    let d = new Date();
    let newTick = d.getTime();
    var _this = this;
    if ((newTick - this.lastTick) > 1000){
      this.properties.forEach(function(prop){
        if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_REGENERATION){
          _this.applyLifeRegeneration(_creature,prop);
        }
      });
      this.lastTick = newTick;
    }
  },
};
