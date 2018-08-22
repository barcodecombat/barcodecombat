'use strict';
var barcode = barcode || {};

barcode.GameDonjon = function (){
  this.level = 'undefined';
  this.canvasTile = "undefined";
  this.canvasCreature = "undefined";
  this.canvasAnimation = "undefined";
  this.animations = [];
  this.floatingText = [];
  this.tileSet = null;
};

barcode.GameDonjon.prototype ={
  init : function(){
    this.tileSet = new Image();
    this.tileSet.src = "./assets/tileset/tileset1.png";
    this.level = new barcode.Level();
    this.level.init();
    this.canvasTile = document.getElementById("layerTile");
    this.canvasCreature = document.getElementById("layerCreature");
    this.canvasAnimation = document.getElementById("layerAnimation");
    this.setCanvasSize(window.innerWidth,window.innerHeight);
    this.canvasAnimation.addEventListener("click",barcode.GameDonjon.clickEvent);

  },

  checkAnimations : function(context){
    var animationToRemove = [];
    this.animations.forEach(function(elt){
      elt.render(context);
      if (!elt.isActive()) animationToRemove.push(elt);
    })
    for (let i=0;i<animationToRemove.length;i++){
      const index = this.animations.indexOf(animationToRemove[i]);
      if (index !== -1) {
          this.animations.splice(index, 1);
      }
    }
  },

  checkFloatingText : function(context){
    var ftToRemove = [];
    this.floatingText.forEach(function(elt){
      elt.render(context);
      if (!elt.isActive()) ftToRemove.push(elt);
    })
    for (let i=0;i<ftToRemove.length;i++){
      const index = this.floatingText.indexOf(ftToRemove[i]);
      if (index !== -1) {
          this.floatingText.splice(index, 1);
      }
    }
  },

  setCanvasSize : function(width, height){
    this.canvasTile.width = width;
    this.canvasTile.height = height;
    this.canvasCreature.width = width;
    this.canvasCreature.height = height;
    this.canvasAnimation.width = width;
    this.canvasAnimation.height = height;
  },

  clickEvent : function(evt){
    var mob = barcode.GameDonjon.level.getTheMobUnderMouse(evt.pageX,evt.pageY);
    if ( mob != null){
        var dist = calcDistance(mob, barcode.GameDonjon.level.character);
        if (dist > barcode.GameDonjon.level.character.rangeAttack){
          barcode.GameDonjon.level.character.goToTarget(evt.pageX,evt.pageY);
        }else{
          barcode.GameDonjon.level.character.hitTarget(mob);
        }
    }else{
      barcode.GameDonjon.level.character.goToTarget(evt.pageX,evt.pageY);
    }
  },

  clearCanvas : function(){
    let context = this.canvasTile.getContext("2d");
    context.clearRect(0, 0, this.canvasTile.width, this.canvasTile.height);
    context = this.canvasCreature.getContext("2d");
    context.clearRect(0, 0, this.canvasCreature.width, this.canvasCreature.height);
    context = this.canvasAnimation.getContext("2d");
    context.clearRect(0, 0, this.canvasAnimation.width, this.canvasAnimation.height);
  },

  gameLoop : function(){
    if (this.level.character.hitpoint <= 0)
      barcode.GameEngine.state == barcode.C.STATE_DONJON_DEATH;
    this.render();
  },

  render : function(){
    this.clearCanvas();
    this.level.render(this.tileSet);

    this.checkAnimations(this.canvasTile.getContext("2d"));
    this.checkFloatingText(this.canvasAnimation.getContext("2d"));
  }
};
