function reduceDamageFromArmor(damage, creature){
    damage = (1 - (creature.armor / 100)) * damage;
    return damage;
}