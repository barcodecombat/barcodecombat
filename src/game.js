'use strict';
var barcode = barcode || {};

barcode.GameEngine = function (){
  this.tileSet = null;
  this.level = null;
  this.loaded = false;
  this.state = barcode.C.STATE_MENU_SHOWN;
  this.readcodebar = null;
  this.tileSize = 32;
  this.centerX = 400;
  this.centerY = 200;
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

  clickEvent : function(evt){
    var mob = barcode.GameEngine.level.getTheMobUnderMouse(evt.pageX,evt.pageY);
    if ( mob != null){
        var dist = calcDistance(mob, barcode.GameEngine.level.character);
        if (dist > barcode.GameEngine.tileSize){
          barcode.GameEngine.level.character.goToTarget(evt.pageX,evt.pageY);
        }else{
          barcode.GameEngine.level.character.hitTarget(mob);
        }
    }else{
      barcode.GameEngine.level.character.goToTarget(evt.pageX,evt.pageY);
    }
  /*  let grid = barcode.GameEngine.level.aPathArray();
    let tileChar = barcode.GameEngine.level.character.getTile();
    // TODO : FActorize convert posX to tileX
    let tx = Math.floor((evt.pageX-barcode.GameEngine.centerX+barcode.GameEngine.level.character.x)/barcode.GameEngine.tileSize);
    let ty = Math.floor((evt.pageY-barcode.GameEngine.centerY+barcode.GameEngine.level.character.y)/barcode.GameEngine.tileSize);

    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([tileChar.x,tileChar.y],[tx,ty], grid);

    barcode.GameEngine.level.character.path = pthFinding.path;*/
  },

  closeState : function(){
    if (barcode.GameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.GameEngine.readcodebar != null){
      barcode.GameEngine.readcodebar.stop();
    }
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      let canvas = document.getElementById("layer1");
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
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
    let canvas = document.getElementById("layer1");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener("click",barcode.GameEngine.clickEvent);
    barcode.GameEngine.state = barcode.C.STATE_DONJON_INPROGRESS;
    /*function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }


    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        console.log( 'Mouse position: ' + mousePos.x + ',' + mousePos.y);
      }, false);*/
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

    this.centerX = window.innerWidth / 2 -window.innerWidth / 4 ;
    this.centerY = window.innerHeight / 2 - window.innerHeight / 4;
  },

  render : function(){
      let canvas = document.getElementById("layer1");
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.level.render(this.tileSet, context)
    }
}

barcode.GameEngine = new barcode.GameEngine();
barcode.GameEngine.init();
setInterval(barcode.GameEngine.gameLoop,1000/60)
