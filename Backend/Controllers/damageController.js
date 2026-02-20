const { calculate, Pokemon, Move, Field, Generations } = require('@smogon/calc');
const { species2, allMoves, typeChart } = require('../Config/jsonOptions');
const calcDefenseType = require('../Domain/typeInteractions')

const getPokemonOverrides = (pokemonName) => {
    const data = species2[pokemonName];
    if (!data) return {}; 

    return {
        baseStats: {
            hp: data.baseStats.hp,
            atk: data.baseStats.atk,
            def: data.baseStats.def,
            spa: data.baseStats.spa,
            spd: data.baseStats.spd,
            spe: data.baseStats.spe
        },
        types: data.types.filter(t => t && t !== "None")
    };
};

const changedAbilities = ["Illusion", "Defeatist", "Corrosion", "Iron Fist", "Rivalry", "Mega Launcher", "Bulletproof", "Water Compaction", "Flower Gift", "Liquid Voice", "Reckless"]
    
const newAbilities = ["Striker", "Feline Prowess", "Sage Power", "ORAORAORAORA", "Bad Company", "Parasitic Waste", "Mountaineer", "Bull Rush", "Primal Armor", "Self Sufficient", "Fatal Precision", "Bone Zone", "Blubber Defense", "Cash Splash", "Quill Rush", "Phoenix Down"];



// Add your Radical Red ability fixes here
const applyRadicalRedAbilityFixes = (damageArray, attacker, defender, move, field, abilityToggles = {}) => {
    let modifier = 1;

    // abilities being altered 
    

    // ===== ATTACKER ABILITIES =====

    // if illusion is up then gets attack boost
    if (attacker.ability === "Illusion" && abilityToggles.illusion) {
        modifier *= 1.3;
    }

    // defiast threshold has been decreased to 33% from 50%
    if (attacker.ability === "Defeatist") {
        const hpPercent = attacker.currentHP / attacker.maxHP; 
        const vanillaBoost = hpPercent <= 0.5 ? 0.5 : 1;
        const rrBoost = hpPercent <= 0.33 ? 0.5 : 1; 
        modifier = rrBoost / vanillaBoost;
    }

    // corrosion now allows poison types to hit steel types
    if (attacker.ability === "Corrosion" && move.type === "Poison" && defender.types.includes("Steel")) {
        
        const tempDefenderOverrides = {
            ...getPokemonOverrides(defender.name), 
            types: getPokemonOverrides(defender.name).types.filter(t => t !== "Steel")
        };
    }

    // iron fist got a damage boost and no longer boost wicked blow
    if (attacker.ability === "Iron Fist" && move.flags?.punch === 1) {
        modifier *= 1.3 / 1.2; // RR boost / vanilla boost

        if (attacker.move.name === "Wicked Blow") modifier = 1/1.2;

    }

    // rivalry always gives damage boost regardless of gender
    if (attacker.ability === "Rivalry" && attacker.gender !== defender.gender) {
        multiplier /= 0.75; // undo reduction 
        multiplier *= 1.25;
    }

    // mega launcher now also boosts Snipe Shot, Flash Cannon, Spike Cannon
    if (attacker.ability === "Mega Launcher" && (move.name === "Flash Cannon" || move.name === "Spike Cannon" || move.name === "Snipe Shot")) {
        multiplier *= 1.5;
    }

    // also gives a 1.2 boosts to all sound moves
    if (attacker.ability === "Liquid Voice" && move.sound === 1) {
        multiplier *= 1.2;
    }

    // now also boosts explosion, self-destruct, and misty explosion
    if (attacker.ability === "Reckless" && (move.name === "Explosion" || move.name === "Self-Destruct" || move.name === "Misty Explosion")) {
        multiplier *= 1.2;
    }

    // Now also blocks Snipe Shot, Flash Cannon, and Spike Cannon
    if (defender.ability === "Bulletproof" && (move.name === "Snipe Shot" || move.name === "Flash Cannon" || move.name === "Spike Cannon")) {
        multiplier = 0;
    }

    // Now reduces water type damage by 50% on top of what it does
    if (defender.ability === "Water Compaction" && move.type === "Water") {
        multipler = 0.5;
    }
    

    // no longer boosts special defense
    if (defender.ability === "Flower Gift" && field.hasWeather("Sun")) {
        modifier /= 1.5
    }

    // these abilities don't really get boosted just accounting for new abilities

    if (attacker.ability === "Bad Company" || defender.ability === "Bad Company") {

    }

    if (attacker.ability === "Parasitic Waste" || defender.ability === "Parasitic Waste") {

    }

    if (attacker.ability === "Self Sufficient" || defender.ability === "Self Sufficient") {

    }

    if (attacker.ability === "Phoenix Down" || defender.ability === "Phoenix Down") {

    }



    // do influence damage but are new abilities
    if (attacker.ability === "Sharpness" && move.flags.slicing === 1) {
        // raise critical hit chance by 1 stage 
        // not sure how to do this
    }

    if (attacker.ability === "Striker" && move.flags.kick === 1) {
        modifier *= 1.3
    }

    if (attacker.ability === "Feline Prowess" && move.category === "Special") {
        modifier *= 2
    }

    if (attacker.ability === "Sage Power" && move.category === "Special") {
        modifier *= 1.5
    }

    if (attacker.ability === "ORAORAORAORA" && move.field.punch === 1) {
        modifier *= 1.5
    }

    if (attacker.ability === "Bull Rush" && attacker.Toggles.bullRush) {
        modifier *= 1.2
    }

    // if move is super effective then move gets boosted
    if (attacker.abillity === "Fatal Precision" && calcDefenseType(defender.types, typeChart)) {
        modifier *= 1.2;
    }

    //
    if (attacker.abillity === "Bone Zone") {

    }

    if (attacker.abillity === "Cash Splash") {

    }

    if (attacker.abillity === "Quill Rush") {

    }

    if (defender.ability === "Mountaineer") {

    }

    if (defender.ability === "Primal Armor") {

    }

    if (defender.ability === "Blubber Defense") {

    }

    if (defender.ability === "Cash Splash") {

    }








    // Apply modifier to all damage rolls
    return damageArray.map(d => Math.floor(d * modifier));
};

