/**
 * Welcome to Leek Wars!
 * To know how the game works: leekwars.com/help/general
 * To learn the LeekScript language: leekwars.com/help/tutorial
 * To learn more about the available functions: leekwars.com/help/documentation
**/

global lastdist

var ME = getEntity()
var ENGAGE_RANGE = getWeaponMaxRange(WEAPON_MAGNUM)+6 // 6 chosen b/c likely sum(moves) > 6 while enemy move likely < 6
if(!getWeapon(ME)) {
setWeapon(WEAPON_MAGNUM); // Warning: costs 1 TP
}

// We get the nearest enemy
var enemy = getNearestEnemy();
var dist = getCellDistance(getCell(ME), getCell(enemy))

var canSafeRetreat = canUseChip(CHIP_CURE, ME) and getCooldown(CHIP_CURE, ME) == 0 and getLife(ME) < getTotalLife(ME) * 0.7 and dist + getMP() > getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy)

if(canSafeRetreat or getLife(ME) < 100 and getLife(enemy) > 200){
	debug('retreating')
	useChip(CHIP_KNOWLEDGE, ME)
	useChip(CHIP_CURE, ME)
	setWeapon(WEAPON_MAGNUM)
	moveAwayFrom(enemy, max(0, getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy) - dist + 1))
	return;
}

// We move towards him
while(getMP(ME) > 0){
	enemy = getNearestEnemy();
	var mindist = getPathLength(getCell(ME), getCell(enemy))
	if(mindist < 1){
		break
	}
	if(canUseWeapon(enemy) and getWeapon(enemy) == WEAPON_BROADSWORD){
		// use range if enemy is broadsword user lmao
		break
	} 
   moveToward(enemy, 1);
}
dist = getCellDistance(getCell(ME), getCell(enemy))
var pathlen = getPathLength(getCell(), getCell(enemy))
if(!canUseWeapon(enemy) and getWeapon() == WEAPON_BROADSWORD and canUseWeapon(WEAPON_MAGNUM, enemy)){
	setWeapon(WEAPON_MAGNUM)
}
if(canUseWeapon(WEAPON_BROADSWORD, enemy) and getWeapon() != WEAPON_BROADSWORD){
	setWeapon(WEAPON_BROADSWORD)
}
if(!canUseWeapon(enemy) and pathlen <= ENGAGE_RANGE + 4) {
	// 3-turn cooldown chips
	if(canUseChip(CHIP_SOLIDIFICATION, ME)){
	useChip(CHIP_SOLIDIFICATION, ME)
	}
	if(canUseChip(CHIP_SHIELD, ME)){
		useChip(CHIP_SHIELD, ME)
	}
}

if(dist <= ENGAGE_RANGE){
	var isFullHealth = getLife() == getTotalLife()
	// don't go into first fight without buff
	if(!canUseWeapon(enemy) 
	   or canUseChip(CHIP_MOTIVATION, ME) and isFullHealth
	  ) {
		useChip(CHIP_MOTIVATION, ME)
		useChip(CHIP_PROTEIN, ME)
		useChip(CHIP_HELMET, ME)
	}
}

if(canUseChip(CHIP_STALACTITE, enemy)) { 
	useChip(CHIP_STALACTITE, enemy) // highest damage
} 


if(canUseChip(CHIP_ROCK, enemy)) { // high damage pref
	useChip(CHIP_ROCK, enemy)
} 

// recalc for multi-enemy battles
enemy = getNearestEnemy();
if(canUseWeapon(enemy)){
	useWeapon(enemy);
	enemy = getNearestEnemy();
	useWeapon(enemy);
	enemy = getNearestEnemy();
	useWeapon(enemy);
	enemy = getNearestEnemy();
	useWeapon(enemy);
}
enemy = getNearestEnemy();
// TODO: if afterwards still have some TP left (from motivation), use spell
if(canUseChip(CHIP_FLASH, enemy) and dist > 1) { // don't selfkill lol
	useChip(CHIP_FLASH, enemy)
} 
if(canUseChip(CHIP_FLAME, enemy)) {
	useChip(CHIP_FLAME, enemy) // no cooldown so keep using lol
	useChip(CHIP_FLAME, enemy)
	useChip(CHIP_FLAME, enemy)
	useChip(CHIP_FLAME, enemy)
}
if(canUseChip(CHIP_ICE, enemy)) {
	useChip(CHIP_ICE, enemy) // no cooldown so keep using lol
	useChip(CHIP_ICE, enemy)
	useChip(CHIP_ICE, enemy)
	useChip(CHIP_ICE, enemy)
}
if(canUseChip(CHIP_SPARK, enemy)) {
	useChip(CHIP_SPARK, enemy) // no cooldown so keep using lol
	useChip(CHIP_SPARK, enemy)
	useChip(CHIP_SPARK, enemy)
	useChip(CHIP_SPARK, enemy)
}
if(canUseChip(CHIP_CURE, ME) and getLife(ME) < getTotalLife(ME)){
	useChip(CHIP_CURE, ME)
}

enemy = getNearestEnemy();
dist = getPathLength(getCell(ME), getCell(enemy))
if(getWeapon(enemy) == WEAPON_BROADSWORD) {
	enemy = getNearestEnemy();
	// try moving away (max move 4)
	while(getMP(ME) > 0 and getLife(enemy) >0 and getCellDistance(getCell(ME), getCell(enemy)) < ENGAGE_RANGE) {
		var actual_move = moveAwayFrom(enemy, 1)
		if(actual_move == 0){
			break // prevent inf loops
		}
	}
}

if (dist < 1){
	setWeapon(WEAPON_BROADSWORD)
}
