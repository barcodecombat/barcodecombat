'use strict';
var barcode = barcode || {};

barcode.Generator = function(){
  this.rooms = [];
  this.tiles = [];
  this.listOfTilesToUse = [];
  this.allTiles = [];
  this.corridorTile = [];
  this.maxX = 0;
  this.maxY = 0;
};

barcode.Generator.prototype = {

  generateRoom : function(){
    let room = new barcode.Room();
    room.createRoom();
    this.rooms.push(room);
  },

  placeFirstRoom : function(){
    this.rooms[0].x = 50;
    this.rooms[0].y = 50;
    this.rooms[0].alignTiles();
    this.rooms[0].addStartingPoint();
    this.rooms[0].addMobs();
    this.rooms[0].addDecor();
  },

  placeRooms : function(){
    this.corridorTile = [];
    this.placeFirstRoom();

    let previousDoorPos = this.rooms[0].addRandomDoor();

    for (let i=1; i < this.rooms.length ; i++){
      let XX = Math.floor(Math.random() * 5) + 3;
      let YY = Math.floor(Math.random() * 5) + 3;
     
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
      if (i != (this.rooms.length-1)){
        previousDoorPos= this.rooms[i].addRandomDoor(previousDoorPos);
      }else{
        // le coffre dans la dernière salle
        this.rooms[i].addChest();
      }
      // la première salle ne contient qu'une seule porte
      if (i==1){
        this.createCorridor(this.rooms[i-1],this.rooms[i],this.rooms[i-1].doors[0],this.rooms[i].doors[0]);
      }else{
        this.createCorridor(this.rooms[i-1],this.rooms[i],this.rooms[i-1].doors[1],this.rooms[i].doors[0]);
      }

      this.rooms[i].addMobs();
      this.rooms[i].addDecor();
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
        let brick = {'x' : j, 'y' : i, 'F' : -1, 'G' : -1, 'status' : 'Empty','cameFrom' : {} , 'tiletype' : 'Empty'};
        if (( j + "/" + i) in tiles){
           if(this.listOfTilesToUse.wall.indexOf(tiles[j + "/" + i].ttile) > -1 ){
             brick.status = 'Obstacle';
          }else if (this.listOfTilesToUse.ground.indexOf(tiles[j + "/" + i].ttile) > -1 ){
            brick.tiletype = 'Ground';
          }
        }
        grid[i][j] = brick;
      }
    }
    return grid;
  },

  createCorridor : function(room1,room2,door1,door2){
    this.allTiles = this.createWholeMap();
    var pthFinding = new barcode.Apath();
    var result =  pthFinding.findShortestPath([door1.x,door1.y],
      [door2.x,door2.y], this.allTiles,false);
    var path = pthFinding.path;
    path.splice(0,1);
    path.splice(-1,1);
    var _this = this;
    path.forEach(function(tilePath){
      if (typeof _this.allTiles[tilePath.y][tilePath.x] !== 'undefined' && _this.allTiles[tilePath.y][tilePath.x].tiletype !== 'Ground'){
        let tempTile = new barcode.Tile();
        tempTile.x = tilePath.x;
        tempTile.y = tilePath.y;
        tempTile.ttile = 3;
        _this.corridorTile.push(tempTile);
      }
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
    this.listOfTilesToUse = barcode.tilesets[barcode.gameDonjon.donjon.tileset];
    let nbRooms = Math.floor(Math.random()*barcode.gameDonjon.donjon.nbRoom) + 3;
    console.log("nombre de pièces :" + nbRooms);
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
      itRoom.mobs.forEach(function(elt){
        mobs.push(elt);
      });
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

