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
	if(canUseChip(CHIP_ROCK, enemy)){
		useChip(CHIP_ROCK, enemy);
	}
	if(canUseChip(CHIP_ROCKFALL, enemy)){
		useChip(CHIP_ROCKFALL, enemy);
	}
	if(getLife(master) < 200){
		// self-sacrifice lol
		moveToward(enemy)
	}else {
		moveAwayFrom(enemy)
	}
	
}
