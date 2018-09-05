'use strict';
var barcode = barcode || {};

barcode.Apath = function(){
  this.grid = [];
  this.currentF = 0;
  this.openList = {};
  this.goal = [];
  this.openCount = 0
  this.currentBrick = undefined;
  this.gridSizeX = 0;
  this.gridSizeY = 0;
  this.path = [];
};

barcode.Apath.prototype = {
  calcDistanceManhattan : function(tile1,tile2){
    var a = Math.abs(tile1.x - tile2.x);
    var b = Math.abs(tile1.y - tile2.y);
    return a + b;
  },

  pathToFollow :function (tile, grid){
    var result = [];
    result.push(tile);
    while(typeof this.grid[tile.y][tile.x].cameFrom !== 'undefined'){
       tile = this.grid[tile.y][tile.x].cameFrom;
       result.push(tile);
    }
    return result;
  },

  initializeAPath : function(start){
    this.openList = {};
    this.currentF = 0 ;
    this.openList[0] = [];
    this.openList[0].push('' + start[0] +'/' + start[1]);
    this.grid[start[1]][start[0]].cameFrom = undefined;
    this.grid[start[1]][start[0]].gScore = 0;
    this.gridSizeX = this.grid.length;
    this.gridSizeY = this.grid[0].length;
  },

  retrieveNextBrickToVisit : function(){
    var openListElt = undefined;
    while (typeof openListElt === 'undefined'){
      if (this.currentF in this.openList)
        openListElt = this.openList[this.currentF].pop();
      if (typeof openListElt === 'undefined' ) this.currentF++;
      if (this.currentF > 1000) return false;
    }
    var currentBrickXY = openListElt.split('/');
    this.currentBrick = this.grid[parseInt(currentBrickXY[1])][parseInt(currentBrickXY[0])];
    return true;
  },

  manageOpenList : function(){
    if (this.openList[this.currentF].length === 0) delete this.openList[this.currentF];
    this.openCount -= 1;
  },

  isGoalFounded : function(){
    if (this.currentBrick.x == this.goal[0] && this.currentBrick.y == this.goal[1]){
      this.path = this.pathToFollow(this.currentBrick,this.grid);
      return true;
    }
    return false;
  },

  retrieveDiagonalBricks : function(adjacentBrickList){
    //var adjacentBrickList = [];
    if (this.currentBrick.x-1 >=0 && this.currentBrick.y-1 >=0)
      adjacentBrickList.push({ y : this.currentBrick.y-1 , x :this.currentBrick.x-1,cost : 3});
    if (this.currentBrick.x-1 >=0 && this.currentBrick.y+1 < this.gridSizeY)
      adjacentBrickList.push({ y : this.currentBrick.y+1 , x :this.currentBrick.x-1,cost : 3});
    if (this.currentBrick.x+1 < this.gridSizeX && this.currentBrick.y-1 >=0)
      adjacentBrickList.push({ y : this.currentBrick.y-1 , x :this.currentBrick.x+1,cost : 3});
    if (this.currentBrick.x+1 < this.gridSizeY && this.currentBrick.y+1 < this.gridSizeY)
        adjacentBrickList.push({ y : this.currentBrick.y+1 , x :this.currentBrick.x+1,cost : 3});

    return adjacentBrickList;
  },

  retrieveAdjacentBricks : function(){
    var adjacentBrickList = [];
    if (this.currentBrick.x-1 >=0)
      adjacentBrickList.push({ y : this.currentBrick.y , x :this.currentBrick.x-1,cost : 2});
    if (this.currentBrick.x+1 < this.gridSizeY)
      adjacentBrickList.push({ y : this.currentBrick.y , x :this.currentBrick.x+1,cost : 2});
    if (this.currentBrick.y-1 >=0)
      adjacentBrickList.push({ y : this.currentBrick.y-1 , x :this.currentBrick.x,cost : 2});
    if (this.currentBrick.y+1 < this.gridSizeX)
      adjacentBrickList.push({ y : this.currentBrick.y+1 , x :this.currentBrick.x,cost : 2});
    if (this.withDiagonals){
      return this.retrieveDiagonalBricks(adjacentBrickList);
    }
    return adjacentBrickList;
  },

  exploreAdjacentBricks : function(){
    var adjacentBrickList = this.retrieveAdjacentBricks();
    for(var i = 0 ; i < adjacentBrickList.length ; i++){
      if (typeof adjacentBrickList[i] !== 'undefined'){
        if (typeof this.grid[adjacentBrickList[i].y] !== 'undefined' ){
          var adjacentBrick = this.grid[adjacentBrickList[i].y][adjacentBrickList[i].x];
          if (typeof adjacentBrick !== 'undefined' && adjacentBrick.status !== "visited" && adjacentBrick.status !=="Obstacle"){
            var gScore = this.currentBrick.G + adjacentBrickList[i].cost;
            if (adjacentBrick.G == -1 || gScore < adjacentBrick.G){
              adjacentBrick.cameFrom = this.currentBrick;
              adjacentBrick.G = gScore;
              var fScore = gScore + this.calcDistanceManhattan(this.currentBrick,adjacentBrick);
              adjacentBrick.F = fScore;
              if (! (fScore in this.openList)) this.openList[fScore] = [];
              if (! ( ('' + adjacentBrick.x + "/" + adjacentBrick.y) in this.openList[fScore] ))
                this.openList[fScore].push('' + adjacentBrick.x + "/" + adjacentBrick.y);
                this.openCount++;
              }
          }
        }
      }
    }
  },

  findShortestPath :function(start, goal,grid,withDiagonals){
    this.grid = grid;
    this.goal = goal;
    this.withDiagonals = withDiagonals;
    this.initializeAPath(start);

    this.openCount = 1;
    while(this.openCount > 0){
      if (!this.retrieveNextBrickToVisit()){
        return false;
      }
      this.manageOpenList();
      if (this.isGoalFounded()){
        return true;
      }

      this.grid[this.currentBrick.y][this.currentBrick.x].status = "visited";
      var adjacentBrickList = this.exploreAdjacentBricks();
    }
    console.log("no path found");
    return false;
  }

}
