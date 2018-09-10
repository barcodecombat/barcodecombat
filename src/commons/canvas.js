'use strict';
var barcode = barcode || {};

barcode.Canvas = function (){
  this.canvasTile = undefined;
  this.canvasCreature = undefined;
  this.canvasAnimation = undefined;
  this.canvasMouse = undefined;
};

barcode.Canvas.prototype ={
  init : function(){
    this.canvasTile = document.getElementById("layerTile");
    this.canvasCreature = document.getElementById("layerCreature");
    this.canvasAnimation = document.getElementById("layerAnimation");
    this.canvasMouse = document.getElementById("layerMouse");
    this.setCanvasSize(window.innerWidth,window.innerHeight);
  },

  setCanvasSize : function(width, height){
    this.canvasTile.width = width;
    this.canvasTile.height = height;
    this.canvasCreature.width = width;
    this.canvasCreature.height = height;
    this.canvasAnimation.width = width;
    this.canvasAnimation.height = height;
    this.canvasMouse.width = width;
    this.canvasMouse.height = height;
  },

  clearCanvas : function(){
    let context = this.canvasTile.getContext("2d");
    context.clearRect(0, 0, this.canvasTile.width, this.canvasTile.height);
    context = this.canvasCreature.getContext("2d");
    context.clearRect(0, 0, this.canvasCreature.width, this.canvasCreature.height);
    context = this.canvasAnimation.getContext("2d");
    context.clearRect(0, 0, this.canvasAnimation.width, this.canvasAnimation.height);
  },
};
