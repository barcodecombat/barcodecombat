'use strict';
var barcode = barcode || {};

barcode.ShowItemGenerated = function(){
    this.item = null;
    this.ctx = null;
};

barcode.ShowItemGenerated.prototype = {
    init : function(item){
        this.item = item;
    },

    drawRect : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = barcode.C.COLOR_UI_BACKGROUND;
        this.ctx.fillRect(80,50,450,500);
      },

    render : function(){
        this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
        this.drawRect();
        let temp = {
            "item" : this.item
        }
        barcode.contextualItem.item = temp;
        barcode.contextualItem.showMenu();
        this.item.render(280,80);
        barcode.contextualItem.render(false);
        
    },
};