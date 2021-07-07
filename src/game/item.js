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
  this.spriteset = null;
  this.properties = [];
  this.tx = 0;
  this.ty = 0;
  this.spritesize = 0;
  this.speed = 0;
  this.range = 0;
  this.damage = [];
  this.chanceToBlock = 0;
  this.lightradius = 0;
  this.status = barcode.C.ITEM_UNWEARED;
};

barcode.Item.prototype = {
  loadProperties : function(src,creature){
    var _this = this;
    var _creature = creature;
    if (typeof src.properties !== 'undefined'){
      src.properties.forEach(function(prop){
        var tprop = {'typeproperty' : prop.typeproperty, 'value' : prop.value };
        _this.properties.push(tprop);

      })
    }
  },

  equipProperties(creature){
    var _creature = creature;
    this.properties.foreacht(function(tprop){
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
      }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
        _creature.speedAttack += tprop.value;
      }
    })
  },

  equipWeapon : function(creature){
    creature.damage[0] = this.damage[0];
    creature.damage[1] = this.damage[1];
    creature.range = this.range;
    creature.speed = this.speed;
  },

  equipShield : function(creature){
    creature.chanceToBlock = this.chanceToBlock;
  },

  equip : function(creature){
    this.equipProperties(creature);
    if (this.typeItem === barcode.C.TYPE_ITEM_WEAPON){
      this.equipWeapon(creature);
    }else if (this.typeItem === barcode.C.TYPE_ITEM_SHIELD){
      this.equipShield(creature);
    }
    this.status = barcode.C.ITEM_WEARED;
  },

  equipProperties(creature){
    var _creature = creature;
    this.properties.forEach(function(tprop){
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
      }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
        _creature.speedAttack += tprop.value;
      }
    })
  },

  unequipProperties(creature){
    var _creature = creature;
    this.properties.forEach(function(tprop){
      if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
        _creature.maxHitPoint -= tprop.value;
        _creature.hitpoint -= tprop.value;
      }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
        _creature.damage[0] -= tprop.value;
        _creature.damage[1] -= tprop.value;
      }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
        _creature.step -= tprop.value;
      }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
        _creature.lightRadius -= tprop.value;
      }else if (tprop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
        _creature.speedAttack -= tprop.value;
      }
    })
  },

  unequipWeapon : function(creature){
    creature.damage[0] = barcode.C.DEFAULT_MIN_DEGAT;
    creature.damage[1] = barcode.C.DEFAULT_MAX_DEGAT;
    creature.range = barcode.C.DEFAULT_RANGE_ATTACK;
    creature.speed = barcode.C.DEFAULT_SPEED_ATTACK;
  },

  unequipShield : function(creature){
    creature.chanceToBlock = barcode.C.DEFAULT_CHANCE_TO_BLOCK;
  },

  unequip : function(creature){
    this.unequipProperties(creature);
    if (this.typeItem === barcode.C.TYPE_ITEM_WEAPON){
      this.unequipWeapon(creature);
    }else if (this.typeItem === barcode.C.TYPE_ITEM_SHIELD){
      this.unequipShield(creature);
    }
    this.status = barcode.C.ITEM_UNWEARED;
  },

  loadShield : function(src,creature){
    this.chanceToBlock = src.chanceToBlock;
  },

  loadWeapon : function(src,creature){
    this.speed = src.speed;
    this.range = src.range;
    this.damage.push(src.damage[0]);
    this.damage.push(src.damage[1]);
  },

  loadSprite : function(){

    if (typeof barcode.itemsimg !== "undefined"){
      this.tx = barcode.itemsimg[this.idimg].x;
      this.ty = barcode.itemsimg[this.idimg].y;
      this.spriteset = barcode.tileset.get(barcode.itemsimg[this.idimg].tileset);
      this.spritesize = barcode.itemsimg[this.idimg].size;
    }
  },

  load : function(templateId,creature){
    this.templateId = templateId;
    this.spriteset = barcode.tileset.get("assets/items/items.png");
    this.typeItem = 0;
    var src = barcode.items[templateId];
    this.typeItem = src.typeItem;
    this.idimg = src.idimg;
    this.rarity = src.rarity;
    this.name = src.name;
    if (this.typeItem === barcode.C.TYPE_ITEM_WEAPON){
      this.loadWeapon(src,creature);
    }else if (this.typeItem === barcode.C.TYPE_ITEM_SHIELD){
      this.loadShield(src,creature);
    }
    this.loadProperties(src,creature);
    this.loadSprite();
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

  render : function(x,y){
    var ctx = barcode.canvas.canvasAnimation.getContext("2d");
    ctx.drawImage(
       this.spriteset,
       0,
       0,
       barcode.C.TILE_SIZE_PC,
       barcode.C.TILE_SIZE_PC,
       x,
       y,
       barcode.C.TILE_SIZE_PC,
       barcode.C.TILE_SIZE_PC);
  },
};
