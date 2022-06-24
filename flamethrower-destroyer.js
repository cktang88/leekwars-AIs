/**
 * Welcome to Leek Wars!
 * To know how the game works: leekwars.com/help/general
 * To learn the LeekScript language: leekwars.com/help/tutorial
 * To learn more about the available functions: leekwars.com/help/documentation
**/

function getPoisonSum(){
	var poisons = arrayFilter(getEffects(), function (e) { return e[0] == EFFECT_POISON})
	var vals = arrayMap(poisons, function(e){ return e[1]})
	return sum(vals)
}

include('bulb')

global lastdist

var ME = getEntity()
var ENGAGE_RANGE = getWeaponMaxRange(WEAPON_FLAME_THROWER)+6 // 6 chosen b/c likely sum(moves) > 6 while enemy move likely < 6

var pathlen = null
var enemy = getNearestEnemy();
var dist = getCellDistance(getCell(), getCell(enemy))
pathlen = getPathLength(getCell(), getCell(enemy))

debug('POISON: ' + getPoisonSum())
if(getPoisonSum() > 150){
	useChip(CHIP_ANTIDOTE, ME)
}

// only summon if >50% health
if(count(getSummons()) == 0 and getLife() > getTotalLife()/2){
	// 16 energy first turn = can summon two bulbs
	summon(CHIP_PUNY_BULB, getCell(ME) - 1, bulbAI)
	// fallback
	summon(CHIP_PUNY_BULB, getCell(ME) + 1, bulbAI)
	summon(CHIP_PUNY_BULB, getCell(ME) + 2, bulbAI)

	summon(CHIP_ROCKY_BULB, getCell(ME) - 1, bulbAI)
	// fallback
	summon(CHIP_ROCKY_BULB, getCell(ME) + 1, bulbAI)
	summon(CHIP_ROCKY_BULB, getCell(ME) + 2, bulbAI)
}

if(!getWeapon(ME)) {
setWeapon(WEAPON_FLAME_THROWER); // initial weapon
}

if(canUseChip(CHIP_VACCINE, ME) and getCooldown(CHIP_VACCINE, ME) == 0 and getLife(ME) < getTotalLife(ME) * 0.5 and pathlen + getMP() > getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy)){
	debug('retreating')
	useChip(CHIP_KNOWLEDGE, ME)
	useChip(CHIP_VACCINE, ME)
	moveAwayFrom(enemy, max(0, getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy) - dist + 1))
	return;
}
/*
if(canUseChip(CHIP_CURE, ME) and getCooldown(CHIP_CURE, ME) == 0 and getLife(ME) < getTotalLife(ME) * 0.7 and pathlen + getMP() > getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy)){
	debug('retreating')
	useChip(CHIP_KNOWLEDGE, ME)
	useChip(CHIP_CURE, ME)
	moveAwayFrom(enemy, max(0, getWeaponMaxRange(getWeapon(enemy)) + getMP(enemy) - dist + 1))
	return;
}*/

if(getWisdom(ME) > 100 and getLife(ME) < getTotalLife(ME) * 0.8){
	// obv has a buff, probably from last turn
	useChip(CHIP_VACCINE, ME)
	useChip(CHIP_CURE, ME)
}

// move towards enemy
while(getMP(ME) > 0 and getTurn() > 1){// stay back a bit to wait for bulb
	enemy = getNearestEnemy();
	var mindist = getPathLength(getCell(ME), getCell(enemy))
	if(mindist <= 1){
		break
	}
	if(canUseWeapon(WEAPON_FLAME_THROWER, enemy) or canUseWeapon(enemy)){
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

if(!canUseWeapon(enemy) and getWeapon() == WEAPON_FLAME_THROWER) {
	debug('try swap #1')
	if(dist == 1){
	    moveAwayFrom(enemy, 1) // try to back up, may fail if cornered
	}
	if(!canUseWeapon(enemy) and canUseWeapon(WEAPON_DESTROYER, enemy)){
		setWeapon(WEAPON_DESTROYER)
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

// recalc for multi-enemy battles
enemy = getNearestEnemy();
dist = getCellDistance(getCell(), getCell(enemy))
if(canUseWeapon(WEAPON_FLAME_THROWER, enemy)) {
	if(getWeapon() != WEAPON_FLAME_THROWER){
		setWeapon(WEAPON_FLAME_THROWER)
	}
} else {
	debug('foo')
	if(canUseWeapon(WEAPON_DESTROYER, enemy) and getWeapon() != WEAPON_DESTROYER){
		setWeapon(WEAPON_DESTROYER)
	}
}
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

enemy = getNearestEnemy();
dist = getCellDistance(getCell(), getCell(enemy))
// TODO: if afterwards still have some TP left (from motivation), use spell
// try using boost chips first if have leftover points after shooting
if(dist <= ENGAGE_RANGE){
	useChip(CHIP_MOTIVATION, ME)
	useChip(CHIP_PROTEIN, ME)
	useChip(CHIP_HELMET, ME)
}

if(canUseChip(CHIP_VENOM, enemy)) {
	useChip(CHIP_VENOM, enemy)
}

if(canUseChip(CHIP_ROCK, enemy)) { 
	useChip(CHIP_ROCK, enemy)
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
/***************
 * End of turn: use up any chips that are available
 ****************/
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

if(canUseChip(CHIP_WALL, ME) and getLife(ME) < getTotalLife(ME)){
	useChip(CHIP_WALL, ME)
}
if(count(getSummons()) == 0){
	summon(CHIP_PUNY_BULB, getCell(ME) - 1, bulbAI)
	// fallback
	summon(CHIP_PUNY_BULB, getCell(ME) + 1, bulbAI)
}

// set back to flamethrower so next turn moves properly
setWeapon(WEAPON_FLAME_THROWER)

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
