'use strict';
var barcode = barcode || {};

barcode.Item = function(){
  this.templateId = 0;
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
  this.lightradius = 0;
};


barcode.Item.prototype = {
  loadProperties : function(src,creature){
    var _this = this;
    var _creature = creature;
    if (typeof src.properties !== 'undefined'){
      src.properties.forEach(function(prop){
        var tprop = {'typeproperty' : prop.typeproperty, 'value' : prop.value };
        _this.properties.push(tprop);
        if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
          _creature.maxHitPoint += tprop.value;
          _creature.hitpoint += tprop.value;
        }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
          _creature.damage[0] += tprop.value;
          _creature.damage[1] += tprop.value;
        }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
          _creature.step += tprop.value;
        }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
          _creature.lightRadius += tprop.value;
        }
      })
    }
  },

  loadShield : function(src,creature){
    this.chanceToBlock = src.block;
    creature.chanceToBlock = src.block
  },

  loadWeapon : function(src,creature){
    this.speed = src.speed;
    this.range = src.range;
    this.damage = src.damage.split('-');
    creature.damage[0] = parseInt(this.damage[0]);
    creature.damage[1] = parseInt(this.damage[1]);
    creature.range = this.range;
    creature.speed = this.speed;
  },


  load : function(templateId,creature){
    this.templateId = templateId;
    this.spriteset = barcode.tileset.get("assets/items/items.png");
    this.typeItem = 0;
    var src = barcode.items[templateId];
    this.typeItem = src.typeitem;
    this.tx = src.x;
    this.ty = src.y;
    this.rarity = src.rarity;
    this.name = src.name;
    if (src.typeitem === barcode.C.TYPE_ITEM_WEAPON){
      this.loadWeapon(src,creature);
    }else if (src.typeitem === barcode.C.TYPE_ITEM_SHIELD){
      this.loadShield(src,creature);
    }
    this.loadProperties(src,creature);
  },

  applyLifeRegeneration : function(_creature, prop){
    let diff = _creature.maxHitPoint - _creature.hitpoint;
    let value = prop.value;
    if (diff < prop.value) value = diff;
    if (value > 0)
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
