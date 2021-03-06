/**
 * Welcome to Leek Wars!
 * To know how the game works: leekwars.com/help/general
 * To learn the LeekScript language: leekwars.com/help/tutorial
 * To learn more about the available functions: leekwars.com/help/documentation
**/

include('bulb')

global lastdist

var ME = getEntity()
var ENGAGE_RANGE = getWeaponMaxRange(WEAPON_DOUBLE_GUN)+6 // 6 chosen b/c likely sum(moves) > 6 while enemy move likely < 6
if(!getWeapon(ME)) {
setWeapon(WEAPON_DOUBLE_GUN); // initial weapon
}

var pathlen = null
var enemy = getNearestEnemy();
var dist = getCellDistance(getCell(), getCell(enemy))
pathlen = getPathLength(getCell(), getCell(enemy))

if(count(getSummons()) <=1){
	summon(CHIP_PUNY_BULB, getCell(ME) - 1, bulbAI)
}

if(canUseChip(CHIP_VACCINE, ME) and getCooldown(CHIP_VACCINE, ME) == 0 and getLife(ME) < getTotalLife(ME) * 0.7 and pathlen + getMP() > getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy)){
	debug('retreating')
	useChip(CHIP_KNOWLEDGE, ME)
	useChip(CHIP_VACCINE, ME)
	moveAwayFrom(enemy, max(0, getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy) - dist + 1))
	return;
}
if(canUseChip(CHIP_CURE, ME) and getCooldown(CHIP_CURE, ME) == 0 and getLife(ME) < getTotalLife(ME) * 0.7 and pathlen + getMP() > getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy)){
	debug('retreating')
	useChip(CHIP_KNOWLEDGE, ME)
	useChip(CHIP_CURE, ME)
	moveAwayFrom(enemy, max(0, getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy) - dist + 1))
	return;
}
if(canUseChip(CHIP_VENOM, enemy)) {
	useChip(CHIP_VENOM, enemy)
}
if(getWisdom(ME) > 100 and getLife(ME) < getTotalLife(ME) * 0.8){
	// obv has a buff, probably from last turn
	useChip(CHIP_VACCINE, ME)
	useChip(CHIP_CURE, ME)
}

// move towards enemy
while(getMP(ME) > 0 and getPathLength(getCell(ME), getCell(enemy)) > 1){ // prevent inf loops
	enemy = getNearestEnemy();
	var mindist = getPathLength(getCell(ME), getCell(enemy))

	if(canUseWeapon(enemy)){
		break
	} 
	if(true and lineOfSight(getCell(), getCell(enemy))){
		if (mindist == ENGAGE_RANGE 
			and lastdist > getCellDistance(getCell(ME), getCell(enemy)) // prevent draws
		   ) 
		{
			debug('stopped moving b/c at engage range')
			break
		}
	}
   moveToward(enemy, 1);
}
dist = getCellDistance(getCell(), getCell(enemy))

if(!canUseWeapon(enemy) and getWeapon() == WEAPON_DOUBLE_GUN) {
	debug('try swap #1')
	if(dist == 1){
	    moveAwayFrom(enemy, 1) // try to back up, may fail if cornered
	}
	if(!canUseWeapon(enemy) and canUseWeapon(WEAPON_SHOTGUN)){
		setWeapon(WEAPON_SHOTGUN)
	}
}
dist = getCellDistance(getCell(), getCell(enemy))
pathlen = getPathLength(getCell(), getCell(enemy))

if(!canUseWeapon(enemy) and pathlen <= ENGAGE_RANGE + 4) {
	// 3-turn cooldown chips
	useChip(CHIP_SOLIDIFICATION, ME)
	useChip(CHIP_ARMOR, ME)
	useChip(CHIP_SHIELD, ME)
}

if(dist <= ENGAGE_RANGE){
	var isFullHealth = getLife() == getTotalLife()
	// don't go into first fight without buff
	if(!canUseWeapon(enemy) 
	   or canUseChip(CHIP_MOTIVATION, ME) and isFullHealth
	  ) {
		useChip(CHIP_MOTIVATION, ME)
		useChip(CHIP_PROTEIN, ME)
		useChip(CHIP_ARMOR, ME)
		useChip(CHIP_HELMET, ME)
	}
}
if(canUseChip(CHIP_STALACTITE, enemy)) { 
	useChip(CHIP_STALACTITE, enemy) // highest damage
} 

