'use strict';
var barcode = barcode || {};

barcode.GameEngine = function (){
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
    barcode.canvas.clearCanvas();
    if (barcode.gameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
        barcode.gameDonjon.loop();
    }else if (barcode.gameEngine.state === barcode.C.STATE_DONJON_DEATH){
      barcode.gameEngine.showDeath();
    }else if (barcode.gameEngine.state === barcode.C.STATE_MENU_SHOWN){
      barcode.mainMenu.render(); 
    }else if (barcode.gameEngine.state === barcode.C.STATE_MENU_ENDDONJON_TOSHOW){
      barcode.gameEngine.showEndDonjon();
    }else if(barcode.gameEngine.state == barcode.C.STATE_INVENTORY){
      barcode.inventory.render();
    }else if(barcode.gameEngine.state == barcode.C.STATE_SCAN_RESULT){
      barcode.showItemGenerated.render();
    }else if(barcode.gameEngine.state == barcode.C.STATE_SHOW_PROPERTIES){
      barcode.fichePerso.render();
    }else if(barcode.gameEngine.state == barcode.C.STATE_SHOW_DONJONPATH){
      barcode.donjonPath.render();
    }
  },

  clickEvent : function(evt){
    if(barcode.gameEngine.state == barcode.C.STATE_INVENTORY){
      barcode.inventory.clickEvent(evt);
    }else if(barcode.gameEngine.state == barcode.C.STATE_MENU_SHOWN){
      barcode.mainMenu.clickEvent(evt);
    }else if(barcode.gameEngine.state == barcode.C.STATE_SHOW_DONJONPATH){
      barcode.donjonPath.clickEvent(evt);
    }

  },

  closeState : function(){
    if (barcode.gameEngine.state === barcode.C.STATE_SCAN_INPROGRESS && barcode.gameEngine.readcodebar != null){
      barcode.gameEngine.readcodebar.stop();
    }
    else if (barcode.gameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
      barcode.canvas.clearCanvas();
    }
    else if(barcode.gameEngine.state == barcode.C.STATE_INVENTORY){
      barcode.inventory.init();
    }
    else if(barcode.gameEngine.state == barcode.C.STATE_MENU_DEATH){
      var menu = document.getElementById("death");
      menu.style.display = "none";
    }else if(barcode.gameEngine.state == barcode.C.STATE_MENU_ENDDONJON){
      var menu = document.getElementById("enddonjon");
      menu.style.display = "none";
    }else if(barcode.gameEngine.state == barcode.C.STATE_SCAN_RESULT){
      barcode.canvas.clearCanvas();
    }
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

  initDonjon : function(donjonId){
    barcode.gameEngine.closeState();
    barcode.gameDonjon.init(donjonId);
    barcode.gameEngine.state = barcode.C.STATE_DONJON_INPROGRESS;
    barcode.gameEngine.character.reset();
  },

  initMenu : function(){
    barcode.gameEngine.closeState();
    barcode.gameEngine.state = barcode.C.STATE_MENU_SHOWN;
  },

  initHero : function(){
    barcode.gameEngine.closeState();
    if (typeof barcode.inventory === 'undefined' || barcode.inventory === null)
      barcode.inventory = new barcode.Inventory();
    barcode.inventory.init();
    barcode.gameEngine.state = barcode.C.STATE_INVENTORY;
  },

  initFiche : function(){
    barcode.gameEngine.closeState();
    barcode.gameEngine.state = barcode.C.STATE_SHOW_PROPERTIES;
  },

  initDonjonPath : function(){
    barcode.gameEngine.closeState();
    barcode.gameEngine.state = barcode.C.STATE_SHOW_DONJONPATH;
    barcode.donjonPath.init();
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
    barcode.showItemGenerated.init(itemGenerated);
    barcode.gameEngine.saveGame();
  },

  scanItem : function(){
    barcode.gameEngine.generateItem();

  },

  init : function(){
    barcode.generator = new barcode.Generator();
    barcode.gameDonjon = new barcode.GameDonjon();
    barcode.RenderItem = new barcode.RenderItem();
    barcode.canvas = new barcode.Canvas();
    barcode.canvas.init();
    barcode.canvas.setCanvasSize(window.innerWidth,window.innerHeight);
    barcode.tileset = new barcode.Tileset();
    barcode.mainMenu = new barcode.MainMenu();
    barcode.fichePerso = new barcode.FichePerso();
    barcode.contextualItem = new barcode.ContextualItem();
    barcode.showItemGenerated = new barcode.ShowItemGenerated();
    barcode.donjonPath = new barcode.DonjonPath();
    barcode.gameEngine.state = barcode.C.STATE_MENU_SHOWN;
    let btnMenu = document.getElementById("btnMenu");
    btnMenu.addEventListener("click",barcode.gameEngine.initMenu);
    let btnSave = document.getElementById("btnSave");
    btnSave.addEventListener("click",barcode.gameEngine.saveGame);
    let btnGenerate = document.getElementById("btnGenerate");
    btnGenerate.addEventListener("click",barcode.gameEngine.scanItem);
    let butnScan = document.getElementById("buttonScan");
    butnScan.addEventListener("click",barcode.gameEngine.scanItem);
    let btnDeathBack = document.getElementById("btnBackToMenu");
    btnDeathBack.addEventListener("click",barcode.gameEngine.initMenu);
    let btnEndDonjonBack = document.getElementById("btnBackToMenu2");
    btnEndDonjonBack.addEventListener("click",barcode.gameEngine.initMenu);
    barcode.canvas.canvasMouse.addEventListener("click",barcode.gameEngine.clickEvent);

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
