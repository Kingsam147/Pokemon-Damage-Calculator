const express = require('express'); 
const app = express(); 
const path = require('path'); 
const cors = require('cors'); 

const PORT = process.env.PORT || 3500; 

// middleware 
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 


app.use('/activePokemon', require(('./Routes/activePokemonRoutes')));
app.use('/myBoxes', require('./Routes/myBoxRoutes'));
app.use('/teams', require('./Routes/teamRoutes')); 
app.use('/misc', require('./Routes/miscRoutes'));
app.use('/', require('./Routes/pokemonRoutes'))

app.listen(PORT, () => console.log(`\nServer running on http://localhost:${PORT}`)); 
