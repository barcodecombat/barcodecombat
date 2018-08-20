'use strict';
var barcode = barcode || {};

barcode.GameEngine = function (){
  this.tileSet = null;
  this.level = null;
  this.loaded = false;
  this.state = barcode.C.STATE_MENU_SHOWN;
  this.readcodebar = null;
  this.tileSize = barcode.C.TILE_SIZE_PC;
  this.centerX = 0;
  this.centerY = 0;
  this.animations = [];
  this.floatingText = [];
  this.canvasTile = "undefined";
  this.canvasCreature = "undefined";
  this.canvasAnimation = "undefined";
}



barcode.GameEngine.prototype ={
  gameLoop: function (){
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
        if (! barcode.GameEngine.loaded ) return;
          barcode.GameEngine.render();
        if (barcode.GameEngine.level.character.hitpoint <= 0)
          barcode.GameEngine.state === barcode.C.STATE_DONJON_DEATH;
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
    var mob = barcode.GameEngine.level.getTheMobUnderMouse(evt.pageX,evt.pageY);
    if ( mob != null){
        var dist = calcDistance(mob, barcode.GameEngine.level.character);
        if (dist > barcode.GameEngine.level.character.rangeAttack){
          barcode.GameEngine.level.character.goToTarget(evt.pageX,evt.pageY);
        }else{
          barcode.GameEngine.level.character.hitTarget(mob);
        }
    }else{
      barcode.GameEngine.level.character.goToTarget(evt.pageX,evt.pageY);
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

  closeState : function(){
    if (barcode.GameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.GameEngine.readcodebar != null){
      barcode.GameEngine.readcodebar.stop();
    }
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      this.clearCanvas();
      this.setCanvasSize(0,0);
    }
  },

  initDonjon : function(){
    barcode.GameEngine.closeState();
    barcode.GameEngine.tileSet = new Image();
    barcode.GameEngine.tileSet.src = "./assets/tileset/tileset1.png";
    const instance = barcode.GameEngine;
    barcode.GameEngine.tileSet.addEventListener("load",function(e){instance.loaded = true;});
    barcode.GameEngine.level = new barcode.Level();
    barcode.GameEngine.level.init(barcode.maps.map1);
    barcode.GameEngine.setCanvasSize(window.innerWidth,window.innerHeight);
    barcode.GameEngine.canvasAnimation.addEventListener("click",barcode.GameEngine.clickEvent);
    barcode.GameEngine.state = barcode.C.STATE_DONJON_INPROGRESS;
  },

  initMenu : function(){
    barcode.GameEngine.closeState();
    barcode.GameEngine.state = barcode.C.STATE_MENU_SHOWN;
  },

  initScan : function(){
    barcode.GameEngine.closeState();
    barcode.GameEngine.state = barcode.C.STATE_SCAN_INPROGRESS;
    if (barcode.GameEngine.readcodebar == null) barcode.GameEngine.readcodebar = new barcode.Readcodebar();
    barcode.GameEngine.readcodebar.start();
  },

  init : function(){
    let btnMenu = document.getElementById("btnMenu");
    btnMenu.addEventListener("click",barcode.GameEngine.initMenu);
    let btnDonjon = document.getElementById("btnDonjon");
    btnDonjon.addEventListener("click",barcode.GameEngine.initDonjon);
    let btnScan = document.getElementById("btnScan");
    btnScan.addEventListener("click",barcode.GameEngine.initScan);

    this.canvasTile = document.getElementById("layerTile");
    this.canvasCreature = document.getElementById("layerCreature");
    this.canvasAnimation = document.getElementById("layerAnimation");

    this.centerX = window.innerWidth / 2 -window.innerWidth / 4 ;
    this.centerY = window.innerHeight / 2 - window.innerHeight / 4;

    if (window.screen.width < barcode.C.TILE_SIZE_WINDOW_SIZE_LIMITE) this.tileSize = barcode.C.TILE_SIZE_MOBILE;
  },

  clearCanvas : function(){
    let context = this.canvasTile.getContext("2d");
    context.clearRect(0, 0, this.canvasTile.width, this.canvasTile.height);
    context = this.canvasCreature.getContext("2d");
    context.clearRect(0, 0, this.canvasCreature.width, this.canvasCreature.height);
    context = this.canvasAnimation.getContext("2d");
    context.clearRect(0, 0, this.canvasAnimation.width, this.canvasAnimation.height);
  },

  render : function(){
    this.clearCanvas();
    this.level.render(this.tileSet)

    this.checkAnimations(this.canvasTile.getContext("2d"));
    this.checkFloatingText(this.canvasAnimation.getContext("2d"));

  }
}

barcode.GameEngine = new barcode.GameEngine();
barcode.GameEngine.init();
setInterval(barcode.GameEngine.gameLoop,1000/60)
