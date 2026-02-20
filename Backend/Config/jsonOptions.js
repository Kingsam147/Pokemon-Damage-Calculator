const fs = require("fs");
const path = require('path');

// the path to the folder with the JSON files
const models = path.join(__dirname, "..", "Models");

// reads each JSON file and parses through the JSON object
const myTeams = JSON.parse(fs.readFileSync(path.join(models, "boxes", "myTeams.json"), 'utf8')); 
const enemyTeams = JSON.parse(fs.readFileSync(path.join(models, "boxes", "enemyTeams.json"), 'utf8'));
const species = JSON.parse(fs.readFileSync(path.join(models, "species.json"), 'utf8'));
const species2 = JSON.parse(fs.readFileSync(path.join(models, "species2.json"), 'utf8'));
const movesList = JSON.parse(fs.readFileSync(path.join(models, "allMoves.json"), 'utf8'));
const avaliableTMS = JSON.parse(fs.readFileSync(path.join(models, "avaliableTutors+TMS", "avaliableTMS.json"), 'utf8'));
const abilities = JSON.parse(fs.readFileSync(path.join(models, "abilities.json"), 'utf8'));
const items = JSON.parse(fs.readFileSync(path.join(models, "items.json"), 'utf8')); 
const natures = JSON.parse(fs.readFileSync(path.join(models, "natures.json"), 'utf8')); 
const types = JSON.parse(fs.readFileSync(path.join(models, "types.json"), 'utf8')); 
const typeChart = JSON.parse(fs.readFileSync(path.join(models, 'typeChart.json'), 'utf8'));
const megaStones = JSON.parse(fs.readFileSync(path.join(models, 'megaStones.json'), 'utf8'));
const statuses = JSON.parse(fs.readFileSync(path.join(models, 'status.json'), 'utf8'));

const normalizedAbilities = JSON.parse(fs.readFileSync(path.join(models, 'normalizedStuff', 'normalizedAbilities.json'), 'utf8'));
const normalizedMoves = JSON.parse(fs.readFileSync(path.join(models, 'normalizedStuff', 'normalizedMoves.json'), 'utf8'));
const normalizedSpecies = JSON.parse(fs.readFileSync(path.join(models, 'normalizedStuff', 'normalizedSpecies.json'), 'utf8'));
const normalizedTypes = JSON.parse(fs.readFileSync(path.join(models, 'normalizedStuff', 'normalizedTypes.json'), 'utf8'));



const loadMyBoxes = async () => {
    const boxes = await fs.promises.readFile(path.join(models, "boxes", "myBoxes.json"), 'utf8');
    return JSON.parse(boxes);
}

const saveMyBoxes = async (newBoxes) => {
    await fs.promises.writeFile(path.join(models, "boxes", "myBoxes.json"), JSON.stringify(newBoxes, null, 2), 'utf8');
}

const loadTeams = async (player) => {
    const file = player === 1 ? 
        path.join(models, 'boxes', 'myTeams.json')
        : path.join(models, 'boxes', 'enemyTeams.json');

    const box = await fs.promises.readFile(file, 'utf8'); 

    return JSON.parse(box);
}

const saveTeams = async (player, newTeams) => player === 1 ? 
        await fs.promises.writeFile(path.join(models, 'boxes', 'myTeams.json'), JSON.stringify(newTeams, null, 2), 'utf8') : 
        await fs.promises.writeFile(path.join(models, 'boxes', 'enemyTeams.json'), JSON.stringify(newTeams, null, 2), 'utf8')

const findTeam = async (player, teamName) => {
    const allTeams = await loadTeams(player); 
    if ( !(teamName in allTeams) ) throw new Error(`can't find ${teamName} ${player === 1 ? "among my teams" : "among the enemy teams"}`); 
    return allTeams[teamName];
}

module.exports = {
    avaliableTMS, enemyTeams, items, myTeams, abilities, natures, species, species2, types, movesList, megaStones,
    normalizedAbilities, normalizedMoves, normalizedSpecies, normalizedTypes, typeChart, statuses,
    loadMyBoxes, saveMyBoxes, loadTeams, saveTeams, findTeam
};