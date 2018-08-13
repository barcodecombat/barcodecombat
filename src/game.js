'use strict';
var barcode = barcode || {};

barcode.GameEngine = function (){
  this.tileSet = null;
  this.level = null;
  this.loaded = false;
  this.state = barcode.C.STATE_MENU_SHOWN;
}

barcode.GameEngine.prototype ={

  gameLoop: function (){
    console.log(barcode.GameEngine.state);
    if (barcode.GameEngine.state === barcode.C.STATE_DONJON_INPROGRESS){
        if (! barcode.GameEngine.loaded ) return;
          barcode.GameEngine.render();
    }
  },

  clickEvent : function(evt){
    let grid = barcode.GameEngine.level.aPathArray();
    let tileChar = barcode.GameEngine.level.character.getTile();

    // TODO : FActorize convert posX to tileX
    let tx = Math.floor(evt.pageX/32);
    let ty = Math.floor(evt.pageY/32);

    //console.log("Start is " + tileChar.x + "/" + tileChar.y);
    //console.log("Goal is " + tx + "/" + ty);

    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([tileChar.x,tileChar.y],[tx,ty], grid);

    /*console.log("result is ");

    pthFinding.path.forEach(function(elt){
        console.log(elt);
    });
    console.log("%%%%%%%");*/
    barcode.GameEngine.level.character.path = pthFinding.path;
  },

  initDonjon : function(){
    barcode.GameEngine.tileSet = new Image();
    barcode.GameEngine.tileSet.src = "./assets/tileset/tileset1.png";
    const instance = barcode.GameEngine;
    barcode.GameEngine.tileSet.addEventListener("load",function(e){instance.loaded = true;});
    barcode.GameEngine.level = new barcode.Level();
    barcode.GameEngine.level.init(barcode.maps.map1);
    let canvas = document.getElementById("layer1");
    canvas.width = 500;
    canvas.height = 500;
    canvas.addEventListener("click",barcode.GameEngine.clickEvent);
    barcode.GameEngine.state = barcode.C.STATE_DONJON_INPROGRESS;
    //setInterval(barcode.GameEngine.gameLoop,1000/60);
  },


  initMenu : function(){
    barcode.GameEngine.state = barcode.C.STATE_MENU_SHOWN;
    let canvas = document.getElementById("layer1");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
  },

  init : function(){
    let btnMenu = document.getElementById("btnMenu");
    btnMenu.addEventListener("click",barcode.GameEngine.initMenu);
    let btnDonjon = document.getElementById("btnDonjon");
    btnDonjon.addEventListener("click",barcode.GameEngine.initDonjon);
  },


  render : function(){
      let canvas = document.getElementById("layer1");
      let context = canvas.getContext("2d");
      this.level.render(this.tileSet, context)
    }

}
barcode.GameEngine = new barcode.GameEngine();
barcode.GameEngine.init();
setInterval(barcode.GameEngine.gameLoop,1000/60)
