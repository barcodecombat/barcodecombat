'use strict';
var barcode = barcode || {};

barcode.ContextualItem = function (){
    this.active = false;
    this.ctx = null;
    this.item = null;
    this.height = 200;
    this.width = 200;
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

    renderProperties : function(){
        if ( (this.item.item.properties.length > 0 )){
            let text = "Proprietes magiques"
            this.ctx.fillText(text ,
                this.x + 50, 
                this.propertiesY + 10);
            this.propertiesY += 40;
        }
        var _this = this;
        this.item.item.properties.forEach(function(prop){
            let text = "";
            if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIGHT_RADIUS){
                text = "Luminosite : ";
            }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_MODIFIER){
                text = "Bonus de vie : ";
            }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER){
                text = "Degat supplementaire : ";
            }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_LIFE_REGENERATION){
                text = "Regeneration de vie : ";
            }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_SPEED_MODIFIER){
                text = "Bonus de vitesse d'attaque : ";
            }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER){
                text = "Bonus de vitesse de mouvement : ";
            }else if (prop.typeproperty === barcode.C.PROPERTY_ITEM_ATTACK_ELEMENT_ICE){
                text = "Degat elementaire de glace : ";
            }

            text += prop.value;
            _this.ctx.fillText(text ,
                              _this.x + 5, 
                              _this.propertiesY);
            _this.propertiesY += 20;
        });
    },

    renderItem : function(){
        this.chooseFontColor();
        this.propertiesY = this.y + 13;
        this.ctx.font = "1Opx Arial";
        let text = "Nom de l'objet : " + this.item.item.name;
        this.ctx.fillText(text ,
            this.x + 5, 
            this.propertiesY);
        
        this.propertiesY += 20;
        text = "Rarete : " +  barcode.C.RARITY[this.item.item.rarity];
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

        this.renderProperties();
    },

    renderEquipButton : function(){
        this.ctx.beginPath();
        this.ctx.rect(this.buttonCoord.x, this.buttonCoord.y, this.buttonCoord.width, this.buttonCoord.height);
        this.ctx.stroke(); 
        this.buttonCoord.state = true;
        this.chooseFontColor();
        let text = "Equiper";
        if (this.item.item.status === barcode.C.ITEM_WEARED){
            text = "Retirer";
        }else if (barcode.gameEngine.character.isItemWearedByType(this.item.item.typeItem)){
            this.ctx.fillStyle = barcode.C.COLOR_GRADIANT_RED; 
            this.buttonCoord.state = false;
        }
        this.ctx.fillText(text ,
            this.buttonCoord.x + 20, 
            this.buttonCoord.y + 20);
    },

    chooseFontColor : function(){
        if (this.item.item.rarity === barcode.C.RARITY_COMMON){
            this.ctx.fillStyle = barcode.C.INVENTORY_RARITY_COMMON_FONT_COLOR;
        }else if  (this.item.item.rarity === barcode.C.RARITY_UNCOMMON){
            this.ctx.fillStyle =  barcode.C.INVENTORY_RARITY_UNCOMMON_FONT_COLOR; 
        }else if  (this.item.item.rarity === barcode.C.RARITY_UNIQUE){
            this.ctx.fillStyle =  barcode.C.INVENTORY_RARITY_UNIQUE_FONT_COLOR; 
        }else if  (this.item.item.rarity === barcode.C.RARITY_LEGEND){
            this.ctx.fillStyle =  barcode.C.INVENTORY_RARITY_LEGEND_FONT_COLOR; 
        }
    },

    renderBoxColorContextual : function(){
        if (this.item.item.rarity === barcode.C.RARITY_COMMON){
            this.ctx.fillStyle = barcode.C.INVENTORY_RARITY_COMMON_BACKGROUND_COLOR;
            this.ctx.strokeStyle = barcode.C.INVENTORY_RARITY_COMMON_BORDER_COLOR;
        }else if  (this.item.item.rarity === barcode.C.RARITY_UNCOMMON){
            this.ctx.fillStyle =  barcode.C.INVENTORY_RARITY_UNCOMMON_BACKGROUND_COLOR;
            this.ctx.strokeStyle = barcode.C.INVENTORY_RARITY_UNCOMMON_BORDER_COLOR;
        }else if  (this.item.item.rarity === barcode.C.RARITY_RARE){   
            this.ctx.fillStyle =  barcode.C.INVENTORY_RARITY_RARE_BACKGROUND_COLOR;
            this.ctx.strokeStyle = barcode.C.INVENTORY_RARITY_RARE_BORDER_COLOR;
        }else if  (this.item.item.rarity === barcode.C.RARITY_LEGEND){
            this.ctx.fillStyle =  barcode.C.INVENTORY_RARITY_LEGEND_FONT_COLOR;
            this.ctx.strokeStyle = barcode.C.INVENTORY_RARITY_LEGEND_BORDER_COLOR;
        }
    },

    render : function(showbutton = true){
        if (this.item !== null && this.active === true){
            this.ctx = barcode.canvas.canvasAnimation.getContext("2d");
            this.renderBoxColorContextual();
            this.ctx.fillRect(this.x,this.y,this.width,this.height);
            this.ctx.beginPath();
            this.ctx.rect(this.x,this.y,this.width,this.height);
            this.ctx.stroke(); 
            this.renderItem();
            if (showbutton) this.renderEquipButton();
        }
    },

};