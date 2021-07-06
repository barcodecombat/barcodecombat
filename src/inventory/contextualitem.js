'use strict';
var barcode = barcode || {};

barcode.ContextualItem = function (){
  this.active = false;
  this.item = null;
  this.height = 200;
  this.width = 150;
  this.x = 200;
  this.y = 150;
};

barcode.ContextualItem.prototype ={
    toggleMenu : function(){
        if(this.active) this.hideMenu()
        else this.showMenu();
    },

    showMenu : function(item){
        this.active = true;
    },

    hideMenu : function(){
        this.item = null;
        this.active = false;
    },

    clickEvent : function (){
        return false;
    },

    render : function(){
        if (this.item !== null && this.active === true){
            this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
            this.ctx.fillStyle = barcode.C.COLOR_TURQUOISE;
            this.ctx.fillRect(this.x,this.y,this.width,this.height);
            this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
            this.ctx.beginPath();
            this.ctx.rect(this.x,this.y,this.width,this.height);
            this.ctx.stroke(); 
        }
    },

};