'use strict';
var barcode = barcode || {};

barcode.Generator = function(){
  this.rooms = [];
  this.canvasTile = undefined;
  this.tileSet = undefined;
  this.listOfTilesToUse = undefined;
  this.heroSprite = undefined;
  this.mobSprite = undefined;
  this.allSprites = [];
  this.maxX = 0;
  this.maxY = 0;
  this.corridorTile = [];
  this.decors = [];
};

barcode.Generator.prototype = {
  setCanvasSize : function(width, height){
    barcode.Generator.canvasTile.width = width;
    barcode.Generator.canvasTile.height = height;
  },

  clearCanvas : function(){
    if (typeof barcode.Generator.canvasTile !== 'undefined') {
      let context = barcode.Generator.canvasTile.getContext("2d");
      context.clearRect(0, 0, barcode.Generator.canvasTile.width, barcode.Generator.canvasTile.height);
    }
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
    var decors = [];
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
      itRoom.decors.forEach(function(elt){
        let dec = {"templateId" : elt.templateId, "x" : elt.x, "y" : elt.y};
        decors.push(dec);
      });
    });
    barcode.Generator.corridorTile.forEach(function (tile){
      tiles.push(tile);
    });
    if (mobs.length > 0) result['mobs'] = mobs;
    result['tiles'] = tiles;
    result['decors'] = decors;

    return result;
  },

  putRoom : function(room){
    var isCollided = true;
    var it = 0;
    while (isCollided && it < 100){
      room.x = Math.floor(Math.random() * 20 * barcode.Generator.rooms.length) + 1;/// barcode.GameEngine.tileSize);
      room.y = Math.floor(Math.random() * 20 * barcode.Generator.rooms.length) + 1;// / barcode.GameEngine.tileSize);
      isCollided = false;
      for (let i = 0 ; i < this.rooms.length && isCollided == false; i++){
        if (room !== barcode.Generator.rooms[i]){
          isCollided = room.roomCollision(barcode.Generator.rooms[i]);
        }
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

    barcode.Generator.maxX = maxX+2;
    barcode.Generator.maxY = maxY+2;
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
        let brick = {'x' : j, 'y' : i, 'F' : -1, 'G' : -1, 'status' : 'Empty','cameFrom' : {}};
        if (( j + "/" + i) in tiles){
           if(this.listOfTilesToUse.wall.indexOf(tiles[j + "/" + i].ttile) > -1 ){
             brick.status = 'Obstacle';
          }
        }
        grid[i][j] = brick;
      }
    }
    return grid;
  },

  createCorridor : function(room1,room2){
    barcode.Generator.allTiles = barcode.Generator.createWholeMap();
    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([room1.door.x,room1.door.y],
      [room2.door.x,room2.door.y], barcode.Generator.allTiles,false);
      //[barcode.Generator.rooms[0].startingPoint.x,barcode.Generator.rooms[0].startingPoint.y], barcode.Generator.allTiles,false);
    var path = pthFinding.path;
    path.splice(0,1);
    path.splice(-1,1);

    path.forEach(function(tilePath){
      let tempTile = new barcode.Tile();
      tempTile.x = tilePath.x;
      tempTile.y = tilePath.y;
      tempTile.ttile = 3;
      barcode.Generator.corridorTile.push(tempTile);
    })
  },

  createCorridors : function(){
    for (let i = 0 ; i < (barcode.Generator.rooms.length-1) ; i++){
      barcode.Generator.createCorridor(barcode.Generator.rooms[i],barcode.Generator.rooms[i+1]);
    }
  },

  createRoom : function(){
    var room = new barcode.Room();
    room.init();
    if (barcode.Generator.rooms.length == 0 ){
        room.x = 2;
        room.y = 2;
    }else{
      this.putRoom(room);
    }
    room.alignTiles();
    room.addDoor();

    barcode.Generator.rooms.push(room);
  },

  generateLevel : function(){
    let tileSetIndex = Math.round(Math.random() * (barcode.tilesets.length-1));
    barcode.Generator.listOfTilesToUse = barcode.tilesets[tileSetIndex];
    barcode.Generator.clearCanvas();
    barcode.Generator.rooms = [];
    barcode.Generator.corridorTile = [];
    var nbRoom = Math.floor(Math.random()*10) + 5;
    //var nbRoom = 3;
    for(let i = 0 ; i < nbRoom ; i++){
      barcode.Generator.createRoom();
    }
    barcode.Generator.rooms[0].addStartingPoint();
    barcode.Generator.rooms[barcode.Generator.rooms.length-1].addChest();
    //barcode.Generator.rooms[0].addChest();
    barcode.Generator.createCorridors();
    barcode.Generator.render();
    return barcode.Generator.generateJson();
  },

  render : function(){
    if (typeof barcode.Generator.canvasTile !== 'undefined'){
      barcode.Generator.clearCanvas();
      barcode.Generator.rooms.forEach(function(elt){
            elt.render();
      });
      var ctx = barcode.Generator.canvasTile.getContext("2d");
      barcode.Generator.corridorTile.forEach(function(tile){
        var elt = barcode.tiles[tile.ttile];
        ctx.drawImage(
           barcode.Generator.tileSet,
           elt.x,
           elt.y,
           elt.size,
           elt.size,
           tile.x*barcode.C.TILE_SIZE_PC,
           tile.y*barcode.C.TILE_SIZE_PC,
           barcode.C.TILE_SIZE_PC,
           barcode.C.TILE_SIZE_PC);
      });
/*
      var ctx = barcode.Generator.canvasTile.getContext("2d");
      barcode.Generator.allTiles.forEach(function(raw){
        raw.forEach(function(tile){
          if (tile.status == "visited"){
            ctx.beginPath();
            ctx.lineWidth="6";
            let col = (tile.F * 10).toString(16);
            ctx.strokeStyle = "#" + col + "aaaa";
            ctx.rect(tile.x * 32,tile.y * 32,32,32);
            ctx.stroke();
          }
        });
      });*/
    }
  },

  init : function(){
  },

  storeLevel : function(){
    var toStore = {};
    toStore.rooms = barcode.Generator.rooms;
    toStore.corridorTile = barcode.Generator.corridorTile;
    localStorage.setItem('levelStored', JSON.stringify(toStore));
  },

  retrieveLevel : function(){
    var obj = JSON.parse(localStorage.getItem('levelStored'));
    barcode.Generator.rooms = [];
    this.corridorTile = [];
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
    });
    obj.corridorTile.forEach(function(tileStored){
      let tempTile = new barcode.Tile();
      tempTile.x = tileStored.x;
      tempTile.y =  tileStored.y;
      tempTile.ttile = tileStored.ttile;
      barcode.Generator.corridorTile.push(tempTile);
    });
    barcode.Generator.render();

  },

  initFromEditor : function(){
    barcode.tileset = new barcode.Tileset();
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
