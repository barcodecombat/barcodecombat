'use strict';
var barcode = barcode || {};

barcode.GameEngine = function (){
  this.tileSet = null;
  this.level = null;
  this.character = null;
  this.loaded = false;
}

barcode.GameEngine.prototype ={

  gameLoop: function (obj){
    if (! barcode.GameEngine.loaded ) return;
    barcode.GameEngine.character.move();
    barcode.GameEngine.render();
  },

  clickEvent : function(evt){
    let grid = barcode.GameEngine.level.aPathArray();
    let tileChar = barcode.GameEngine.character.getTile();

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
    barcode.GameEngine.character.path = pthFinding.path;
  },

  init : function(){
    this.character = new barcode.Character();
    this.character.init();
    this.tileSet = new Image();
    this.tileSet.src = "./assets/tileset/tileset1.png";
    const instance = this;
    this.tileSet.addEventListener("load",function(e){instance.loaded = true;});
    this.level = new barcode.Level();
    this.level.init(barcode.maps.map1);
    let canvas = document.getElementById("layer1");
    canvas.width = 500;
    canvas.height = 500;
    canvas.addEventListener("click",barcode.GameEngine.clickEvent);
  },



  render : function(){
      let canvas = document.getElementById("layer1");
      let context = canvas.getContext("2d");
      this.level.render(this.tileSet, context)
      this.character.render(context);
    }

}
barcode.GameEngine = new barcode.GameEngine();

barcode.GameEngine.init();
//barcode.GameEngine.gameLoop();
setInterval(barcode.GameEngine.gameLoop,1000/60)
