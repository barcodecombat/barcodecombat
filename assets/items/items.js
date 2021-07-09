var barcode = barcode || {};

barcode.items = {
  "1b" :
  {
    "typeItem":barcode.C.TYPE_ITEM_WEAPON,
    "rarity" : barcode.C.RARITY_COMMON,
    "name" : "epee simple",
    "speed" : 50,
    "range" : 32,
    "damage" : [3,7],
    "idimg" : 1
  },
  "1" :
  {
    "typeItem":barcode.C.TYPE_ITEM_WEAPON,
    "rarity" : barcode.C.RARITY_COMMON,
    "name" : "epee simple",
    "speed" : 50,
    "range" : 32,
    "damage" : [3,7],
    "idimg" : 1
  },
  "2" :
  {
    "typeItem":barcode.C.TYPE_ITEM_SHIELD,
    "rarity" : barcode.C.RARITY_COMMON,
    "name" : "bouclier en bois",
    "chanceToBlock" : 20,
    "idimg" : 2
  },
  "2b" :
  {
    "typeItem":barcode.C.TYPE_ITEM_SHIELD,
    "rarity" : barcode.C.RARITY_COMMON,
    "name" : "bouclier en bois",
    "chanceToBlock" : 20,
    "properties" :[
      { 'typeproperty' : barcode.C.PROPERTY_ITEM_DAMAGE_MODIFIER, 'value' : 50}
    ],
    "idimg" : 1
  },
  "3b" : {
    "typeItem":barcode.C.TYPE_ITEM_JEWEL,
    "rarity" : barcode.C.RARITY_UNCOMMON,
    "name" : "amulette",
    "idimg" : 3
  },
  "3" : {
    "typeItem": barcode.C.TYPE_ITEM_JEWEL,
    "rarity" : barcode.C.RARITY_COMMON,
    "name" : "amulette",
    "properties" : [
      { 'typeproperty' : barcode.C.PROPERTY_ITEM_LIFE_REGENERATION, 'value' : 1}
    ],
    "idimg" : 1
  }
  ,
  "4" : {
    "typeItem":barcode.C.TYPE_ITEM_POTION,
    "rarity" : barcode.C.RARITY_COMMON,
    "name" : "Potiuon de vie",
    "potiontype" : barcode.C.POTION_TYPE_HEAL,
    "value" : 20,
    "idimg" : 10
  }
};
