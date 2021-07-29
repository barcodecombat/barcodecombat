function reduceDamageFromArmor(damage, creature){
    damage = Math.floor((1 - (creature.armor / 100)) * damage);
    return damage;
}