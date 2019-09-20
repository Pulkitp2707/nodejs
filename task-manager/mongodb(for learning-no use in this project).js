// CRUD create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient        //provides functions necessary to connect to database to perform our basic operations
const { MongoClient , ObjectID } = require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id= new ObjectID()
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL , { useNewUrlParser: true } , (error , client)=> {
    if(error){
        return console.log('Unable to connect to database')
    }

    // console.log(client)
    const db = client.db(databaseName)      //returns a reference to the database


    //INSERTING DOCUMENTS//

    // db.collection('users').insertOne({
    //     name:'Pulkit' , 
    //     age: 20
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'First task',
    //         completed: false
    //     },
    //     {
    //         description: 'Second task',
    //         completed: false
    //     }
    // ])


    //UPDATING DOCUMENTS//

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5c0fe6634362c1fb75b9d6b5")
    // }, {
    //     $inc: {                    //MongoDB update operators
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

})