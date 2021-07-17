'use strict';
var barcode = barcode || {};

barcode.ShowItemGenerated = function(){
    this.item = null;
};

barcode.ShowItemGenerated.prototype = {
    init : function(item){
        this.item = item;
    },

    render : function(){
        let temp = {
            "item" : this.item
        }
        barcode.contextualItem.item = temp;
        barcode.contextualItem.showMenu();
        this.item.render(250,80);
        barcode.contextualItem.render(false);
    },
};