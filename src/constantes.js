'use strict';
//debugger;
var barcode = barcode || {};

barcode.C = Object.freeze({
  STATE_MENU_TO_SHOW : 0,
  STATE_MENU_SHOWN : 1,
  STATE_MENU_GOTO_DONJON : 2,
  STATE_DONJON_INPROGRESS : 3,
  STATE_DONJON_DEATH : 4,
  STATE_DONJON_QUIT : 5,
  STATE_GOTO_SCAN : 6,
  STATE_SCAN_INPROGRESS : 7
});
