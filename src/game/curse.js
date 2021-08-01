'use strict';
var barcode = barcode || {};

barcode.Curse = function(){
  this.typeCurse = -1;
  this.duration = 0;
  this.startTick = 0;
};


barcode.Curse.prototype = {
  init : function(typeCurse,duration = 2000){
    let d = new Date();
    this.startTick = d.getTime();
    this.duration = duration;
    this.typeCurse = typeCurse;
  },

  isActive : function(){
    let d = new Date();
    let tick = d.getTime();
    if (tick > (this.startTick + this.duration)){
        return false;
    }
    return true;
  },
};
