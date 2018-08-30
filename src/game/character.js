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
  this.maxHitPoint = 500;
  this.hitpoint = 500;
  this.speedAttack = 50;
  this.rangeAttack = 64;
  this.lastAttackTicks = 0;
  this.items = [];
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

    let tempItem = new barcode.Item();
    tempItem.loadItem(3);
    this.items.push(tempItem);
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
    let grid = barcode.GameDonjon.level.getAPathArray();
    let tileChar = this.getTile();
    // TODO : FActorize convert posX to tileX
    let tx = Math.floor((x-barcode.GameEngine.centerX+this.x)/barcode.GameEngine.tileSize);
    let ty = Math.floor((y-barcode.GameEngine.centerY+this.y)/barcode.GameEngine.tileSize);
      var pthFinding = new barcode.Apath();
      var result =  pthFinding.findShortestPath([tileChar.x,tileChar.y],[tx,ty], grid,true);
      this.path = pthFinding.path;
    /*var ctx = barcode.GameDonjon.canvasAPath.getContext("2d");
    console.log(grid);
    var _this = this;
    grid.forEach(function(raw){
      raw.forEach(function(tile){
        if (tile.status == "visited"){
          ctx.beginPath();
          ctx.lineWidth="6";
          let col = (tile.F * 10).toString(16);
          ctx.strokeStyle = "#" + col + "aaaa";
          ctx.rect(tile.x * 32 + barcode.GameEngine.centerX-_this.x,tile.y * 32 + barcode.GameEngine.centerY-_this.y ,32,32);
          ctx.stroke();
        }
      });
    });*/

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

  applyEffect : function(){
    this.items.forEach(function(item){

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
