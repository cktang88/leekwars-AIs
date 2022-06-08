/**
 * Welcome to Leek Wars!
 * To know how the game works: leekwars.com/help/general
 * To learn the LeekScript language: leekwars.com/help/tutorial
 * To learn more about the available functions: leekwars.com/help/documentation
**/

// This is a very basic example code:
global lastdist

var ME = getEntity()
var ENGAGE_RANGE = getWeaponMaxRange(WEAPON_PISTOL)+6 // 6 chosen b/c likely sum(moves) > 6 while enemy move likely < 6
if(getWeapon(ME) != WEAPON_PISTOL) {
setWeapon(WEAPON_PISTOL); // Warning: costs 1 TP
}

// We get the nearest enemy
var enemy = getNearestEnemy();

// We move towards him
while(getMP(ME) > 0){
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
	}
	if(canUseChip(CHIP_SPARK, enemy)) {
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
// if(canUseWeapon(WEAPON_PISTOL, enemy) and !canUseWeapon(WEAPON_MACHINE_GUN, enemy)) setWeapon (WEAPON_PISTOL)

// try moving away (max move 4)
while(getMP(ME) > 0 and getLife(enemy) >0 and getCellDistance(getCell(ME), getCell(enemy)) < ENGAGE_RANGE) {
	moveAwayFrom(enemy)
}
if(getLife(enemy) > 0){
lastdist = getCellDistance(getCell(ME), getCell(enemy))
	}
