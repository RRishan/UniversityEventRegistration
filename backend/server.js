const app = require('./app.js');


require('dotenv').config();
const host = process.env.HOST;
const port = process.env.PORT || 3000;


const server = app.listen(port, host, () => {
    console.log(`Connected Succsfully !! port : ${server.address().port}`)
})