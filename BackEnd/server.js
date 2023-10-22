

const express = require('express');
const app = express();
const port = 7000;

const cors = require('cors');

// Add cors before routes
app.use(cors());

const routes = require('./routes'); 

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});