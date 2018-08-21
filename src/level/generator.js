'use strict';
var barcode = barcode || {};

barcode.Generator = function(){
  this.rooms = [];
  this.canvasTile = "undefined";
  this.tileSet = "undefined";
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

  generateLevel : function(){
    var room = new barcode.Room();
    room.init();
    barcode.Generator.rooms.push(room);
  },

  init : function(){
    this.tileSet = new Image();
    this.tileSet.src = "./assets/tileset/tileset1.png";
    let btnGenerate = document.getElementById("btnGenerate");
    btnGenerate.addEventListener("click",barcode.Generator.generateLevel);
    this.canvasTile = document.getElementById("layerTile");
    this.setCanvasSize(window.innerWidth,window.innerHeight);
  }
};

barcode.Generator = new barcode.Generator();
barcode.Generator.init();
setInterval(barcode.Generator.gameLoop,1000/60)
