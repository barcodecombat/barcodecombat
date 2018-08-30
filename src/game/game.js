'use strict';
var barcode = barcode || {};

barcode.GameEngine = function (){
  this.level = null;
  this.loaded = false;
  this.state = barcode.C.STATE_MENU_SHOWN;
  this.readcodebar = null;
  this.tileSize = barcode.C.TILE_SIZE_PC;
  this.centerX = 0;
  this.centerY = 0;
}

barcode.GameEngine.prototype ={
  gameLoop: function (){
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
        barcode.GameDonjon.gameLoop();
    }
  },

  closeState : function(){
    if (barcode.GameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.GameEngine.readcodebar != null){
      barcode.GameEngine.readcodebar.stop();
    }
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      barcode.GameDonjon.clearCanvas();
      barcode.GameDonjon.setCanvasSize(0,0);
    }
  },

  initDonjon : function(){
    barcode.GameEngine.closeState();
    barcode.GameDonjon.init();
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
    barcode.Generator = new barcode.Generator();
    barcode.Generator.init();
    barcode.GameDonjon = new barcode.GameDonjon();
    let btnMenu = document.getElementById("btnMenu");
    btnMenu.addEventListener("click",barcode.GameEngine.initMenu);
    let btnDonjon = document.getElementById("btnDonjon");
    btnDonjon.addEventListener("click",barcode.GameEngine.initDonjon);
    let btnScan = document.getElementById("btnScan");
    btnScan.addEventListener("click",barcode.GameEngine.initScan);

    if (window.screen.width < barcode.C.TILE_SIZE_WINDOW_SIZE_LIMITE) this.tileSize = barcode.C.TILE_SIZE_MOBILE;
    this.centerX = window.innerWidth / 2 -  this.tileSize / 2 ;
    this.centerY = window.innerHeight / 2 - this.tileSize / 2 - 70;
  },

}

barcode.GameEngine = new barcode.GameEngine();
barcode.GameEngine.init();

setInterval(barcode.GameEngine.gameLoop,1000/60)
