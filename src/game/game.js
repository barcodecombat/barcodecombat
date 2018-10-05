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
    }else if (barcode.GameEngine.state === barcode.C.STATE_DONJON_DEATH){
      barcode.GameEngine.showDeath();
    }else if (barcode.GameEngine.state === barcode.C.STATE_MENU_TO_SHOW){
      barcode.GameEngine.initMenu();
    }else if (barcode.GameEngine.state === barcode.C.STATE_MENU_ENDDONJON_TOSHOW){
      barcode.GameEngine.showEndDonjon();
    }
  },

  closeState : function(){
    if (barcode.GameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.GameEngine.readcodebar != null){
      barcode.GameEngine.readcodebar.stop();
    }
    else if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      barcode.canvas.clearCanvas();
      barcode.canvas.setCanvasSize(0,0);
    }
    else if(barcode.GameEngine.state == barcode.C.STATE_INVENTORY){
      barcode.inventory.eraseInventory();
      barcode.inventory.init();
    }
    else if(barcode.GameEngine.state == barcode.C.STATE_MENU_SHOWN){
      var menu = document.getElementById("mainMenu");
      menu.style.display = "none";
    }else if(barcode.GameEngine.state == barcode.C.STATE_MENU_DEATH){
      var menu = document.getElementById("death");
      menu.style.display = "none";
    }else if(barcode.GameEngine.state == barcode.C.STATE_MENU_ENDDONJON){
      var menu = document.getElementById("enddonjon");
      menu.style.display = "none";
    }
    barcode.canvas.clearCanvas();
    barcode.canvas.setCanvasSize(0,0);
  },

  saveGame : function(){
    var ch = barcode.GameEngine.character.saveToJs();
    localStorage.setItem('characterStored', JSON.stringify(ch));
    localStorage.setItem('itemsStored', JSON.stringify(barcode.items));
  },

  showDeath : function(){
    barcode.GameEngine.closeState();
    var menu = document.getElementById("death");
    menu.style.display = "block";
    barcode.GameEngine.state = barcode.C.STATE_MENU_DEATH;
  },

  showEndDonjon : function(){
    barcode.GameEngine.closeState();
    var menu = document.getElementById("enddonjon");
    menu.style.display = "block";
    barcode.GameEngine.state = barcode.C.STATE_MENU_ENDDONJON;
  },

  initDonjon : function(){
    barcode.GameEngine.closeState();
    barcode.GameDonjon.init();
    barcode.GameEngine.state = barcode.C.STATE_DONJON_INPROGRESS;
    barcode.GameEngine.character.resetHp();
  },

  initMenu : function(){
    console.log("pwet");
    barcode.GameEngine.closeState();
    barcode.GameEngine.state = barcode.C.STATE_MENU_SHOWN;
    var menu = document.getElementById("mainMenu");
    menu.style.display = "block";
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

  generateItem : function(val){
    if (typeof val === 'undefined' || val == null){
      val = Math.round(Math.random()*999999999);
    }
    var itemGenerator = new barcode.itemgenerator();
    itemGenerator.generate();
    barcode.items[val] = itemGenerator.item;
    //barcode.GameEngine.character.items.push(itemGenerator.item);
    barcode.GameEngine.character.addItemToCharacter(val);
  },

  scanItem : function(){
    barcode.GameEngine.generateItem();
  },

  init : function(){
    barcode.Generator = new barcode.Generator();
    barcode.Generator.init();
    barcode.GameDonjon = new barcode.GameDonjon();
    barcode.canvas = new barcode.Canvas();
    barcode.canvas.init();
    barcode.tileset = new barcode.Tileset();
    barcode.GameEngine.state = barcode.C.STATE_MENU_SHOWN;
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
    let btnGenerate = document.getElementById("btnGenerate");
    btnGenerate.addEventListener("click",barcode.GameEngine.scanItem);
    let butnScan = document.getElementById("buttonScan");
    butnScan.addEventListener("click",barcode.GameEngine.scanItem);
    let btnDeathBack = document.getElementById("btnBackToMenu");
    btnDeathBack.addEventListener("click",barcode.GameEngine.initMenu);
    let btnEndDonjonBack = document.getElementById("btnBackToMenu2");
    btnEndDonjonBack.addEventListener("click",barcode.GameEngine.initMenu);

    if (window.screen.width < barcode.C.TILE_SIZE_WINDOW_SIZE_LIMITE) this.tileSize = barcode.C.TILE_SIZE_MOBILE;
    this.centerX = window.innerWidth / 2 -  this.tileSize / 2 ;
    this.centerY = window.innerHeight / 2 - this.tileSize / 2 - 70;

    var objIt = JSON.parse(localStorage.getItem('itemsStored'));
    if (typeof objIt !== 'undefined' && objIt !== null){
        barcode.items = objIt;
    }

    this.character = new barcode.Character();
    var objCh = JSON.parse(localStorage.getItem('characterStored'));
    if (typeof objCh !== 'undefined' && objCh !== null){
      this.character.loadFromJs(objCh);
    }else{
      this.character.loadFromPreset();
    }

  },

}

barcode.GameEngine = new barcode.GameEngine();
barcode.GameEngine.init();

setInterval(barcode.GameEngine.gameLoop,1000/60)
