const express = require('express');
const dotenv = require('dotenv')
dotenv.config();
const { graphqlHTTP }= require('express-graphql');
const schema = require('./schema/shcema');
const connectDataBase = require('./connection/db')
const app = express();


const port = process.env.PORT;
const dataBase = process.env.DATA_CONNECTION


connectDataBase(dataBase);


app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(port,()=>{
    console.log(`server connectd at the port ${port}`)
})


