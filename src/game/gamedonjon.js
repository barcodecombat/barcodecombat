'use strict';
var barcode = barcode || {};

barcode.GameDonjon = function (){
  this.level = 'undefined';
  this.animations = [];
  this.floatingText = [];
  this.tileSet = null;
};

barcode.GameDonjon.prototype ={
  init : function(){
    barcode.canvas.setCanvasSize(window.innerWidth,window.innerHeight);
    this.tileSet = barcode.tileset.get("assets/tileset/tileset1.png");
    this.level = new barcode.Level();
    this.level.init();

    barcode.canvas.canvasMouse.addEventListener("click",barcode.gameDonjon.clickEvent);
    barcode.ui = new barcode.UI();
    document.onmousemove = barcode.gameDonjon.handleMouseMove;

  },

  handleMouseMove : function(evt){
    var mob = barcode.gameDonjon.level.getTheMobUnderMouse(evt.pageX,evt.pageY);
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

  clickEvent : function(evt){
    var decor = barcode.gameDonjon.level.getTheDecorUnderMouse(evt.pageX,evt.pageY);
    if ( decor != null){
        var dist = calcDistance({x: decor.x*barcode.gameEngine.tileSize, y: decor.y*barcode.gameEngine.tileSize}, barcode.gameEngine.character);
        if (dist > (barcode.gameEngine.tileSize*1.5)){
          barcode.gameEngine.character.goToTarget(evt.pageX,evt.pageY);
        }else{
          decor.doAction();
        }
    }else{
      barcode.gameEngine.character.goToTarget(evt.pageX,evt.pageY);
    }
  },

  loop : function(){
    if (barcode.gameEngine.hitpoint <= 0)
      barcode.gameEngine.state == barcode.C.STATE_DONJON_DEATH;
    this.render();
  },

  render : function(){
    barcode.canvas.clearCanvas();
    this.level.render(this.tileSet);

    this.checkAnimations(barcode.canvas.canvasTile.getContext("2d"));
    this.checkFloatingText(barcode.canvas.canvasAnimation.getContext("2d"));
    barcode.ui.render();
  }
};
