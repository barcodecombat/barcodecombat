'use strict';
var barcode = barcode || {};

barcode.GameDonjon = function (){
  this.level = 'undefined';
  this.canvasTile = undefined;
  this.canvasCreature = undefined;
  this.canvasAnimation = undefined;
  this.canvasFog = undefined;
  this.canvasUI = undefined;
  this.canvasMouse = undefined;
  this.animations = [];
  this.floatingText = [];
  this.tileSet = null;
};

barcode.GameDonjon.prototype ={
  init : function(){
    this.tileSet = barcode.tileset.get("assets/tileset/tileset1.png");
    this.level = new barcode.Level();
    this.level.init();
    this.canvasTile = document.getElementById("layerTile");
    this.canvasCreature = document.getElementById("layerCreature");
    this.canvasAnimation = document.getElementById("layerAnimation");
    //this.canvasUI = document.getElementById("layerUI");
    //this.canvasFog = document.getElementById("layerFog");
    this.canvasMouse = document.getElementById("layerMouse");
    this.setCanvasSize(window.innerWidth,window.innerHeight);
    this.canvasMouse.addEventListener("click",barcode.GameDonjon.clickEvent);
    barcode.ui = new barcode.UI();
    document.onmousemove = barcode.GameDonjon.handleMouseMove;

  },

  handleMouseMove : function(evt){
    var mob = barcode.GameDonjon.level.getTheMobUnderMouse(evt.pageX,evt.pageY);
    if ( mob != null){
      barcode.ui.showMonsterGauge(mob);
    }else{
      barcode.ui.hideMonsterGauge();
    }
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
    this.canvasMouse.width = width;
    this.canvasMouse.height = height;
    //this.canvasFog.width = width;
    //this.canvasFog.height = height;
    //this.canvasUI.width = width;
    //this.canvasUI.height = height;
  },

  clickEvent : function(evt){
    var mob = barcode.GameDonjon.level.getTheMobUnderMouse(evt.pageX,evt.pageY);
    if ( mob != null){
        var dist = calcDistance(mob, barcode.GameEngine.character);
        if (dist > barcode.GameEngine.character.rangeAttack){
          barcode.GameEngine.character.goToTarget(evt.pageX,evt.pageY);
        }else{
          barcode.GameEngine.character.hitTarget(mob);
        }
    }else{
      barcode.GameEngine.character.goToTarget(evt.pageX,evt.pageY);
    }
  },

  clearCanvas : function(){
    let context = this.canvasTile.getContext("2d");
    context.clearRect(0, 0, this.canvasTile.width, this.canvasTile.height);
    context = this.canvasCreature.getContext("2d");
    context.clearRect(0, 0, this.canvasCreature.width, this.canvasCreature.height);
    context = this.canvasAnimation.getContext("2d");
    context.clearRect(0, 0, this.canvasAnimation.width, this.canvasAnimation.height);
    //context = this.canvasFog.getContext("2d");
    //context.clearRect(0, 0, this.canvasFog.width, this.canvasFog.height);
    //context = this.canvasUI.getContext("2d");
    //context.clearRect(0, 0, this.canvasUI.width, this.canvasUI.height);

  },

  gameLoop : function(){
    if (barcode.GameEngine.hitpoint <= 0)
      barcode.GameEngine.state == barcode.C.STATE_DONJON_DEATH;
    this.render();
  },

  render : function(){
    this.clearCanvas();
    this.level.render(this.tileSet);

    this.checkAnimations(this.canvasTile.getContext("2d"));
    this.checkFloatingText(this.canvasAnimation.getContext("2d"));
    barcode.ui.render();
  }
};
