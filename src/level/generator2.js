'use strict';
var barcode = barcode || {};

barcode.Generator2 = function(){
  this.rooms = [];
  this.tiles = [];
  this.listOfTilesToUse = [];
  this.allTiles = [];
  this.corridorTile = [];
  this.maxX = 0;
  this.maxY = 0;
};

barcode.Generator2.prototype = {

  generateRoom : function(){
    let room = new barcode.Room2();
    room.createRoom();
    this.rooms.push(room);
  },

  placeFirstRoom : function(){
    this.rooms[0].x = 50;
    this.rooms[0].y = 50;
    this.rooms[0].alignTiles();
    this.rooms[0].addStartingPoint();
  },

  placeRooms : function(){
    this.corridorTile = [];
    this.placeFirstRoom();

    let previousDoorPos = this.rooms[0].addRandomDoor();

    for (let i=1; i < this.rooms.length ; i++){
      //let XX = Math.floor(Math.random() * 5) + 1;
      //let YY = Math.floor(Math.random() * 5) + 1;
      let XX = 5;
      let YY = 5;
      if (previousDoorPos === barcode.C.DOOR_NORTH){
        this.rooms[i].x = this.rooms[i-1].x + XX;
        this.rooms[i].y = this.rooms[i-1].y - YY - this.rooms[i].sizeY;
        previousDoorPos = barcode.C.DOOR_SOUTH;
      }else if (previousDoorPos === barcode.C.DOOR_SOUTH){
        this.rooms[i].x = this.rooms[i-1].x + XX;
        this.rooms[i].y = this.rooms[i-1].y + YY + this.rooms[i-1].sizeY;
        previousDoorPos = barcode.C.DOOR_NORTH;
      }else if (previousDoorPos === barcode.C.DOOR_EAST){
        this.rooms[i].x = this.rooms[i-1].x + XX + this.rooms[i-1].sizeX;
        this.rooms[i].y = this.rooms[i-1].y + YY;
        previousDoorPos = barcode.C.DOOR_WEST;
      }
      this.rooms[i].alignTiles();
      this.rooms[i].addDoor(previousDoorPos);
      // Ne pas ajouter une porte de sortie sur la dernière salle.
      if (i != (this.rooms.length-1))
        this.rooms[i].addRandomDoor(previousDoorPos);
      // la première salle ne contient qu'une seule porte
      if (i==1){
        this.createCorridor2(this.rooms[i-1].doors[0],this.rooms[i].doors[0]);
      }else{
        this.createCorridor2(this.rooms[i-1].doors[1],this.rooms[i].doors[0]);
      }
    }
  },

  createWholeMap : function(){
    var tiles = this.getTiles();
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

  createCorridor2 : function(door1,door2){
    this.allTiles = this.createWholeMap();
    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([door1.x,door1.y],
      [door2.x,door2.y], this.allTiles,false);
    var path = pthFinding.path;
    path.splice(0,1);
    path.splice(-1,1);
    var _this = this;
    path.forEach(function(tilePath){
      let tempTile = new barcode.Tile();
      tempTile.x = tilePath.x;
      tempTile.y = tilePath.y;
      tempTile.ttile = 3;
      _this.corridorTile.push(tempTile);
    })
  },

  getTiles : function(){
    var tiles = {};
    var maxX = 0, maxY = 0;
    this.rooms.forEach(function(room){
      room.tiles.forEach(function(tile){
        tiles[tile.x + "/" + tile.y] = tile;
        if (tile.x > maxX) maxX = tile.x;
        if (tile.y > maxY) maxY = tile.y;
      });
    });
    
    this.maxX = maxX+2;
    this.maxY = maxY+2;
    return tiles;
  },

  generateLevel : function (){
    this.rooms = [];
    this.corridorTile = [];
    let tileSetIndex = Math.round(Math.random() * (barcode.tilesets.length-1));
    this.listOfTilesToUse = barcode.tilesets[tileSetIndex];
    let nbRooms = Math.floor(Math.random()*10) + 5;
    console.log("nbRooms " + nbRooms);
    for (let i=0;i<nbRooms;i++){
      this.generateRoom();
    }
    this.placeRooms();

    return this.generateJson();
  },

  generateJson : function(){
    var tiles = [];
    var mobs = [];
    var decors = [];
    var result = {};
    this.rooms.forEach(function(itRoom){
      itRoom.tiles.forEach(function(elt){
        tiles.push(elt);
      });
      if (typeof itRoom.startingPoint !== 'undefined'){
        result['startingpoint'] = itRoom.startingPoint;
      }
     /* itRoom.mobs.forEach(function(elt){
        mobs.push(elt);
      });*/
      itRoom.decors.forEach(function(elt){
        let dec = {"templateId" : elt.templateId, "x" : elt.x, "y" : elt.y};
        decors.push(dec);
      });
    });
    this.corridorTile.forEach(function (tile){
      tiles.push(tile);
    });
    if (mobs.length > 0) result['mobs'] = mobs;
    result['tiles'] = tiles;
    result['decors'] = decors;

    return result;
  },
};

