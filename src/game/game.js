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
  this.character = undefined;
}

barcode.GameEngine.prototype ={
  gameLoop: function (){
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
        barcode.GameDonjon.loop();
    }else if (barcode.GameEngine.state === barcode.C.STATE_INVENTORY){
        //barcode.inventory.loop();
    }
  },

  closeState : function(){
    if (barcode.GameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.GameEngine.readcodebar != null){
      barcode.GameEngine.readcodebar.stop();
    }
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      barcode.canvas.clearCanvas();
      barcode.canvas.setCanvasSize(0,0);
    }
    if(barcode.GameEngine.state == barcode.C.STATE_INVENTORY){
      barcode.inventory.eraseInventory();
      barcode.inventory.init();
    }
  },

  saveGame : function(){
    var ch = barcode.GameEngine.character.saveToJs();
    localStorage.setItem('characterStored', JSON.stringify(ch));
    localStorage.setItem('itemsStored', JSON.stringify(barcode.items));
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

  initHero : function(){
    barcode.GameEngine.closeState();
    if (typeof barcode.inventory === 'undefined' || barcode.inventory === null)
      barcode.inventory = new barcode.Inventory();
    barcode.inventory.init();
    barcode.inventory.render();
    barcode.GameEngine.state = barcode.C.STATE_INVENTORY;
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
    barcode.canvas = new barcode.Canvas();
    barcode.canvas.init();
    barcode.tileset = new barcode.Tileset();
    let btnMenu = document.getElementById("btnMenu");
    btnMenu.addEventListener("click",barcode.GameEngine.initMenu);
    let btnDonjon = document.getElementById("btnDonjon");
    btnDonjon.addEventListener("click",barcode.GameEngine.initDonjon);
    let btnScan = document.getElementById("btnScan");
    btnScan.addEventListener("click",barcode.GameEngine.initScan);
    let btnSave = document.getElementById("btnSave");
    btnSave.addEventListener("click",barcode.GameEngine.saveGame);
    let btnHero = document.getElementById("btnHero");
    btnHero.addEventListener("click",barcode.GameEngine.initHero);

    if (window.screen.width < barcode.C.TILE_SIZE_WINDOW_SIZE_LIMITE) this.tileSize = barcode.C.TILE_SIZE_MOBILE;
    this.centerX = window.innerWidth / 2 -  this.tileSize / 2 ;
    this.centerY = window.innerHeight / 2 - this.tileSize / 2 - 70;

    this.character = new barcode.Character();
    var objCh = JSON.parse(localStorage.getItem('characterStored'));
    if (typeof objCh !== 'undefined' && objCh !== null){
      this.character.loadFromJs(objCh);
    }else{
      this.character.loadFromPreset();
    }
    var objIt = JSON.parse(localStorage.getItem('itemsStored'));
    if (typeof objIt !== 'undefined' && objIt !== null){
        barcode.items = objIt;
    }

  },

}

barcode.GameEngine = new barcode.GameEngine();
barcode.GameEngine.init();

setInterval(barcode.GameEngine.gameLoop,1000/60)
