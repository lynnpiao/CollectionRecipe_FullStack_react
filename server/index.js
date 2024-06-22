const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const IngredientRoute = require('./routes/IngredientRoute.js')
const ProcedureRoute = require('./routes/ProcedureRoute.js')
const RecipeRoute = require('./routes/RecipeRoute.js')
const ReviewRoute = require('./routes/ReviewRoute.js')
const UserRoute = require('./routes/UserRoute.js')


// express init
const app = express();
const port = 8000;

// express config
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan("dev"));

//requests
app.use(IngredientRoute);
app.use(ProcedureRoute);
app.use(RecipeRoute);
app.use(ReviewRoute);
app.use(UserRoute);


// Connect to the database and start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

module.exports = app;