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

// high damage pref
if(canUseChip(CHIP_FLASH, enemy) and getTP() % 3 == 1 and dist > 1) { // don't selfkill lol
	useChip(CHIP_FLASH, enemy) // perfect for 4 magic + 2x3 regular pistol
} else if(canUseChip(CHIP_FLAME, enemy) and getTP() % 3 == 1) {
	useChip(CHIP_FLAME, enemy) // perfect for 4 magic + 2x3 regular pistol
}
if(!canUseWeapon(enemy) and dist <= ENGAGE_RANGE) {
	useChip(CHIP_MOTIVATION, ME)
	useChip(CHIP_PROTEIN, ME)
	useChip(CHIP_HELMET, ME)

}
if(!canUseWeapon(enemy)){
	if(canUseChip(CHIP_ICE, enemy)) {
		useChip(CHIP_ICE, enemy)
		useChip(CHIP_ICE, enemy)
		useChip(CHIP_ICE, enemy)
		useChip(CHIP_ICE, enemy)
	}
	if(canUseChip(CHIP_SPARK, enemy)) {
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
		useChip(CHIP_SPARK, enemy)
	}
	if(canUseChip(CHIP_CURE, ME) and getLife(ME) < getTotalLife(ME)){
		useChip(CHIP_CURE, ME)
	}
} else {
	useWeapon(enemy);
	useWeapon(enemy);
	useWeapon(enemy);
	useWeapon(enemy); // max TP is 10, + 3 from using the chip
}
enemy = getNearestEnemy();
dist = getCellDistance(getCell(ME), getCell(enemy))
if (dist == 1 or dist ==2 and lineOfSight(getCell(), getCell(enemy))){
	// if good chance shoot w/ shotgun next turn, prep swap, since 1 extra TP now
	setWeapon(WEAPON_SHOTGUN)
}
