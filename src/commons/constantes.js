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
  STATE_SHOW_PROPERTIES : 13,

  //RARITY
  RARITY_LEGEND : 3,
  RARITY_LEGEND_MALUS : -20,
  RARITY_RARE : 2,
  RARITY_RARE_MALUS : -10,
  RARITY_UNCOMMON : 1,
  RARITY_UNCOMMON_MALUS : 0,
  RARITY_COMMON : 0,
  RARITY_STEP : 2,

  //MONSTER
  MONSTER_BOLT_RED : 1,
  MONSTER_BOLT_PINK : 2,

  //POTIONS
  POTION_TYPE_HEAL : 1,

  //Defaut character value
  DEFAULT_MIN_DEGAT : 1,
  DEFAULT_MAX_DEGAT : 1,
  DEFAULT_CHANCE_TO_BLOCK : 0,
  DEFAULT_SPEED_ATTACK : 50,
  DEFAULT_RANGE_ATTACK : 64,
  DEFAULT_HITPOINT : 100,

  // CURSE & Blessing
  CURSE_FROZEN : 1,


//ANimation
  ANIMATION_SLASH_EPEE : 1,
  ANIMATION_BLOOD : 2,
  ANIMATION_SLASH_ICE : 3,

  //direction
  DIRECTION_UP :0,
  DIRECTION_DOWN :3,
  DIRECTION_LEFT :1,
  DIRECTION_RIGHT :2,

  TILE_SIZE_PC : 32,
  TILE_SIZE_MOBILE : 64,
  TILE_SIZE_WINDOW_SIZE_LIMITE : 1200,

  ANIMATION_SPEED : 50,

  ITEM_UNWEARED : 0,
  ITEM_WEARED : 1,

  //POTION TYPE
  POTION_TYPE_HEALING : 1,

  COLOR_CONTEXTUAL : "#2F4f4f",
  COLOR_TEXT : "#deebf8",
  COLOR_TEXT_CHOOSEN : "#5EB6DD",
  COLOR_TURQUOISE : "#bdffff",
  COLOR_CONTEXTUAL_BUTTON : "#587878",
  COLOR_GRADIANT_GREEN : "#89de20",
  COLOR_GRADIANT_YELLOW : "#f1eb20",
  COLOR_GRADIANT_ORANGE : "#f19C20",
  COLOR_GRADIANT_RED : "#f81a2d",
  COLOR_UI_BACKGROUND : "#9cb4f7",

//INVENTORY
  INVENTORY_RARITY_COMMON_BACKGROUND_COLOR : "grey",
  INVENTORY_RARITY_COMMON_BORDER_COLOR : "#bdffff",
  INVENTORY_RARITY_COMMON_FONT_COLOR : "#bdffff",
  INVENTORY_RARITY_UNCOMMON_BACKGROUND_COLOR : "#bdffff",
  INVENTORY_RARITY_UNCOMMON_BORDER_COLOR : "#2F4f4f",
  INVENTORY_RARITY_UNCOMMON_FONT_COLOR : "#2F4f4f",
  INVENTORY_RARITY_RARE_BACKGROUND_COLOR : "ffcc00",
  INVENTORY_RARITY_RARE_BORDER_COLOR : "2F4f4f",
  INVENTORY_RARITY_RARE_FONT_COLOR : "#2F4f4f",
  INVENTORY_RARITY_LEGEND_BACKGROUND_COLOR : "#640C52",
  INVENTORY_RARITY_LEGEND_BORDER_COLOR : "bdffff",
  INVENTORY_RARITY_LEGEND_FONT_COLOR : "#bdffff",
//Animation type

  TYPE_ANIMATION_STATIC : 0,
  TYPE_ANIMATION_FLOATING : 1,
  TYPE_ANIMATION_TEXT_FLOATING : 1,

///ITEM TYPE
  TYPE_ITEM_JEWEL : 0,
  TYPE_ITEM_WEAPON : 1,
  TYPE_ITEM_SHIELD : 2,
  TYPE_ITEM_ARMOR : 3,
  TYPE_ITEM_POTION : 4,
  TYPE_ITEM_GLOVE : 5,
  TYPE_ITEM_BOOT : 6,
  TYPE_ITEM_HELMET : 7,

  // type item effects
  PROPERTY_ITEM_LIFE_REGENERATION : 0,
  PROPERTY_ITEM_LIFE_MODIFIER : 1,
  PROPERTY_ITEM_DAMAGE_MODIFIER : 2,
  PROPERTY_ITEM_MOVEMENT_SPEED_MODIFIER : 3,
  PROPERTY_ITEM_ATTACK_SPEED_MODIFIER : 4,
  PROPERTY_ITEM_LIGHT_RADIUS : 5,
  PROPERTY_ITEM_ATTACK_ELEMENT_ICE : 6,
  PROPERTY_ITEM_CHANCE_TO_HIT : 7,
  PROPERTY_ITEM_ARMOR : 8,
  PROPERTY_ITEM_FREEZE : 106,

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
  DECOR_VASEBROKEN : 2,
  DECOR_COLONNE_BROKEN : 3,
  DECOR_COLONNE_GREYBRICKS : 4,
  DECOR_COLONNE_METALSTUCK : 5,
  DECOR_COLONNE_PLANCHES : 6,
  DECOR_COLONNE_SEAU : 7,
  DECOR_COLONNE_TONNEAU : 8,
  DECOR_COLONNE_TONNEAU_BRISE : 9,
  DECOR_COLONNE_TROU_HERBU : 10,

  // APPLY DECOR action
  ACTION_APPLY_DECOR_REMOVE_DECOR : 0,
  ACTION_APPLY_DECOR_CHANGE_SPRITE : 1,
  ACTION_APPLY_DECOR_END_DONJON : 2,

  //TILE STATE
  TILE_VISITED :1,
  TILE_NOT_VISITED : 0,

  //mob
  DISTANCE_MOB_SEE_PLAYER : 300,
  DELAY_BETWEEN_TWO_PATH_CREATION : 2000,

  RARITY : ["Commun", "Magique peu commun", "Rare", "Legendaire"],
});
