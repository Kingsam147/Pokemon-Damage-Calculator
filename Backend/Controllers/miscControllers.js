const {items, natures, movesList,  typeChart, abilities, statuses } = require('../Config/jsonOptions.js'); 
const { finalHP, finalStats } = require('../Domain/statCalculator.js')
const calcDefenseTypes = require('../Domain/typeInteractions');

const getItems = (req, res) => res.status(200).json({
    message: 'successfully retreived the items', 
    items: items
});

const getNatures = (req, res) => res.status(200).json({
    message: "sucessfully retreived the natures", 
    natures: natures
});

const getMoves = (req, res) => res.status(200).json({
    message: "Successfully retreived the moves", 
    movesData: movesList
});

const getTypes = (req, res) => res.status(200).json({
    message: "Sucessfully retreived the types", 
    types: typeChart
});

const getAbilities = (req, res) => res.status(200).json({
    message: 'Successfully found the ability list', 
    abilitiesData: abilities
})

const calcStats = (req, res) =>{

    const pokemon = req.body.pokemonData;

    // console.log(pokemon.statBoosts)

    const stats = {
        HP: finalHP(pokemon.baseStats.HP, pokemon.EVs.HP, pokemon.IVs.HP, pokemon.level), 
        ...finalStats(pokemon.baseStats, pokemon.EVs, pokemon.IVs, pokemon.nature, pokemon.level, pokemon.statBoosts)
    }

    res.status(200).json({
        message: 'Recalculated the stats', 
        stats: stats
    });
} 

const getStatuses = (req, res) => {

    return res.status(200).json({
        message: "Successfully retreived the statuses", 
        statuses: statuses
    });
}

const getDefenseTypes = (req, res) => {

    try {
        const types = [req.params.type1, req.params.type2];

        const typeChart = calcDefenseTypes(types, typeChart);

        return res.status(200).json({
            message: "Successfully retreived the Type interactions", 
            TypeInteractions: typeChart
        });
    } catch (err) {
        return res.status(500).json({
            message: "failed to retreive Pokemon Types",
            err
        })
    }
}



module.exports = { getItems, getNatures, getMoves, getTypes, getAbilities, calcStats, getStatuses, getDefenseTypes }