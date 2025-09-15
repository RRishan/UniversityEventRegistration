const app = require('./app.js');
const connect = require('./config/DBconnection.js')



const host = process.env.HOST;
const port = process.env.PORT || 3000;

connect();

const server = app.listen(port, host, () => {
    console.log(`Connected Succsfully !! port : ${server.address().port}`)
})