if(canUseChip(CHIP_ROCK, enemy) and !canUseWeapon(WEAPON_DOUBLE_GUN, enemy)) { 
	// laser > rock > magnum
	// 2 * laser > rock + magnum
	useChip(CHIP_ROCK, enemy)
} 

// recalc for multi-enemy battles
enemy = getNearestEnemy();
dist = getCellDistance(getCell(), getCell(enemy))
if(canUseWeapon(enemy)) {
	if(getWeapon() == WEAPON_SHOTGUN){
		useWeapon(enemy);
		enemy = getNearestEnemy();
		/*
		if(canUseWeapon(WEAPON_DOUBLE_GUN, enemy)) {
			setWeapon(WEAPON_DOUBLE_GUN) // 5 + 1 + 6 = 12 TP
		} else {
			debug('try swap #2')
			if(getMP(ME) > 0 and lineOfSight(getCell(), getCell(enemy)) and getTP() >= 5) { // try moving one space and then swapping if can use this turn
				if(dist == 1){
					moveAwayFrom(enemy, 1)
				}
				if(canUseWeapon(WEAPON_DOUBLE_GUN, enemy)) {
					setWeapon(WEAPON_DOUBLE_GUN)
				}
			}
		}*/
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
	} else if (getWeapon() == WEAPON_DOUBLE_GUN){
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
	}
} else {
	if (canUseWeapon(WEAPON_DOUBLE_GUN, enemy) and getWeapon() == WEAPON_SHOTGUN) {
		// switch and fire
		setWeapon(WEAPON_DOUBLE_GUN)
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
	}
}

enemy = getNearestEnemy();
dist = getCellDistance(getCell(), getCell(enemy))
// TODO: if afterwards still have some TP left (from motivation), use spell
// try using boost chips first if have leftover points after shooting
if(dist <= ENGAGE_RANGE){
	useChip(CHIP_MOTIVATION, ME)
	useChip(CHIP_PROTEIN, ME)
	useChip(CHIP_HELMET, ME)
}

if(canUseChip(CHIP_FLASH, enemy) and dist > 1) { // don't selfkill lol
	useChip(CHIP_FLASH, enemy)
} 
if(canUseChip(CHIP_FLAME, enemy)) {
	var prevLife = getLife(enemy)
	useChip(CHIP_FLAME, enemy) // no cooldown so keep using lol
	if(getLife(enemy) < prevLife){
		// only keep using if effective
		useChip(CHIP_FLAME, enemy)
		useChip(CHIP_FLAME, enemy)
		useChip(CHIP_FLAME, enemy)
		useChip(CHIP_FLAME, enemy)
		useChip(CHIP_FLAME, enemy)
	}
}

if(canUseChip(CHIP_SPARK, enemy)) {
	var prevLife = getLife(enemy)
	useChip(CHIP_SPARK, enemy) // no cooldown so keep using lol
	if(getLife(enemy) < prevLife){
		// only keep using if effective
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
	}

}
if(canUseChip(CHIP_KNOWLEDGE, ME) and getLife() < getTotalLife()){
	// always use knowledge before cure
	// usually happens here when killed an enemy in one hit, still got TP left
	useChip(CHIP_KNOWLEDGE, ME)
}
if(canUseChip(CHIP_VACCINE, ME) and getLife(ME) < getTotalLife(ME)){
	useChip(CHIP_VACCINE, ME)
}
if(canUseChip(CHIP_CURE, ME) and getLife(ME) < getTotalLife(ME)){
	useChip(CHIP_CURE, ME)
}

enemy = getNearestEnemy();
// try moving away (max move 4)
while(getMP(ME) > 0 and getLife(enemy) >0 and getCellDistance(getCell(ME), getCell(enemy)) < ENGAGE_RANGE) {
	var actual_move = moveAwayFrom(enemy, 1)
	if(actual_move == 0){
		break // prevent inf loops
	}
}
if(getLife(enemy) > 0){
lastdist = getCellDistance(getCell(ME), getCell(enemy))
	}
