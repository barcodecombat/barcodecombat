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
  STATE_SCAN_INPROGRESS : 7,
  STATE_INVENTORY : 8,
  STATE_MENU_DEATH : 9,
  STATE_MENU_ENDDONJON_TOSHOW : 10,
  STATE_MENU_ENDDONJON_TOSHOW : 11,
  STATE_SCAN_RESULT : 12,

  //RARITY
  RARITY_LEGEND : 3,
  RARITY_LEGEND_MALUS : -20,
  RARITY_RARE : 2,
  RARITY_RARE_MALUS : -10,
  RARITY_UNCOMMON : 1,
  RARITY_UNCOMMON_MALUS : 0,
  RARITY_COMMON : 0,
  RARITY_STEP : 2,

  //direction
  DIRECTION_UP :0,
  DIRECTION_DOWN :3,
  DIRECTION_LEFT :1,
  DIRECTION_RIGHT :2,

  TILE_SIZE_PC : 32,
  TILE_SIZE_MOBILE : 64,
  TILE_SIZE_WINDOW_SIZE_LIMITE : 1200,

  ANIMATION_SPEED : 50,

//Animation type

  TYPE_ANIMATION_STATIC : 0,
  TYPE_ANIMATION_FLOATING : 1,
  TYPE_ANIMATION_TEXT_FLOATING : 1,

///ITEM TYPE
  TYPE_ITEM_JEWEL : 0,
  TYPE_ITEM_WEAPON : 1,
  TYPE_ITEM_SHIELD : 2,
  TYPE_ITEM_ARMOR : 3,

  // type item effects
  PROPERTY_ITEM_LIFE_REGENERATION : 0,
  PROPERTY_ITEM_LIFE_MODIFIER : 1,
  PROPERTY_ITEM_DAMAGE_MODIFIER : 2,
  PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER : 3,
  PROPERTY_ITEM_ATTACK_SPEED_MODIFIER : 4,
  PROPERTY_ITEM_LIGHT_RADIUS : 5,

  //Floating text color
  FT_COLOR_RED : "red",
  FT_COLOR_GREEN : "green",
  FT_COLOR_BLUE : "blue",
  FT_COLOR_BLACK : "black",
  FT_COLOR_WHITE : "white",
  FT_COLOR_GREY : "grey",
  FT_COLOR_TURQUOISE : "#bdffff",
  FT_COLOR_YELLOW : "#ffd720",
  FT_COLOR_YELLOW_COLD : "#f1ffd1",
  FT_COLOR_BROWN : "#8b7e66",
  FT_COLOR_MAGICAL : "#2debf1",

  //DEcor id
  DECOR_CHEST : 0,
  DECOR_DOOR : 1,

  // APPLY DECOR action
  ACTION_APPLY_DECOR_REMOVE_DECOR : 0,
  ACTION_APPLY_DECOR_CHANGE_SPRITE : 1,
  ACTION_APPLY_DECOR_END_DONJON : 2,

  //TILE STATE
  TILE_VISITED :1,
  TILE_NOT_VISITED : 0,

});
