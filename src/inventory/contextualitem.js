'use strict';
var barcode = barcode || {};

barcode.ContextualItem = function (){
    this.active = false;
    this.ctx = null;
    this.item = null;
    this.height = 200;
    this.width = 150;
    this.x = 200;
    this.y = 150;
    this.propertiesY = 0;
    this.buttonCoord = { "x" : this.x +30 ,
                    "y" : this.y + 150 ,
                    "width" : 80, 
                    "height" : 30,
                    "state" : true};
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

    equipItem : function(){
        var item = this.item.item;
        if (typeof item !== "undefined"){
            if(barcode.gameEngine.character.isItemWeared(item)){
                barcode.gameEngine.character.unequipItem(item);
            }else{
                barcode.gameEngine.character.equipItem(item);
            }
            this.hideMenu();
        }
    },

    clickEvent : function (evt){
        if(evt.pageX > this.x && evt.pageX < (this.x + this. width)
            && evt.pageY > this.y && evt.pageY < (this.y + this.height)){
            if (evt.pageX > this.buttonCoord.x && evt.pageX < (this.buttonCoord.x + this.buttonCoord.width)
            && evt.pageY > this.buttonCoord.y && evt.pageY < (this.buttonCoord.y + this.buttonCoord.height)
            && this.buttonCoord.state){
                barcode.contextualItem.equipItem();
            }
            return true;
        }else{
            return false;
        }
        
    },

    renderItemWeapon : function(){
        let text = "Vitesse d'attaque : " + this.item.item.speed;
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);

        this.propertiesY += 10;

        text = "Portee : " + this.item.item.range;
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);

        this.propertiesY += 10;

        text = "Degat : " + this.item.item.damage[0] + " - " + this.item.item.damage[1];
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);

        this.propertiesY += 10;

    },

    renderItemShield : function(){
        let text = "Chance de bloquer : " + this.item.item.chanceToBlock + "%";
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);

        this.propertiesY += 10;
    },

    renderItemPotion : function(){
        let text = "Type de potion : Soin";
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);

        this.propertiesY += 10;
        text = "Valeur  : " + this.item.item.value;
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);

        this.propertiesY += 10;
    },

    

    renderItem : function(){
        this.propertiesY = this.y + 13;
        this.ctx.font = "1Opx Arial";
        this.ctx.fillStyle = barcode.C.COLOR_CONTEXTUAL;
        console.log(this.item.item);
        let text = this.item.item.name;
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);
        
        this.propertiesY += 20;

        if (this.item.item.typeItem === barcode.C.TYPE_ITEM_WEAPON){
            this.renderItemWeapon();
        }else if (this.item.item.typeItem === barcode.C.TYPE_ITEM_SHIELD){
            this.renderItemShield();
        }else if(this.item.item.typeItem === barcode.C.TYPE_ITEM_POTION){
            this.renderItemPotion();
        }
    },

    renderEquipButton : function(){
        this.ctx.strokeStyle = barcode.C.COLOR_CONTEXTUAL;
        this.ctx.beginPath();
        this.ctx.rect(this.buttonCoord.x, this.buttonCoord.y, this.buttonCoord.width, this.buttonCoord.height);
        this.ctx.stroke(); 
        this.buttonCoord.state = true;
        if (barcode.gameEngine.character.isItemWearedByType(this.item.item.typeItem)){
            this.ctx.fillStyle = barcode.C.COLOR_GRADIANT_RED; 
            this.buttonCoord.state = false;
        }
        
        let text = "Equiper";
        if (this.item.item.status === barcode.C.ITEM_WEARED){
            text = "Retirer";
        }
        this.ctx.fillText(text ,
            this.buttonCoord.x + 20, 
            this.buttonCoord.y + 20);
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
            this.renderItem();
            this.renderEquipButton();
        }
    },

};