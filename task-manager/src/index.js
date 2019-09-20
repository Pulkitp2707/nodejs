const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
// const bcrypt = require('bcryptjs')

const app = express()
const port = process.env.PORT || 3000



// without middleware - new request -> run route handler 
// with middleware - new request -> do something -> run route handler 


// app.use((req,res,next) => {                 //middleware-but this middleware is run before every route
//     console.log(req.method)
//     next()
// })





app.use(express.json())       //converts requested objects into json   //used for req object on functions
app.use(userRouter)           //registering user routes
app.use(taskRouter)           //registering task routes


app.listen(port , () => {
    console.log("Server is up on port " + port)
})

//Examples-

//uploading image

// const multer = require('multer')
// const upload = multer({
//     dest: 'images'
// })
// app.post('/upload' , upload.single('upload') , (req,res) => {
//     res.send()
// },(error,req,res,next) => {
//     res.status(400).send({ error: error.message })
// })



// using jwt

// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }
// myFunction()




// using .populate('').execPopulate()


const Task = require('./model/task')
const User = require('./model/user')

const main = async () =>{
    const task = await Task.findById('5d2858edd40f705b26c6a143')
    await task.populate('owner').execPopulate()
    console.log(task.owner)

    const user = await User.findById('5d2858e5d40f705b26c6a141')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()