const mongoose = require('mongoose')


async function connectDataBase(data){
 try{
    mongoose.connect(data,{dbName:'MERN'});
    console.log('database connected successfully..')

 }catch(error){
    console.log(error.message)
 }
}

module.exports = connectDataBase;