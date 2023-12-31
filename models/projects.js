const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:[ 'Not started','In progress','Completed']

    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'client'
    }
})

module.exports = mongoose.model('project',projectSchema)