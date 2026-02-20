require('ts-node/register');
const path = require("path"); 
const fs = require("fs"); 

const data = path.join(__dirname, "..", "Models", "data"); 

const movesFile = require(path.join(data, "moves.ts"));
const itemsFile = require(path.join(data, "items.ts")); 
const abilitiesFile = require(path.join(data, "abilities.ts")); 
const typesFile = require(path.join(data, "types.ts")); 
const normalSpeciesFile = require(path.join(data, "species.ts"));

const normalTypes = typesFile.TYPE_CHART[9];
const items = itemsFile.ITEMS[9];
const normalMoves = movesFile.MOVES[9]
const abilities = abilitiesFile.ABILITIES[9];
const normalSpecies = normalSpeciesFile.SPECIES[9];

console.log(normalMoves)

module.exports = { 
    normalTypes, items, normalMoves, abilities, normalSpecies
};