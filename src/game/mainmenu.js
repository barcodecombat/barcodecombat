'use strict';
var barcode = barcode || {};

barcode.MainMenu = function(){
  this.ctx = undefined;
  this.buttonCoord = [{ "x" : 150 ,
                    "y" :  200 ,
                    "width" : 230, 
                    "height" : 50,
                    "state" : true,
                    "name" : "Donjon"},
                    { "x" : 150 ,
                    "y" : 300 ,
                    "width" : 230, 
                    "height" : 50,
                    "state" : true,
                    "name" : "Inventaire"},
                    { "x" : 150 ,
                    "y" : 400 ,
                    "width" : 230, 
                    "height" : 50,
                    "state" : true,
                    "name" : "Fiche"},
                    { "x" : 150 ,
                    "y" : 500 ,
                    "width" : 230, 
                    "height" : 50,
                    "state" : true,
                    "name" : "Scan"},
                ];
};

barcode.MainMenu.prototype = {
  init : function(){

  },

  clickEvent : function(evt){
    for (let i = 0; i < this.buttonCoord.length ; i++){
        if (evt.pageX > this.buttonCoord[i].x && evt.pageX < (this.buttonCoord[i].x + this.buttonCoord[i].width)
                && evt.pageY > this.buttonCoord[i].y && evt.pageY < (this.buttonCoord[i].y + this.buttonCoord[i].height)
                && this.buttonCoord[i].state){
            if(this.buttonCoord[i].name === "Inventaire"){
                barcode.gameEngine.initHero();
            }else if(this.buttonCoord[i].name === "Donjon"){
                barcode.gameEngine.initDonjon();
            }else if(this.buttonCoord[i].name === "Scan"){
                barcode.gameEngine.initScan();
            }else if(this.buttonCoord[i].name === "Fiche"){
              barcode.gameEngine.initFiche();
            }
        }
    }
  },

  drawButtons : function(){
    for (let i = 0; i < this.buttonCoord.length ; i++){
        this.ctx.fillStyle = barcode.C.COLOR_CONTEXTUAL;
        this.ctx.fillRect(this.buttonCoord[i].x, this.buttonCoord[i].y, this.buttonCoord[i].width, this.buttonCoord[i].height);
        this.ctx.beginPath();
        this.ctx.strokeStyle = barcode.C.COLOR_TURQUOISE;
        this.ctx.rect(this.buttonCoord[i].x, this.buttonCoord[i].y, this.buttonCoord[i].width, this.buttonCoord[i].height);
        this.ctx.stroke(); 
        this.buttonCoord[i].state = true;
        let text = this.buttonCoord[i].name;
        this.ctx.fillStyle = barcode.C.COLOR_TURQUOISE;
        if (this.buttonCoord[i].name == "Scan"){
            text += " : " +  barcode.gameEngine.character.tickets.length + " left";
            if (barcode.gameEngine.character.tickets.length == 0){
                this.ctx.fillStyle = barcode.C.COLOR_GRADIANT_RED;
                this.buttonCoord[i].state = false;
            }
        }
        
        
        this.ctx.font = "20px Verdana";
        this.ctx.fillText(text ,
            this.buttonCoord[i].x + 25 , 
            this.buttonCoord[i].y + 35);
    }
  },

  drawRect : function(){
    this.ctx.beginPath();
    this.ctx.fillStyle = barcode.C.COLOR_UI_BACKGROUND;
    this.ctx.fillRect(50,50,450,600);
  
  },

  render : function(){
    this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
    this.drawRect();
    this.drawButtons();
  },
};