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
  this.damage = [1,1];
  this.maxHitPoint = 100;
  this.hitpoint = 100;
  this.speedAttack = 50;
  this.rangeAttack = 64;
  this.lastAttackTicks = 0;
  this.chanceToBlock = 0;
  this.items = [];
  this.inventory = [];
  this.tickets = [];
  this.skillpoints = 0;
};

barcode.Character.prototype = {
  saveToJs : function(){
    var meToJs = {};
    var items =[];
    this.items.forEach(function(item){
      items.push(item.templateId);
    })
    meToJs.items = items;
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
        _this.items.push(tempItem);
      })
    }
  },

  removeTicket : function(){
    this.tickets.splice(0,1);
  },

  getTile : function(){
    let tx = Math.round(this.x/barcode.GameEngine.tileSize);
    let ty = Math.round(this.y/barcode.GameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  addItemToCharacter : function(idTemplate){
    let tempItem = new barcode.Item();
    tempItem.load(idTemplate,this);
    this.items.push(tempItem);
  },

  loadFromPreset : function(){
    this.sprite = "assets/sprites/fille.png";
    this.spriteset = barcode.tileset.get(this.sprite);
  //  this.addItemToCharacter(1);
  //  this.addItemToCharacter(2);
  //  this.addItemToCharacter(3);
  },

  addHitPoint : function(hp){
    this.hitpoint += hp;
    var ft = new barcode.FloatingText();
    ft.init(this.x + barcode.GameEngine.tileSize/2,this.y + barcode.GameEngine.tileSize/2,hp,barcode.C.FT_COLOR_GREEN);
    barcode.GameDonjon.floatingText.push(ft);
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
      this.hitpoint -= hp;
      ft.init(this.x + barcode.GameEngine.tileSize/2,this.y + barcode.GameEngine.tileSize/2,hp,barcode.C.FT_COLOR_RED);
    }else{
      ft.init(this.x + barcode.GameEngine.tileSize/2 - 10,this.y + barcode.GameEngine.tileSize/2,"Block",barcode.C.FT_COLOR_BLUE);
    }
    barcode.GameDonjon.floatingText.push(ft);
    if (this.hitpoint <=0){
      barcode.GameEngine.state = barcode.C.STATE_DONJON_DEATH;
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
    let grid = barcode.GameDonjon.level.getAPathArray();
    let tileChar = this.getTile();
    let tx = Math.floor((x-barcode.GameEngine.centerX+this.x)/barcode.GameEngine.tileSize);
    let ty = Math.floor((y-barcode.GameEngine.centerY+this.y)/barcode.GameEngine.tileSize);
      var pthFinding = new barcode.Apath();
      var result =  pthFinding.findShortestPath([tileChar.x,tileChar.y],[tx,ty], grid,true);
      this.path = pthFinding.path;
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

  hitTarget : function(mob){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.lastAttackTicks > this.speedAttack){
      this.lastAttackTicks = newTick;
      let damage = this.calculateDamageToDo()
      mob.hit(damage);
      if (mob.hitpoint <= 0){
          this.addXp(mob.maxHitPoint);
      }
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
  },

  move : function(){
    if (this.path.length > 0){
      this.animate();
      var nextTile = this.path[this.path.length-1];
      var currentTile = this.getTile();
      let dist = calcDistance(this, {x: nextTile.x*barcode.GameEngine.tileSize, y: nextTile.y*barcode.GameEngine.tileSize});
      //if (nextTile.x != currentTile.x || nextTile.y != currentTile.y){
      if (dist >10 ){
        var dx = nextTile.x*barcode.GameEngine.tileSize - this.x;
        var dy = nextTile.y*barcode.GameEngine.tileSize - this.y;
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
       barcode.GameEngine.centerX,
       barcode.GameEngine.centerY,
       barcode.GameEngine.tileSize,
       barcode.GameEngine.tileSize);

  }
};
