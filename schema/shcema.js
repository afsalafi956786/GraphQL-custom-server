const PROJECT = require('../models/projects');
const CLIENT  = require('../models/client');

const { GraphQLObjectType,GraphQLID, GraphQLString,GraphQLEnumType, GraphQLSchema, GraphQLList,GraphQLNonNull } = require('graphql');
const projects = require('../models/projects');

const clientType  = new GraphQLObjectType({
    name:'Client',
   fields:()=>({
    id: {type:GraphQLID} ,
    name:{ type:GraphQLString},
    email:{ type:GraphQLString},
    phone:{ type:GraphQLString},
   })
})

const projectType = new GraphQLObjectType({
    name:'Project',
    fields:()=>({
        id:{ type:GraphQLID},
        name:{ type:GraphQLString},
        description:{ type:GraphQLString},
        status:{ type:GraphQLString},
        client :{
            type:clientType,
            resolve(parent,args){
                 return CLIENT.findById(parent.clientId)
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        projects:{
            type:new GraphQLList(projectType),
            resolve(parent,args){
              return  PROJECT.find();

            }
        },
        project:{
            type:projectType,
            args:{ id:{ type :GraphQLID}},
            resolve(parent,args){
             return PROJECT.findById(args.id)
            }
        },
        clients:{
            type:new GraphQLList(clientType),
            resolve(parent,args){
                return CLIENT.find();
            }
        },
        client :{
            type:clientType,
            args:{ id: { type: GraphQLID }},
            resolve(parent,args){
                return  CLIENT.findById(args.id)

            }
        }
    }
})

//mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        4 :{
           type:clientType,
           args:{
            name: { type: GraphQLNonNull(GraphQLString) },
            email: { type: GraphQLNonNull(GraphQLString) },
            phone:{ type: GraphQLNonNull(GraphQLString) },
           },
           async resolve(parent,args){
            if(!args.name){
                throw new Error ("Name is required")
            }
            if(!args.email){
                throw new Error (" Email is required")
            }

            const existClient = await CLIENT.findOne ({ email: args.email});
            if(existClient){
                throw new Error ( "Email is already registered")
            }
              const client = new CLIENT({
                name:args.name,
                email:args.email,
                phone:args.phone
              })
              return client.save()
           }

        },

        deleteClient :{
            type:clientType,
            args:{
                id: { type:GraphQLNonNull(GraphQLID)},
            },
            resolve ( parent , args){
                return CLIENT.findByIdAndDelete(args.id)
            }
        },
        
        addProject:{
            type:projectType,
            args:{
                name: { type:GraphQLNonNull(GraphQLString)},
                description:  { type:GraphQLNonNull(GraphQLString)},
                status:   {
                    type: new GraphQLEnumType({
                        name:'projectStatus',
                        values:{
                            'new':{ value : 'Not started'},
                            'progress':{ value : 'In progress'},
                            'completed' :{ value : 'Completed'},
                        }
                    }),
                    defaultValue: 'Not started',
                },
                clientId : { type :GraphQLNonNull (GraphQLString)},
            },
            resolve(parent,args){
                const projet = new PROJECT({
                    name:args.name,
                    description:args.description,
                    status :args.status,
                    clientId: args.clientId
                })
               return   projet.save()
            }
        }
    }
})


module.exports  = new GraphQLSchema({
    query:RootQuery,
    mutation

})