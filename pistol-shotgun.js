/**
 * Welcome to Leek Wars!
 * To know how the game works: leekwars.com/help/general
 * To learn the LeekScript language: leekwars.com/help/tutorial
 * To learn more about the available functions: leekwars.com/help/documentation
**/

// This is a very basic example code:
global lastdist

var ME = getEntity()
if(!getWeapon(ME)) {
setWeapon(WEAPON_SHOTGUN);
}

// We get the nearest enemy
var enemy = getNearestEnemy();
var ENGAGE_RANGE = getWeaponMaxRange(getWeapon(enemy))+6 // 6 chosen b/c likely sum(moves) > 6 while enemy move likely < 6

// We move towards him
while(getMP(ME) > 0){
	var mindist = getPathLength(getCell(ME), getCell(enemy))
	if(canUseWeapon(enemy)){
		break
	}
   moveToward(enemy, 1);
}
enemy = getNearestEnemy();
if(!canUseWeapon(enemy) and getWeapon() == WEAPON_SHOTGUN and canUseWeapon(WEAPON_PISTOL, enemy)){
	setWeapon(WEAPON_PISTOL)
}
var dist = getCellDistance(getCell(ME), getCell(enemy))

if(canUseChip(CHIP_ROCK, enemy) and !canUseWeapon(WEAPON_SHOTGUN, enemy)) { // high damage pref
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
dist = getCellDistance(getCell(ME), getCell(enemy))
if (dist == 1 or dist ==2 and lineOfSight(getCell(), getCell(enemy))){
	// if good chance shoot w/ shotgun next turn, prep swap, since 1 extra TP now
	setWeapon(WEAPON_SHOTGUN)
}
