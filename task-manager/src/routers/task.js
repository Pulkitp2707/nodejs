const express = require('express')
const router = new express.Router()
const Task = require('../model/task.js')
const auth = require('../middleware/auth')

//Tasks
router.post('/tasks' , auth ,async (req,res) => {

    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // const task = new Task(req.body)
    // .save().then(() => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    // })
})


//GET /tasks?completed=true
//GET /tasks?limit=10&skip=2         //all the queries are string so we need to convert them into respective types to use it
router.get('/tasks', auth ,async (req, res) => {

    const match = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'             //this is done so that completed is a boolean 
    }

    try{
        // const tasks = await Task.find({ owner:req.user._id })
        await req.user.populate({
            path:'tasks',
            match: match,         //object
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.send(500).send()
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    // const task = await Task.findById(_id)
    const task = await Task.findOne({ _id , owner:req.user._id })
    try{
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})


//update task
router.patch('/tasks/:id', auth ,async (req, res) => {
    const updates= Object.keys(req.body)
    const allowedUpdates= ['description' , 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update!'})
    }

    try{

        const task = await Task.findOne({ _id: req.params.id, owner:req.user._id })


        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        task.save() 
        // const task = await Task.findByIdAndUpdate(req.params.id , req.body , { new:true , runValidators:true })    //new is for sending the updated user
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

//delete a task
router.delete('/tasks/:id' , auth ,async (req,res) => {
    const task = await Task.findByOneDelete({_id:req.params.id, owner: req.user._id})

    if(!task){
        return res.status(404).send()
    }

    res.send(task)
})

module.exports = router
