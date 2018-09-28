var barcode = barcode || {};

barcode.items = {
  "1b" :
  {
    "typeItem":1,
    "rarity" : 0,
    "name" : "epee simple",
    "speed" : 50,
    "range" : 32,
    "damage" : [3,7],
    "idimg" : 1
  },
  "1" :
  {
    "typeItem":1,
    "rarity" : 0,
    "name" : "epee simple",
    "speed" : 50,
    "range" : 32,
    "damage" : [3,7],
    "properties" : [
      { 'typeproperty' : 2, 'value' : 10},
      { 'typeproperty' : 3, 'value' : 2},
      { 'typeproperty' : 4, 'value' : 50},
      { 'typeproperty' : 5, 'value' : 10}
    ],
    "idimg" : 1
  },
  "2" :
  {
    "typeItem":2,
    "rarity" : 0,
    "name" : "bouclier en bois",
    "chanceToBlock" : 20,
    "idimg" : 2
  },
  "2b" :
  {
    "typeItem":2,
    "rarity" : 0,
    "name" : "bouclier en bois",
    "chanceToBlock" : 20,
    "properties" :[
      { 'typeproperty' : 1, 'value' : 50}
    ],
    "idimg" : 1
  },
  "3b" : {
    "typeItem":0,
    "rarity" : 1,
    "name" : "amulette",
    "idimg" : 3
  },
  "3" : {
    "typeItem":0,
    "rarity" : 0,
    "name" : "amulette",
    "properties" : [
      { 'typeproperty' : 0, 'value' : 1}
    ],
    "idimg" : 1
  }
};
