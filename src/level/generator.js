'use strict';
var barcode = barcode || {};

barcode.Generator = function(){
  this.rooms = [];
  this.canvasTile = undefined;
  this.tileSet = undefined;
  this.heroSprite = undefined;
  this.mobSprite = undefined;
};

barcode.Generator.prototype = {
  setCanvasSize : function(width, height){
    this.canvasTile.width = width;
    this.canvasTile.height = height;
  },

  clearCanvas : function(){
    let context = this.canvasTile.getContext("2d");
    context.clearRect(0, 0, this.canvasTile.width, this.canvasTile.height);
  },

  gameLoop : function(){
    barcode.Generator.clearCanvas();
    barcode.Generator.rooms.forEach(function(elt){
          elt.render();
    });
  },

  generateJson : function(){
    var tiles = [];
    var mobs = [];
    var result = {};
    barcode.Generator.rooms.forEach(function(itRoom){
      itRoom.tiles.forEach(function(elt){
        tiles.push(elt);
      });
      if (typeof itRoom.startingPoint !== 'undefined'){
        result['startingpoint'] = itRoom.startingPoint;
      }
      itRoom.mobs.forEach(function(elt){
        mobs.push(elt);
      });
    });
    if (mobs.length > 0) result['mobs'] = mobs;
    result['tiles'] = tiles;
    console.log(result);
    return result;
  },


  putRoom : function(room){
    var isCollided = true;
    var it = 0;
    while (isCollided && it < 100){
      room.x = Math.floor(Math.random() * 20 * barcode.Generator.rooms.length);/// barcode.GameEngine.tileSize);
      room.y = Math.floor(Math.random() * 20 * barcode.Generator.rooms.length);// / barcode.GameEngine.tileSize);
      isCollided = false;
      for (let i = 0 ; i < this.rooms.length && isCollided == false; i++){
        isCollided = room.roomCollision(barcode.Generator.rooms[i]);
      }
      it++;
    }

  },

  createRoom : function(){
    var room = new barcode.Room();
    room.init();
    this.putRoom(room);
    room.alignTiles();
    barcode.Generator.rooms.push(room);
  },

  generateLevel : function(){
    barcode.Generator.rooms = [];
    var nbRoom = Math.floor(Math.random()*3) + 2;
    for(let i = 0 ; i < nbRoom ; i++){
      this.createRoom();
    }
    barcode.Generator.rooms[0].addStartingPoint();
    return this.generateJson();
  },

  init : function(){

  },

  initFromEditor : function(){
    this.tileSet = new Image();
    this.tileSet.src = "./assets/tileset/tileset1.png";
    this.heroSprite = new Image();
    this.heroSprite.src = "assets/sprites/fille.png";
    this.mobSprite = new Image();
    this.mobSprite.src = "assets/sprites/bolt.png";
    let btnGenerate = document.getElementById("btnGenerate");
    if (typeof btnGenerate !== 'undefined' && btnGenerate != null)
      btnGenerate.addEventListener("click",barcode.Generator.generateLevel);
    this.canvasTile = document.getElementById("layerTile");
    this.setCanvasSize(window.innerWidth,window.innerHeight);
  }
};

/*barcode.Generator = new barcode.Generator();
barcode.Generator.init();
setInterval(barcode.Generator.gameLoop,1000/60)
*/
