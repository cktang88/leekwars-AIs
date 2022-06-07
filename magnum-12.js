/**
 * Welcome to Leek Wars!
 * To know how the game works: leekwars.com/help/general
 * To learn the LeekScript language: leekwars.com/help/tutorial
 * To learn more about the available functions: leekwars.com/help/documentation
**/

global lastdist

var ME = getEntity()
var ENGAGE_RANGE = getWeaponMaxRange(WEAPON_MAGNUM)+7 // 7 chosen b/c likely sum(moves) > 7 while enemy move likely < 7
if(!getWeapon(ME)) {
setWeapon(WEAPON_MAGNUM); // initial weapon
}


var enemy = getNearestEnemy();

// move towards enemy
while(getMP(ME) > 0){
	enemy = getNearestEnemy();
	var mindist = getPathLength(getCell(ME), getCell(enemy))
	if(canUseWeapon(enemy)){
		break
	} 
	if(true and lineOfSight(ME, enemy)){
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

if(!canUseWeapon(enemy) and dist <= ENGAGE_RANGE + 5) {
	// 3-turn cooldown chips
	useChip(CHIP_SOLIDIFICATION, ME)
	useChip(CHIP_SHIELD, ME)
}

if(!canUseWeapon(enemy) and dist <= ENGAGE_RANGE) {
	useChip(CHIP_MOTIVATION, ME)
	useChip(CHIP_PROTEIN, ME)
	useChip(CHIP_HELMET, ME)
}

if(canUseChip(CHIP_ROCK, enemy) and !canUseWeapon(WEAPON_LASER, enemy)) { 
	// laser > rock > pistol
	// 2 * laser > rock + 2 * pistol
	useChip(CHIP_ROCK, enemy)
} 

// recalc for multi-enemy battles
enemy = getNearestEnemy();
if(canUseWeapon(enemy)) {
	if(getWeapon() == WEAPON_MAGNUM){
		useWeapon(enemy);
		enemy = getNearestEnemy();
		if(canUseWeapon(WEAPON_LASER, enemy)) {
			setWeapon(WEAPON_LASER) // 5 + 1 + 6 = 12 TP
		}
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
	} else if (getWeapon() == WEAPON_LASER){
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
	}
} else {
	if (canUseWeapon(WEAPON_PISTOL, enemy) and getWeapon() == WEAPON_LASER) {
		// switch and fire 3x
		setWeapon(WEAPON_PISTOL)
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
		useWeapon(enemy);
		enemy = getNearestEnemy();
	}
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
	useChip(CHIP_SPARK, enemy)
}
if(canUseChip(CHIP_CURE, ME) and getLife(ME) < getTotalLife(ME)){
	useChip(CHIP_CURE, ME)
}

// if(canUseWeapon(WEAPON_PISTOL, enemy) and !canUseWeapon(WEAPON_MACHINE_GUN, enemy)) setWeapon (WEAPON_PISTOL)


enemy = getNearestEnemy();
// try moving away (max move 4)
while(getMP(ME) > 0 and getLife(enemy) >0 and getCellDistance(getCell(ME), getCell(enemy)) < ENGAGE_RANGE) {
	moveAwayFrom(enemy)
}
if(getLife(enemy) > 0){
lastdist = getCellDistance(getCell(ME), getCell(enemy))
	}
