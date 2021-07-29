'use strict';
var barcode = barcode || {};

barcode.Character = function(){
  this.x = 0 ;
  this.y = 0;
  this.size = 64;
  this.sprite = "";
  this.spriteset = null;
  this.animation = 0;
  this.direction = 0;
  this.moving = false;
  this.movingTick = 0;
  this.lightRadius = 4;
  this.actualXp = 0;
  this.nextLevelAmountOfXp = 100;
  this.level = 1;
  this.path = [];
  this.step = 3;
  this.damage = [barcode.C.DEFAULT_MIN_DEGAT,barcode.C.DEFAULT_MAX_DEGAT];
  this.maxHitPoint = barcode.C.DEFAULT_HITPOINT;
  this.hitpoint = barcode.C.DEFAULT_HITPOINT;
  this.speedAttack = barcode.C.DEFAULT_SPEED_ATTACK;
  this.rangeAttack = barcode.C.DEFAULT_RANGE_ATTACK;
  this.attackEffects = [];
  this.lastAttackTicks = 0;
  this.chanceToBlock = 0;
  this.items = [];
  this.inventory = [];
  this.tickets = [];
  this.skillpoints = 0;
  this.chanceToHit = 20;
  this.armor = 0;
};

barcode.Character.prototype = {
  saveToJs : function(){
    var meToJs = {};
    var items =[];
    var inventory = []
    this.items.forEach(function(item){
      items.push(item.templateId);
    })
    this.inventory.forEach(function(item){
      inventory.push(item.templateId);
    })

    meToJs.items = items;
    meToJs.inventory = inventory;
    meToJs.actualXp = this.actualXp;
    meToJs.level = this.level;
    meToJs.sprite = this.sprite;
    meToJs.tickets = this.tickets;
    meToJs.skillpoints = this.skillpoints;
    meToJs.nextLevelAmountOfXp = this.nextLevelAmountOfXp;

    return meToJs;
  },

  loadFromJs : function(src){
    this.sprite = src.sprite;
    this.spriteset = barcode.tileset.get(this.sprite);
    this.actualXp = src.actualXp;
    this.level = src.level;
    this.skillpoints = src.skillpoints;
    if (typeof src.tickets !== 'undefined') this.tickets = src.tickets;
    this.nextLevelAmountOfXp = src.nextLevelAmountOfXp;
    if (typeof src.items !== 'undefined'){
      var _this = this;
      src.items.forEach(function(idTemplate){
        let tempItem = new barcode.Item();
        tempItem.load(idTemplate,_this);
        _this.inventory.push(tempItem);
        _this.equipItem(tempItem);
       // tempItem.status = barcode.C.ITEM_WEARED;
       // _this.items.push(tempItem);
      })
    }
    if (typeof src.inventory !== 'undefined'){
      var _this = this;
      src.inventory.forEach(function(idTemplate){
        let tempItem = new barcode.Item();
        tempItem.load(idTemplate,_this);
        _this.inventory.push(tempItem);
      })
    }
  },

  removeTicket : function(){
    this.tickets.splice(0,1);
  },

  getTile : function(){
    let tx = Math.round(this.x/barcode.gameEngine.tileSize);
    let ty = Math.round(this.y/barcode.gameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  isItemWeared : function(item){
    const index = this.items.indexOf(item);
    if (index === -1) return false;

    return true;
  },

  isItemWearedByType : function(typeItem){
    for (let i=0 ; i < this.items.length ; i++){
      if (this.items[i].typeItem === typeItem){
        return true;
      }
    }
    return false;
  },

  equipItem : function(item){
    if (! this.isItemWeared(item.typeItem)){
      const index = this.inventory.indexOf(item);
      if (index !== -1) {
          this.inventory.splice(index, 1);
          this.items.push(item);
          item.equip(this);
      }
    }
  },

  removeItemFromInventory : function(item){
    const index = this.inventory.indexOf(item);
    if (index !== -1) {
        this.inventory.splice(index, 1);
    }
  },

  unequipItem : function(item){
    const index = this.items.indexOf(item);
    if (index !== -1) {
        this.items.splice(index, 1);
        this.inventory.push(item);
        item.unequip(this);
    }
  },

  addItemToCharacter : function(idTemplate){
    let tempItem = new barcode.Item();
    tempItem.load(idTemplate,this);
    this.inventory.push(tempItem);
  },

  loadFromPreset : function(){
    this.sprite = "assets/sprites/rose.png";
    this.spriteset = barcode.tileset.get(this.sprite);
    let ticket = new barcode.Ticket();
    this.tickets.push(ticket);
    ticket = new barcode.Ticket();
    this.tickets.push(ticket);
    ticket = new barcode.Ticket();
    this.tickets.push(ticket);
    ticket = new barcode.Ticket();
    this.tickets.push(ticket);
  //  this.addItemToCharacter(1);
  //  this.addItemToCharacter(2);
  //  this.addItemToCharacter(3);
  },

  addHitPoint : function(hp){
    this.hitpoint += hp;
    this.hitpoint = this.hitpoint > this.maxHitPoint ? this.maxHitPoint : this.hitpoint;
    var ft = new barcode.FloatingText();
    ft.init(this.x + barcode.gameEngine.tileSize/2,this.y + barcode.gameEngine.tileSize/2,hp,barcode.C.FT_COLOR_GREEN);
    barcode.gameDonjon.floatingText.push(ft);
  },

  isHitBlocked : function(){
    var blocked = false;
    if (this.chanceToBlock > 0){
      var rand = Math.random()*100;
      if (rand <= this.chanceToBlock){
        blocked = true;
      }
    }
    return blocked;
  },

  resetHp : function(){
    this.hitpoint = this.maxHitPoint;
  },

  hit : function(hp){
    var ft = new barcode.FloatingText();
    if (! this.isHitBlocked()){
      hp = reduceDamageFromArmor(hp,this);
      this.hitpoint -= hp;
      ft.init(this.x + barcode.gameEngine.tileSize/2,this.y + barcode.gameEngine.tileSize/2,hp,barcode.C.FT_COLOR_RED);
    }else{
      ft.init(this.x + barcode.gameEngine.tileSize/2 - 10,this.y + barcode.gameEngine.tileSize/2,"Block",barcode.C.FT_COLOR_BLUE);
    }
    barcode.gameDonjon.floatingText.push(ft);
    if (this.hitpoint <=0){
      barcode.gameEngine.state = barcode.C.STATE_DONJON_DEATH;
    }
  },

  animate : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.movingTick > barcode.C.ANIMATION_SPEED){
      this.movingTick = newTick;
      this.animation += 1;
      if (this.animation > 2) this.animation = 0;
    }
  },

  goToTarget : function(x,y){
    let grid = barcode.gameDonjon.level.getAPathArray();
    let tileChar = this.getTile();
    let tx = Math.floor((x-barcode.gameEngine.centerX+this.x)/barcode.gameEngine.tileSize);
    let ty = Math.floor((y-barcode.gameEngine.centerY+this.y)/barcode.gameEngine.tileSize);
    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([tileChar.x,tileChar.y],[tx,ty], grid,true);
    this.path = pthFinding.path;
    this.grid = [];
  },

  calculateDamageToDo : function(){
    var result = 1;
    result = Math.floor(Math.random() * (this.damage[1] - this.damage[0]) + this.damage[0]);
    return result;
  },

  addLevel : function(lvl){
    this.level += lvl;
    this.nextLevelAmountOfXp =  (this.level+1)*100;
    if (this.level %3 == 0) this.skillpoints += 1;
    this.resetHp();
  },

  addXp : function(xp){
    this.actualXp += xp;
    if (this.actualXp >= this.nextLevelAmountOfXp){
      this.addLevel(1);
    }
  },

  hitTargetHandleEffect : function(mob){
    console.log(this.attackEffects); 
    for (let i=0; i < this.attackEffects.length;i++){
      if (this.attackEffects[i].typeproperty === barcode.C.PROPERTY_ITEM_FREEZE){
        //TODO : gerer la probabilité de toucher
        // TODO : Appliquer l'effet à la créature
        var animation = new barcode.Animation();
        animation.init(barcode.C.ANIMATION_SLASH_ICE, 500);
        animation.setPosRandom(mob.x,mob.y);
        barcode.gameDonjon.animations.push(animation);
        
      }
    }
  },

  hitTarget : function(mob){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.lastAttackTicks > this.speedAttack){
      this.lastAttackTicks = newTick;
      let damage = this.calculateDamageToDo()
      let hitRandom = Math.floor(Math.random()*100);
      if (this.chanceToHit < hitRandom){
        let damage = this.calculateDamageToDo()
        mob.hit(damage);
        this.hitTargetHandleEffect(mob);
        if (mob.hitpoint <= 0){
          this.addXp(mob.maxHitPoint);
        }
      }else{
        var ft = new barcode.FloatingText();
        ft.init(mob.x + barcode.gameEngine.tileSize/2,mob.y + barcode.gameEngine.tileSize/2,
          "rate",barcode.C.COLOR_GRADIANT_ORANGE);
        barcode.gameDonjon.floatingText.push(ft);
      }
      
      var animation = new barcode.Animation();
      animation.init(barcode.C.ANIMATION_SLASH_EPEE, 50);
      animation.setPosRandom(mob.x,mob.y);
      
      barcode.gameDonjon.animations.push(animation);
    }
  },

  applyEffect : function(){
    var _this = this;
    this.items.forEach(function(item){
      item.apply(_this);
    });
  },

  loop: function(){
    this.move();
    this.applyEffect();
    this.attack();
  },

  attack : function(){
    var mob = barcode.gameDonjon.level.getMobToAttack();
    if (mob !== null){
      this.hitTarget(mob);
    }
  
  },

  move : function(){
    if (this.path.length > 0){
      this.animate();
      var nextTile = this.path[this.path.length-1];
      var currentTile = this.getTile();
      let dist = calcDistance(this, {x: nextTile.x*barcode.gameEngine.tileSize, y: nextTile.y*barcode.gameEngine.tileSize});
      //if (nextTile.x != currentTile.x || nextTile.y != currentTile.y){
      if (dist >10 ){
        var dx = nextTile.x*barcode.gameEngine.tileSize - this.x;
        var dy = nextTile.y*barcode.gameEngine.tileSize - this.y;
        if (Math.abs(dx) > this.step){
          if (dx > 0){
            this.x += this.step;
            this.direction = barcode.C.DIRECTION_RIGHT;
          }else {
            this.x -= this.step;
            this.direction = barcode.C.DIRECTION_LEFT;
          }
        }
        if (Math.abs(dy) > this.step){
          if (dy > 0){
            this.y += this.step;
            this.direction = barcode.C.DIRECTION_UP;
          }else{
            this.y -= this.step;
            this.direction = barcode.C.DIRECTION_DOWN;
          }
        }
      }else{
        this.path.splice(this.path.length-1);
      }
    }
  },

  render : function(ctx){
    ctx.drawImage(
       this.spriteset,
       this.animation*this.size,
       this.direction*this.size,
       this.size,
       this.size,
       barcode.gameEngine.centerX,
       barcode.gameEngine.centerY,
       barcode.gameEngine.tileSize,
       barcode.gameEngine.tileSize);

  }
};
