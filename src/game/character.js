'use strict';
var barcode = barcode || {};

barcode.Character = function(){
  this.x = 0 ;
  this.y = 0;
  this.size = 64;
  this.spriteset = null;
  this.animation = 0;
  this.direction = 0;
  this.moving = false;
  this.loaded = false;
  this.movingTick = 0;
  this.path = [];
  this.step = 3;
  this.hitpoint = 1;
  this.speedAttack = 50;
  this.rangeAttack = 64;
  this.lastAttackTicks = 0;
};

barcode.Character.prototype = {
  loaded : function(){
    this.loaded = true;
  },

  getTile : function(){
    let tx = Math.round(this.x/barcode.GameEngine.tileSize);
    let ty = Math.round(this.y/barcode.GameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  init : function(src){
    this.spriteset = new Image();
    this.spriteset.src = "assets/sprites/fille.png";
    this.spriteset.addEventListener("load",barcode.Character.loaded);
  },

  hit : function(hp){
    this.hitpoint -= hp;

    var ft = new barcode.FloatingText();
    ft.init();
    ft.x = this.x + barcode.GameEngine.tileSize/2;
    ft.y = this.y + barcode.GameEngine.tileSize/2;
    ft.text = hp;
    barcode.GameDonjon.floatingText.push(ft);
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
    let grid = barcode.GameDonjon.level.aPathArray();
    let tileChar = this.getTile();
    // TODO : FActorize convert posX to tileX
    let tx = Math.floor((x-barcode.GameEngine.centerX+this.x)/barcode.GameEngine.tileSize);
    let ty = Math.floor((y-barcode.GameEngine.centerY+this.y)/barcode.GameEngine.tileSize);
    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([tileChar.x,tileChar.y],[tx,ty], grid);

    this.path = pthFinding.path;
  },

  hitTarget : function(mob){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.lastAttackTicks > this.speedAttack){
      this.lastAttackTicks = newTick;
      mob.hit(1);
      var ft = new barcode.FloatingText();
      ft.init();
      ft.x = mob.x + barcode.GameEngine.tileSize/2;
      ft.y = mob.y + barcode.GameEngine.tileSize/2;
      ft.text = "1";
      barcode.GameDonjon.floatingText.push(ft);
    }
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
