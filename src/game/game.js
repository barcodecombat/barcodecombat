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
    if (barcode.gameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
        barcode.gameDonjon.loop();
    }else if (barcode.gameEngine.state === barcode.C.STATE_DONJON_DEATH){
      barcode.gameEngine.showDeath();
    }else if (barcode.gameEngine.state === barcode.C.STATE_MENU_TO_SHOW){
      barcode.gameEngine.initMenu();
    }else if (barcode.gameEngine.state === barcode.C.STATE_MENU_ENDDONJON_TOSHOW){
      barcode.gameEngine.showEndDonjon();
    }
  },

  closeState : function(){
    if (barcode.gameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.gameEngine.readcodebar != null){
      barcode.gameEngine.readcodebar.stop();
    }
    else if (barcode.gameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      barcode.canvas.clearCanvas();
      barcode.canvas.setCanvasSize(0,0);
    }
    else if(barcode.gameEngine.state == barcode.C.STATE_INVENTORY){
      barcode.inventory.eraseInventory();
      barcode.inventory.init();
      var menu = document.getElementById("inventory");
      menu.style.display = "none";
    }
    else if(barcode.gameEngine.state == barcode.C.STATE_MENU_SHOWN){
      var menu = document.getElementById("mainMenu");
      menu.style.display = "none";
    }else if(barcode.gameEngine.state == barcode.C.STATE_MENU_DEATH){
      var menu = document.getElementById("death");
      menu.style.display = "none";
    }else if(barcode.gameEngine.state == barcode.C.STATE_MENU_ENDDONJON){
      var menu = document.getElementById("enddonjon");
      menu.style.display = "none";
    }else if(barcode.gameEngine.state == barcode.C.STATE_SCAN_RESULT){
      var menu = document.getElementById("scanresult");
      menu.style.display = "none";
    }
    barcode.canvas.clearCanvas();
    barcode.canvas.setCanvasSize(0,0);
  },

  saveGame : function(){
    var ch = barcode.gameEngine.character.saveToJs();
    localStorage.setItem('characterStored', JSON.stringify(ch));
    localStorage.setItem('itemsStored', JSON.stringify(barcode.items));
  },

  showDeath : function(){
    barcode.gameEngine.closeState();
    var menu = document.getElementById("death");
    menu.style.display = "block";
    barcode.gameEngine.state = barcode.C.STATE_MENU_DEATH;
    barcode.gameEngine.saveGame();
  },

  showEndDonjon : function(){
    barcode.gameEngine.closeState();
    var menu = document.getElementById("enddonjon");
    menu.style.display = "block";
    barcode.gameEngine.state = barcode.C.STATE_MENU_ENDDONJON;
    var ticket = new barcode.Ticket();
    barcode.gameEngine.character.tickets.push(ticket);
    barcode.gameEngine.saveGame();
  },

  initDonjon : function(){
    barcode.gameEngine.closeState();
    barcode.gameDonjon.init();
    barcode.gameEngine.state = barcode.C.STATE_DONJON_INPROGRESS;
    barcode.gameEngine.character.resetHp();
  },

  initMenu : function(){
    barcode.gameEngine.closeState();
    barcode.gameEngine.state = barcode.C.STATE_MENU_SHOWN;
    var menu = document.getElementById("mainMenu");
    var btnScan = document.getElementById("btnScan");
    btnScan.innerHTML = "Scan : " + barcode.gameEngine.character.tickets.length + " left";
    if (barcode.gameEngine.character.tickets.length == 0){
      btnScan.disabled = true;
    }else{
      btnScan.disabled = false;
    }
    menu.style.display = "block";
  },

  initHero : function(){
    barcode.gameEngine.closeState();
    var menu = document.getElementById("inventory");
    menu.style.display = "block";
    if (typeof barcode.inventory === 'undefined' || barcode.inventory === null)
      barcode.inventory = new barcode.Inventory();
    barcode.inventory.init();
    barcode.inventory.render();
    barcode.gameEngine.state = barcode.C.STATE_INVENTORY;
  },

  initScan : function(){
    barcode.gameEngine.closeState();
    barcode.gameEngine.state = barcode.C.STATE_SCAN_INPROGRESS;
    if (barcode.gameEngine.readcodebar == null) barcode.gameEngine.readcodebar = new barcode.Readcodebar();
    barcode.gameEngine.readcodebar.start();
  },

  generateItem : function(val){
    if (typeof val === 'undefined' || val == null){
      val = Math.round(Math.random()*999999999);
    }
    var itemIndexExist = val in barcode.items;


    if (!itemIndexExist){
      var itemGenerator = new barcode.itemgenerator();
      itemGenerator.generate();
      barcode.items[val] = itemGenerator.item;
      barcode.gameEngine.character.addItemToCharacter(val);
      barcode.gameEngine.character.removeTicket();
      if (barcode.gameEngine.readcodebar != null)
        barcode.gameEngine.readcodebar.stop();
      barcode.gameEngine.showScanned(itemGenerator.item);
    }else{
      if (barcode.gameEngine.readcodebar != null)
        barcode.gameEngine.readcodebar.stop();
      barcode.gameEngine.showScanned();
    }
  },

  showScanned : function( itemGenerated){
    barcode.gameEngine.closeState();
    barcode.gameEngine.state = barcode.C.STATE_SCAN_RESULT;
    var menu = document.getElementById("scanresult");
    menu.style.display = "block";
    if (typeof itemGenerated !== 'undefined' || itemGenerated != null){
      var menu = document.getElementById("alreadyscanned");
      menu.style.display = "None";
      var div = document.getElementById("itemtoshow");
      div.style.display = "block";
      barcode.RenderItem.render(div,itemGenerated,200 , 100 );
    }else{
      var menu = document.getElementById("alreadyscanned");
      menu.style.display = "block";
      var div = document.getElementById("itemtoshow");
      div.style.display = "None";
    }
    barcode.gameEngine.saveGame();
  },

  scanItem : function(){
    barcode.gameEngine.generateItem();

  },

  init : function(){
    barcode.Generator = new barcode.Generator();
    barcode.Generator.init();
    barcode.gameDonjon = new barcode.GameDonjon();
    barcode.RenderItem = new barcode.RenderItem();
    barcode.canvas = new barcode.Canvas();
    barcode.canvas.init();
    barcode.tileset = new barcode.Tileset();
    barcode.gameEngine.state = barcode.C.STATE_MENU_SHOWN;
    let btnMenu = document.getElementById("btnMenu");
    btnMenu.addEventListener("click",barcode.gameEngine.initMenu);
    let btnDonjon = document.getElementById("btnDonjon");
    btnDonjon.addEventListener("click",barcode.gameEngine.initDonjon);
    let btnScan = document.getElementById("btnScan");
    btnScan.addEventListener("click",barcode.gameEngine.initScan);
    let btnSave = document.getElementById("btnSave");
    btnSave.addEventListener("click",barcode.gameEngine.saveGame);
    let btnHero = document.getElementById("btnHero");
    btnHero.addEventListener("click",barcode.gameEngine.initHero);
    let btnGenerate = document.getElementById("btnGenerate");
    btnGenerate.addEventListener("click",barcode.gameEngine.scanItem);
    let butnScan = document.getElementById("buttonScan");
    butnScan.addEventListener("click",barcode.gameEngine.scanItem);
    let btnDeathBack = document.getElementById("btnBackToMenu");
    btnDeathBack.addEventListener("click",barcode.gameEngine.initMenu);
    let btnEndDonjonBack = document.getElementById("btnBackToMenu2");
    btnEndDonjonBack.addEventListener("click",barcode.gameEngine.initMenu);
    let btnScanResultBack = document.getElementById("btnBackToMenu3");
    btnScanResultBack.addEventListener("click",barcode.gameEngine.initMenu);

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

    this.initMenu();



  },

}

barcode.gameEngine = new barcode.GameEngine();
barcode.gameEngine.init();

setInterval(barcode.gameEngine.gameLoop,1000/60)
