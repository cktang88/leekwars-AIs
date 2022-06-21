function bulbAI(){
	var master = getSummoner()

	// We move towards him
	moveToward(master);

	if(search(getEffects(master), EFFECT_ABSOLUTE_SHIELD) == null){
		useChip(CHIP_HELMET, master);
	}
	if(getLife(master) < getTotalLife(master)){
		useChip(CHIP_BANDAGE, master);
	}
	useChip(CHIP_PROTEIN, master);
	var enemy = getNearestEnemy();
	if(canUseChip(CHIP_PEBBLE, enemy)){
		useChip(CHIP_PEBBLE, enemy);
	}
	if(getLife(master) < 150){
		// self-sacrifice lol
		moveToward(enemy)
	}else {
		moveAwayFrom(enemy)
	}
	
}