const calculateDamage = (req, res) => {
    try {
        const { attacker, defender, move, field } = req.body;
        const gen = Generations.get(9);

        // Create attacker Pokemon with custom base stats
        const p1 = new Pokemon(gen, attacker.name, {
            level: attacker.level,
            item: attacker.item,
            nature: attacker.nature,
            evs: attacker.evs,
            ivs: attacker.ivs,
            boosts: attacker.boosts,
            ability: attacker.ability,
            status: attacker.status,
            overrides: getPokemonOverrides(attacker.name)
        });

        // Create defender Pokemon with custom base stats
        const p2 = new Pokemon(gen, defender.name, {
            level: defender.level,
            item: defender.item,
            nature: defender.nature,
            evs: defender.evs,
            ivs: defender.ivs,
            boosts: defender.boosts,
            ability: defender.ability,
            status: defender.status,
            curHP: defender.currentHP,
            overrides: getPokemonOverrides(defender.name)
        });

        // Get move data from your database
        const sanitizedName = move.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const moveData = allMoves[sanitizedName];
        
        if (!moveData) {
            return res.status(404).json({
                message: `Move "${move.name}" not found in database`
            });
        }

        // Create move with your complete move data
        const moveObj = new Move(gen, move.name, {
            overrides: moveData
        });

        // Create field (weather, terrain, etc.)
        const fieldData = new Field(field || {});

        // Calculate damage using vanilla mechanics
        const result = calculate(gen, p1, p2, moveObj, fieldData);

        // ===== APPLY RADICAL RED ABILITY FIXES HERE =====
        const correctedDamage = applyRadicalRedAbilityFixes(
            result.damage,
            {
                ability: attacker.ability,
                currentHP: attacker.currentHP,
                maxHP: attacker.maxHP || p1.maxHP(),
                types: p1.types
            },
            {
                ability: defender.ability,
                types: p2.types
            },
            moveData,
            field,
            req.body.abilityToggles || {} // <-- Pass ability toggles from request
        );

        // Recalculate range and KO chance with corrected damage
        const correctedMin = Math.min(...correctedDamage);
        const correctedMax = Math.max(...correctedDamage);
        const defenderHP = defender.currentHP || p2.maxHP();
        
        return res.status(200).json({
            message: "Successfully calculated damage with Radical Red mechanics",
            calculation: {
                damage: correctedDamage,
                range: [
                    `${((correctedMin / defenderHP) * 100).toFixed(1)}%`,
                    `${((correctedMax / defenderHP) * 100).toFixed(1)}%`
                ],
                description: result.desc(), // Vanilla description
                koChance: result.koChance(), // This uses vanilla damage, could recalc if needed
                rrModifiersApplied: true
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to calculate damage",
            error: error.message
        });
    }
}

module.exports = { calculateDamage };