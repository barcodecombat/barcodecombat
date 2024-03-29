'use strict';
var barcode = barcode || {};

barcode.Monster = function(){
  this.x = 0 ;
  this.y = 0;
  this.sprite = {
    "x" : 0,
    "y" : 0,
    "size" : 0
  };
  this.name = "";
  this.spriteset = null;
  this.animation = 0;
  this.nbAnimation = 0;
  this.direction = 0;
  this.moving = false;
  this.loaded = false;
  this.movingTick = 0;
  this.path = [];
  this.step = 1;
  this.target = undefined;
  this.range = 50;
  this.attackSpeed = 50;
  this.lastAttack = 0;
  this.damage = 2;
  this.maxHitPoint = 10;
  this.hitpoint = 10;
  this.lastTimeCreatingPath = 0;
  this.chanceToHit = 20;
  this.armor = 0;
  this.curses = [];
};

barcode.Monster.prototype = {
  loaded : function(){
    this.loaded = true;
  }
  ,
  init : function(templateId){
    
    var src = barcode.mobs[templateId];
    this.spriteset = barcode.tileset.get(src.sprite.spriteset);
    this.sprite.x = src.sprite.x;
    this.sprite.y = src.sprite.y;
    this.sprite.size = src.sprite.size;
    this.maxHitPoint = src.hitpoints;
    this.hitpoint = src.hitpoints;
    this.damage = src.damage;
    this.range = src.range;
    this.attackSpeed = src.attackspeed;
    this.name = src.name;
    this.nbAnimation = src.animation;
    this.armor = src.armor;
    
  },

  hit: function(hp){
    hp = reduceDamageFromArmor(hp,this);
    this.hitpoint -= hp;
    var ft = new barcode.FloatingText();
    ft.init(this.x + barcode.gameEngine.tileSize/2,this.y + barcode.gameEngine.tileSize/2,hp,barcode.C.FT_COLOR_RED);
    barcode.gameDonjon.floatingText.push(ft);
  },

  isFrozen : function(){
    let result = false;
    for (let i=0 ; i < this.curses.length ; i++){
      if (this.curses[i].typeCurse === barcode.C.CURSE_FROZEN){
        result = true;
      }
    }
    return result;
  },

  getCurse : function(){
    if (this.curses.length > 0){
      return (this.curses[0].typeCurse)
    }
    return -1;
  },

  addCurse : function(typeCurse){
    let curse = new barcode.Curse();
    curse.init(typeCurse);
    this.curses.push(curse);
  },

  render : function(ctx){
    let tile = this.getTile();
    let tilesArray = barcode.gameDonjon.level.getTilesForAPath();
    if ((tile.x + "/" + tile.y) in tilesArray){
      if (tilesArray[tile.x + "/" + tile.y].lightened){
        ctx.globalCompositeOperation = "source-over";
        let curse = this.getCurse();
        if (curse !== -1){
          if (curse === barcode.C.CURSE_FROZEN){
            ctx.fillStyle = "#09f";
          }else if (curse === barcode.C.CURSE_POISON){
            ctx.fillStyle = "#0ff08b";
          }
          ctx.fillRect(this.x+barcode.gameEngine.centerX - barcode.gameEngine.character.x, 
            this.y+barcode.gameEngine.centerY - barcode.gameEngine.character.y, barcode.gameEngine.tileSize,
            barcode.gameEngine.tileSize);
          ctx.globalCompositeOperation = "lighter";
        }
        ctx.drawImage(
           this.spriteset,
           this.sprite.x + this.animation*this.sprite.size,
           this.sprite.y + this.direction*this.sprite.size,
           this.sprite.size,
           this.sprite.size,
           this.x+barcode.gameEngine.centerX - barcode.gameEngine.character.x,
           this.y+barcode.gameEngine.centerY - barcode.gameEngine.character.y,
           barcode.gameEngine.tileSize,
           barcode.gameEngine.tileSize);
      }
    }

  },

  handleCurse : function(curse){
    if (curse.typeCurse === barcode.C.CURSE_POISON){
      this.hp -= 10;
    }
  },

  manageCurses : function(){
    let indexCurseToRemove = -1;
    for (let i=0;i< this.curses.length;i++){
      if (!this.curses[i].isActive()){
        indexCurseToRemove = i;
      }else{
        this.handleCurse(this.curses[i]);
      }
    }
    if (indexCurseToRemove !== -1){
      this.curses.splice(indexCurseToRemove,1);
    }
  },

  doAction : function(){
    if (typeof this.target !== 'undefined'){
      let distance = calcDistance({x:barcode.gameEngine.character.getTile().x*barcode.gameEngine.tileSize,y:barcode.gameEngine.character.getTile().y*barcode.gameEngine.tileSize},{x : this.x, y : this.y});
      if (distance > this.range && distance < barcode.C.DISTANCE_MOB_SEE_PLAYER){
        let d = new Date();
        let newTick = d.getTime();
        if(newTick - this.lastTimeCreatingPath > barcode.C.DELAY_BETWEEN_TWO_PATH_CREATION){
          this.createPathTo(barcode.gameEngine.character.getTile());
          this.lastTimeCreatingPath = newTick;
        }
        this.move();
      }else if (distance < this.range){
        this.attack();
      }
    }else{
      let distance = calcDistance({x:barcode.gameEngine.character.getTile().x*barcode.gameEngine.tileSize,y:barcode.gameEngine.character.getTile().y*barcode.gameEngine.tileSize},{x : this.x, y : this.y});
      if (distance < barcode.C.DISTANCE_MOB_SEE_PLAYER){
        this.target = barcode.gameEngine.character.getTile();
      }
    }
    this.manageCurses();
    
  },

  attack : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.lastAttack > this.attackSpeed){
      this.lastAttack = newTick;
      let hitRandom = Math.floor(Math.random()*100);
      if (this.chanceToHit < hitRandom){
        barcode.gameEngine.character.hit(this.damage);
      }else{
        var ft = new barcode.FloatingText();
        ft.init(barcode.gameEngine.character.x + barcode.gameEngine.tileSize/2,barcode.gameEngine.character.y + barcode.gameEngine.tileSize/2,
          "rate",barcode.C.COLOR_GRADIANT_ORANGE);
        barcode.gameDonjon.floatingText.push(ft);
      }
    }
  },

  animate : function(){
    let d = new Date();
    let newTick = d.getTime();
    if (newTick - this.movingTick >  barcode.C.ANIMATION_SPEED){
      this.movingTick = newTick;
      this.animation += 1;
      if (this.animation >= this.nbAnimation) this.animation = 0;
    }
  },

  getTile : function(){
    let tx = Math.round(this.x/barcode.gameEngine.tileSize);
    let ty = Math.round(this.y/barcode.gameEngine.tileSize);
    return {"x" : tx, "y" : ty  };
  },

  createPathTo : function(tileTarget){
    let distance = calcDistance({x:tileTarget.x*barcode.gameEngine.tileSize,y:tileTarget.y*barcode.gameEngine.tileSize},{x : this.x, y : this.y});
    if (distance < 200){
      this.target = tileTarget;
      if ((this.path.length == 0) || ( this.path[0].x != tileTarget.x && this.path[0].y != tileTarget.y)){
        let grid = barcode.gameDonjon.level.getAPathArray();
        let tileMob = this.getTile();

        var pthFinding = new barcode.Apath();
        var result =  pthFinding.findShortestPath([tileMob.x,tileMob.y],[tileTarget.x,tileTarget.y], grid,true);
        this.path = pthFinding.path;
        grid = [];
      }
    }
  },

  move : function(){
    if (this.path.length > 0){
      if (!this.isFrozen()){
        this.animate();
        var nextTile = this.path[this.path.length-1];
        var currentTile = this.getTile();
        if (nextTile.x != currentTile.x || nextTile.y != currentTile.y){
          var dx = nextTile.x - currentTile.x;
          var dy = nextTile.y - currentTile.y;
          if (dx != 0){
            if (dx > 0){
              this.x += this.step;
              this.direction = barcode.C.DIRECTION_RIGHT;
            }else{
              this.x -= this.step;
              this.direction = barcode.C.DIRECTION_LEFT;
            }
          }
          if (dy != 0){
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
    }
  },

};
