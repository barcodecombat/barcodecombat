'use strict';
var barcode = barcode || {};

barcode.Generator = function(){
  this.rooms = [];
  this.canvasTile = undefined;
  this.tileSet = undefined;
  this.heroSprite = undefined;
  this.mobSprite = undefined;
  this.allSprites = [];
  this.maxX = 0;
  this.maxY = 0;
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

  getTiles : function(){
    var tiles = {};
    var maxX = 0, maxY = 0;
    barcode.Generator.rooms.forEach(function(room){
      room.tiles.forEach(function(tile){
        tiles[tile.x + "/" + tile.y] = tile;
        if (tile.x > maxX) maxX = tile.x;
        if (tile.y > maxY) maxY = tile.y;
      });
    });

    barcode.Generator.maxX = maxX;
    barcode.Generator.maxY = maxY;
    return tiles;
  },

  createWholeMap : function(){
    var tiles = barcode.Generator.getTiles();
    let grid = [];
    for (var i=0;i<this.maxY;i++){
      grid[i] = [];
    }

    for (let i=0;i<this.maxY;i++){
      for (let j=0;j<this.maxX;j++){
        let brick = {'x' : j, 'y' : i, 'F' : -1, 'G' : -1, 'status' : 'Obstacle','cameFrom' : {}};
        if (( j + "/" + i) in tiles){
          if(tiles[j + "/" + i].ttile == 1)
            brick.status = 'Empty';
        }
        grid[i][j] = brick;
      }
    }
    console.log(grid);
    return grid;
  },

  createCorridor : function(){
    barcode.Generator.allTiles = barcode.Generator.createWholeMap();
    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([barcode.Generator.rooms[0].door.x,barcode.Generator.rooms[0].door.y],
      [barcode.Generator.rooms[1].door.x,barcode.Generator.rooms[1].door.y], barcode.Generator.allTiles,false);
    console.log(result);

    var ctx = barcode.Generator.canvasTile.getContext("2d");
    barcode.Generator.allTiles.forEach(function(tile){
      ctx.beginPath();
      ctx.lineWidth="4";
      let col = (tile.F * 10).toString(16);
      ctx.strokeStyle = "#" + col + "aaaa";
      ctx.rect(tile.x * 32,tile.y * 32,32,32);
      ctx.stroke();
    });


  },

  createRoom : function(){
    var room = new barcode.Room();
    room.init();
    this.putRoom(room);

    room.alignTiles();
    room.addDoor();
    barcode.Generator.rooms.push(room);
  },

  generateLevel : function(){
    barcode.Generator.rooms = [];
    //var nbRoom = Math.floor(Math.random()*3) + 2;
    var nbRoom = 2;
    for(let i = 0 ; i < nbRoom ; i++){
      barcode.Generator.createRoom();
    }
    barcode.Generator.rooms[0].addStartingPoint();
    barcode.Generator.createCorridor();
    return barcode.Generator.generateJson();
  },

  init : function(){

  },

  storeLevel : function(){
    var toStore = {};
    toStore.rooms = barcode.Generator.rooms;
    localStorage.setItem('levelStored', JSON.stringify(toStore));
  },

  retrieveLevel : function(){
    var obj = JSON.parse(localStorage.getItem('levelStored'));

    barcode.Generator.rooms = [];
    obj.rooms.forEach(function(roomStored){
      var newRoom = new barcode.Room();
      newRoom.sizeX = roomStored.sizeX;
      newRoom.sizeY = roomStored.sizeY;
      newRoom.x = roomStored.x;
      newRoom.y = roomStored.y;
      newRoom.door = roomStored.door;
      if (typeof roomStored.startingPoint !== 'undefined')
        newRoom.startingPoint = roomStored.startingPoint;

      roomStored.tiles.forEach(function(tileStored){
        let tempTile = new barcode.Tile();
        tempTile.x = tileStored.x;
        tempTile.y =  tileStored.y;
        tempTile.ttile = tileStored.ttile;
        newRoom.tiles.push(tempTile);
      });
      barcode.Generator.rooms.push(newRoom);
    })
    barcode.Generator.clearCanvas();
    barcode.Generator.rooms.forEach(function(elt){
          elt.render();
    });
    barcode.Generator.createCorridor();

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
    let btnStore = document.getElementById("btnStore");
    if (typeof btnStore !== 'undefined' && btnStore != null)
        btnStore.addEventListener("click",barcode.Generator.storeLevel);
    let btnRetrieve = document.getElementById("btnRetrieve");
    if (typeof btnRetrieve !== 'undefined' && btnRetrieve != null)
        btnRetrieve.addEventListener("click",barcode.Generator.retrieveLevel);
    this.canvasTile = document.getElementById("layerTile");
    this.setCanvasSize(window.innerWidth,window.innerHeight);
  }
};

/*barcode.Generator = new barcode.Generator();
barcode.Generator.init();
setInterval(barcode.Generator.gameLoop,1000/60)
*/
